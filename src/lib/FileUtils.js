/**
 * Created by bullub on 16/9/29.
 */
"use strict";
const fs = require("fs"),
    path = require("path");

module.exports = {
    statsAsync,
    readDirAsync
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