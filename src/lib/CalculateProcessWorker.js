/**
 * Created by bullub on 16/9/29.
 */
"use strict";
const HashCalculator = require("./HashCalculator");
const FileUtils = require("./FileUtils");
const path = require("path");

process.on('message', function (message) {

    if(message === 'close') {
        process.exit();
        return ;
    }

    let results = [];
    let {files, algorithm, baseDir, cpId, fileOpenLimit} = message;
    let total = files.length;
    let completed = 0;

    /**
     * 计算完成
     * @param path {String} 文件绝对路径
     * @param hash {String} 文件内容hash值
     * @param fileSize {Number} 文件大小
     */
    function onCalculateFinish(path, hash, fileSize) {
        results.push({
            path: path.replace(baseDir, ''),
            hash: hash,
            size: fileSize
        });
        completed ++;
        //当前进程的所有文件计算完成
        if(completed === total) {
            process.send({cpId:cpId, results: results});
        }
    }

    for (let i = 0; i < total; i++) {
        let path = files[i];

        //使用stream去读取，通过缓冲区读取
        FileUtils.readFileAndCalculateHashAndSize(path,onCalculateFinish, algorithm, fileOpenLimit);
    }
});


