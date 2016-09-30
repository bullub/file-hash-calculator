/**
 * Created by bullub on 16/9/29.
 */
"use strict";
const fs = require("fs"),
    path = require("path"),
    HashCalculator = require("./HashCalculator");

//默认只能同时打开1000个
const OPEN_FILE_LIMIT = 1024;
const openFileQueue = [];
//当前已打开文件个数
let currentOpened = 0;

module.exports = {
    statsAsync,
    readDirAsync,
    readFileAndCalculateHashAndSize
};

/**
 * 获取文件状态信息
 * @param filePath {String} 文件绝对路径
 * @returns {Promise}
 */
function statsAsync(filePath) {
    return new Promise((resolve, reject) => {
        fs.stat(filePath, function(err, stats) {
            if(err) {
                reject(err);
            } else {
                resolve(stats);
            }
        });
    });
}

/**
 * 异步读取目录内容，返回promise
 * @param dir {String} 目录绝对路径
 * @param pathFilter {Function} 路径过滤器
 * @returns {Promise}
 */
function readDirAsync(dir, pathFilter) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, function (err, files) {
            if(err) {
                reject(err);
                return ;
            }
            let _files = [];
            for(let i = 0, filePath, len = files.length; i < len; i ++) {
                filePath = path.join(dir, files[i]);
                //过滤文件
                if(pathFilter(filePath)) {
                    _files.push(filePath);
                }
            }
            resolve(_files);
        });
    });
}

/**
 * 读取文件，并且计算hash值和文件大小
 * @param filePath {String} 文件绝对路径
 * @param onFinish {Function} 计算完成回调
 * @param algorithm {String} 用于计算Hash的算法名
 * @param fileOpenLimit {Number} 单进程能打开的最大文件数
 */
function readFileAndCalculateHashAndSize(filePath, onFinish, algorithm, fileOpenLimit) {

    fileOpenLimit || (fileOpenLimit = OPEN_FILE_LIMIT);

    //防止 EMFILE 错误，将最大打开文件数控制在1024个，其余排队
    if(currentOpened >= fileOpenLimit) {
        openFileQueue.unshift({path: filePath, onFinish, algorithm, fileOpenLimit});
        return ;
    }

    let fileSize = 0;
    let hashCalculator = new HashCalculator(algorithm);

    currentOpened ++;

    let fis = fs.createReadStream(filePath);

    fis.on("readable", function() {
        // console.log("readable", filePath);
        var chunk;
        while (null !== (chunk = fis.read())) {
            hashCalculator.update(chunk);
            fileSize += chunk.length;
        }
    });
    fis.on("end", function() {
        // fis.close();
        onFinish(filePath, hashCalculator.digest('hex'), fileSize);

        currentOpened --;

        if(openFileQueue.length > 0) {
            let item = openFileQueue.pop();
            readFileAndCalculateHashAndSize(item.path, item.onFinish, item.algorithm, item.fileOpenLimit);
        }
    });
}