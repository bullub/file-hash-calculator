/**
 * Created by bullub on 16/9/29.
 */
"use strict";
const FileUtils = require("./FileUtils");
const path = require("path");
const co = require("co");
const PathFilterGenerator = require("./PathFilterGenerator");

module.exports = FileIterator;

/**
 * 文件迭代器
 * @param baseDir {String} 根路径，绝对路径
 * @param excludes {String} 被排除的路径，相对根路径，可使用通配符
 * @param filePathReceiver {Function} 文件路径接收器，每次返回一个文件的路径
 * @param onFinish {Function} 当整个目录中的文件迭代完成时触发
 */
function FileIterator(baseDir, excludes, filePathReceiver, onFinish) {

    let pathFilter = PathFilterGenerator(baseDir, excludes);

    iteratorFiles(baseDir, pathFilter, filePathReceiver, onFinish);

}

/**
 * 迭代所有文件
 * @param dir {String} 绝对路径
 * @param pathFilter {Function} 文件路径过滤器
 * @param filePathReceiver {Function} 文件路径接收器
 * @param onFinish {String} 当迭代完成时回调
 */
function iteratorFiles(dir, pathFilter, filePathReceiver, onFinish) {
    let pending = 0,
        complete = 0;

    function listDir(dir, pathFilter) {
        co(function* (){
            pending ++;
            let filesInDir = yield FileUtils.readDirAsync(dir, pathFilter),
                fileStats;
            //遍历当前目录下的文件
            for(let i = 0, len = filesInDir.length; i < len; i ++) {
                fileStats = yield FileUtils.statsAsync(filesInDir[i]);
                if(fileStats.isDirectory()) {
                    listDir(filesInDir[i], pathFilter);
                } else if(fileStats.isFile()) {
                    filePathReceiver(filesInDir[i]);
                }
            }
        }).then(function() {
            complete ++;
            if(complete === pending) {
                //回主线程回调
                setTimeout(onFinish, 0);
            }
        });
    }

    listDir(dir, pathFilter);
}