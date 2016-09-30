/**
 * Created by bullub on 16/9/28.
 */
"use strict";
const childProcess = require("child_process");
const os = require("os");
const fs = require("fs");
const path = require("path");
const FileIterator = require('./lib/FileIterator');

module.exports = calculateHashes;

/**
 * 开始计算hash值
 * @param baseDir {String} 根路径，绝对路径
 * @param filePaths {Array} 所有文件路径
 * @param algorithm {String} 用于计算hash的算法
 * @param fileOpenLimit {Number} 单进程能打开的最大文件数
 * @param onFinish {Function} 计算完成
 * @param outputItemFormatter {Function} 格式化单项输出的函数
 */
function startCalculators(baseDir, filePaths, algorithm, fileOpenLimit, onFinish, outputItemFormatter) {

    let cpus = os.cpus().length,
        fileNums = filePaths.length,
        avgNums = Math.floor(fileNums / cpus),
        messageString = "",
        //已计算完成的进程数
        completed = 0,
        //子进程集合
        childProcesses = [];

    if(!filePaths || !filePaths.length) {
        onFinish("");
    }

    if(cpus >= fileNums) {
        cpus = 1;
        avgNums = fileNums;
    }

    /**
     * 从子进程接收消息的函数
     * @param message {消息}
     */
    function onChildProcessMessage(message) {
        //线程在数组中的位置， 计算得到的结果
        let {cpId, results} = message;

        for(let i = 0, len = results.length; i < len; i ++) {
            messageString += outputItemFormatter(results[i]);
        }
        //完成个数标记加一
        completed ++;
        //给子线程发消息，告诉他可以退出了
        childProcesses[cpId].send("close");
        //当所有cpu上的子进程都完成了，则所有都已完成
        if(completed === cpus) {
            onFinish(messageString);
        }
    }

    for(let i = 0, start = 0, end = avgNums; i < cpus; i ++) {

        //最后一个cpu处理余下部分
        if(end > fileNums || i === cpus -1) {
            end = fileNums;
        }

        //使用单个cpu计算一部分
        calculateOne({
            fileOpenLimit,
            algorithm,
            files: filePaths.slice(start, end),
            baseDir: baseDir + path.sep
        }, onChildProcessMessage, childProcesses);
        //下一个cpu处理的文件递进
        start = end;
        end += avgNums;
    }
}

/**
 * 计算单块数据
 * @param data {Object} 数据
 * @param onResults {Function} 子进程处理完成之后的结果
 * @param childProcesses {Array} 所有子进程的集合
 */
function calculateOne(data, onResults, childProcesses) {
    let child = childProcess.fork(path.join(__dirname, 'lib/CalculateProcessWorker.js'));
    childProcesses.push(child);
    child.on('message', onResults);
    data.cpId = childProcesses.length - 1;
    child.send(data);
}

/**
 * 计算哈希值
 * @param srcDir {String} 源路径
 * @param options {Object} 可选参数，调用配置
 *              {
 *                  excludes: {String|Array}    排除的文件
  *                 outputFilePath: {String} 结果输出的文件路径
  *                 algorithm: {String} hash算法名，默认： "sha1"， 可选： "sha256","md5"...
  *                 fileOpenLimit: {Number} 单进程能打开的最大文件数
 *              }
 * @param outPutItemFormatter {Function} 输出数据的单项格式化函数
 */
function calculateHashes(srcDir, options, outPutItemFormatter=defaultOutPutItemFormatter) {

    let files = [];

    options || (options = {});

    let {excludes, outputFilePath, algorithm, fileOpenLimit} = options;

    return new Promise((resolve, reject)=>{
        //迭代出所有文件
        console.time("Iterate files task");
        FileIterator(srcDir, excludes, function(filePath) {
            files.push(filePath);
        }, function finish() {
            console.log(`文件个数: ${files.length}`);
            console.timeEnd("Iterate files task");

            //计算hash
            console.time("File hash calculate task");
            startCalculators(srcDir, files, algorithm, fileOpenLimit, function(results){
                if(!!outputFilePath) {
                    fs.writeFile(outputFilePath, results, {encoding: 'utf-8'});
                }
                console.timeEnd("File hash calculate task");
                resolve(results);
            }, outPutItemFormatter);
        });
    });
}

/**
 * 默认的格式化单个文件信息的内容
 * @param item {Object} 单个文件的信息
 * @returns {string} 返回单行路径，hash值,文件长度
 */
function defaultOutPutItemFormatter(item) {
    return `${item.path},${item.hash},${item.size}\n`;
}
