/**
 * Created by bullub on 16/9/29.
 */
"use strict";
const fs = require('mz/fs');
const path = require("path");
const co = require("co");
const assert = require('assert');
const calculateHashes = require("..");
const dataPath = path.join(__dirname, "data");
const resultPath = path.join(__dirname, "hashresult.txt");
const options = {
    outputFilePath: resultPath
};

describe("function calculateHashes test", function () {
    it("测试计算data目录中的所有文件", function () {
        console.log('-----------------------------------------------------');
        return co(function*() {
            let result = yield calculateHashes(dataPath, options);
            assert.equal(result, "abc.js,73e35fa87eee262319aaebf1de0d65ba64348422,9\nffc.txt,302c36eca3d1ad845bea5c0318e01a876b525a83,13\nbcd/bbc.html.js,e709c2a6efa543b0a457ce52ff72de876bd1b661,52\nbcd/ccc/file3,5e3d61ef6b90f7550f0744ea2de6c159c5d0b4b9,18\n");
        });
    });

    it("测试计算data目录中除去bcd下面的所有文件", function () {
        return co(function*() {
            console.log('-----------------------------------------------------');
            options.excludes = ["bcd/"];
            let result = yield calculateHashes(dataPath, options);
            assert.equal(result, "abc.js,73e35fa87eee262319aaebf1de0d65ba64348422,9\nffc.txt,302c36eca3d1ad845bea5c0318e01a876b525a83,13\n");
        });

    });

    it("测试单个通配符*： ", function () {
        return co(function*() {
            console.log('-----------------------------------------------------');
            options.excludes = ["*"];
            let result = yield calculateHashes(dataPath, options);

            assert.equal(result, "");
        });
    });

    it("测试通过单通配符排除文件： ", function () {
        return co(function*() {
            console.log('-----------------------------------------------------');
            // let result = yield calculateHashes(dataPath, ["*/bbc.*.js"], resultPath);
            options.excludes = ["*/bbc.*.js"];
            let result = yield calculateHashes(dataPath, options);
            assert.equal(result, "abc.js,73e35fa87eee262319aaebf1de0d65ba64348422,9\nffc.txt,302c36eca3d1ad845bea5c0318e01a876b525a83,13\nbcd/ccc/file3,5e3d61ef6b90f7550f0744ea2de6c159c5d0b4b9,18\n");
        });
    });

    it("测试通过单通配符排除多级目录： ", function () {
        return co(function*() {
            console.log('-----------------------------------------------------');
            // let result = yield calculateHashes(dataPath, ["**/*"], resultPath);
            options.excludes = ["**/*"];
            let result = yield calculateHashes(dataPath, options);
            assert.equal(result, "abc.js,73e35fa87eee262319aaebf1de0d65ba64348422,9\nffc.txt,302c36eca3d1ad845bea5c0318e01a876b525a83,13\n");
        });
    });

    it("测试多条件： ", function () {
        return co(function*() {
            console.log('-----------------------------------------------------');
            // let result = yield calculateHashes(dataPath, ["**/*", "abc.js"], resultPath);
            options.excludes = ["**/*", "abc.js"];
            let result = yield calculateHashes(dataPath, options);
            assert.equal(result, "ffc.txt,302c36eca3d1ad845bea5c0318e01a876b525a83,13\n");
        });
    });

    it("测试字符串过滤-通配符： ", function () {
        return co(function*() {
            console.log('-----------------------------------------------------');
            // let result = yield calculateHashes(dataPath, "**/*", resultPath);
            options.excludes = "**/*";
            let result = yield calculateHashes(dataPath, options);
            assert.equal(result, "abc.js,73e35fa87eee262319aaebf1de0d65ba64348422,9\nffc.txt,302c36eca3d1ad845bea5c0318e01a876b525a83,13\n");
        });
    });

    it("测试字符串过滤-指定文件路径： ", function () {
        return co(function*() {
            console.log('-----------------------------------------------------');
            // let result = yield calculateHashes(dataPath, "abc.js", resultPath);
            options.excludes = "abc.js";
            let result = yield calculateHashes(dataPath, options);
            assert.equal(result, "ffc.txt,302c36eca3d1ad845bea5c0318e01a876b525a83,13\nbcd/bbc.html.js,e709c2a6efa543b0a457ce52ff72de876bd1b661,52\nbcd/ccc/file3,5e3d61ef6b90f7550f0744ea2de6c159c5d0b4b9,18\n");
        });
    });

    it("不传可选参数： ", function () {
        return co(function*() {
            console.log('-----------------------------------------------------');
            let result = yield calculateHashes(dataPath);

            assert.equal(result, "abc.js,73e35fa87eee262319aaebf1de0d65ba64348422,9\nffc.txt,302c36eca3d1ad845bea5c0318e01a876b525a83,13\nbcd/bbc.html.js,e709c2a6efa543b0a457ce52ff72de876bd1b661,52\nbcd/ccc/file3,5e3d61ef6b90f7550f0744ea2de6c159c5d0b4b9,18\n");
        });
    });

    it("测试md5算法： ", function () {
        return co(function*() {
            console.log('-----------------------------------------------------');
            delete options.excludes;
            options.algorithm = "md5";
            let result = yield calculateHashes(dataPath, options);
            assert.equal(result, "abc.js,8b59340fcffa5914c276bf622e37ac9d,9\nffc.txt,47b63c211db3404a3368396f6fc27596,13\nbcd/bbc.html.js,dc48f4ca5056b9acb764f5d36882c765,52\nbcd/ccc/file3,56936a27b9ac351316ecfdec315215e9,18\n");
        });
    });

    it("测试sha256算法： ", function () {
        return co(function*() {
            console.log('-----------------------------------------------------');
            delete options.excludes;
            options.algorithm = "sha256";
            let result = yield calculateHashes(dataPath, options);
            // console.log(result);
            assert.equal(result, "abc.js,cbb94f124255de5e8cf9cdebf1ca00464fd907aac7820143c3ed55a3e74621d7,9\nffc.txt,9fe21caf9cc3b252bb50e2c31e5bee6ca2e7c9a843e04ef5d7ec8a57e6effd98,13\nbcd/bbc.html.js,76276b012864eb89a2741c5e3574cbb5cfb39a9fbcff000821e7c4cbf523a304,52\nbcd/ccc/file3,4cd66e0767d460c9f7c4add44b79b0d3fd2cdfc7b8b2c85c5a4253c3929c2c81,18\n");
        });
    });

    it("测试多文件满队列： ", function () {
        return co(function*() {
            console.log('-----------------------------------------------------');
            options.fileOpenLimit = 1;
            yield calculateHashes(path.join(__dirname, ".."), options);

            // assert.equal(result, "abc.js,73e35fa87eee262319aaebf1de0d65ba64348422,9\nffc.txt,302c36eca3d1ad845bea5c0318e01a876b525a83,13\nbcd/bbc.html.js,e709c2a6efa543b0a457ce52ff72de876bd1b661,52\nbcd/ccc/file3,5e3d61ef6b90f7550f0744ea2de6c159c5d0b4b9,18\n");
        });
    });
});