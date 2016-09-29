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


describe("function calculateHashes test", function () {
    it("测试计算data目录中的所有文件", function () {
        console.log('-----------------------------------------------------');
        return co(function*() {
            let result = yield calculateHashes(dataPath, [], resultPath);
            assert.equal(result, "abc.js,73e35fa87eee262319aaebf1de0d65ba64348422,9\nffc.txt,302c36eca3d1ad845bea5c0318e01a876b525a83,13\nbcd/bbc.html.js,e709c2a6efa543b0a457ce52ff72de876bd1b661,52\nbcd/ccc/file3,5e3d61ef6b90f7550f0744ea2de6c159c5d0b4b9,18\n");
        });

    });

    it("测试计算data目录中除去bcd下面的所有文件", function () {
        return co(function*() {
            console.log('-----------------------------------------------------');
            let result = yield calculateHashes(dataPath, ["bcd/"], resultPath);
            assert.equal(result, "abc.js,73e35fa87eee262319aaebf1de0d65ba64348422,9\nffc.txt,302c36eca3d1ad845bea5c0318e01a876b525a83,13\n");
        });

    });

    it("测试单个通配符*： ", function () {
        return co(function*() {
            console.log('-----------------------------------------------------');
            let result = yield calculateHashes(dataPath, ["*"], resultPath);

            assert.equal(result, "");
        });
    });

    it("测试通过单通配符排除文件： ", function () {
        return co(function*() {
            console.log('-----------------------------------------------------');
            let result = yield calculateHashes(dataPath, ["*/bbc.*.js"], resultPath);

            assert.equal(result, "abc.js,73e35fa87eee262319aaebf1de0d65ba64348422,9\nffc.txt,302c36eca3d1ad845bea5c0318e01a876b525a83,13\nbcd/ccc/file3,5e3d61ef6b90f7550f0744ea2de6c159c5d0b4b9,18\n");
        });
    });

    it("测试通过单通配符排除多级目录： ", function () {
        return co(function*() {
            console.log('-----------------------------------------------------');
            let result = yield calculateHashes(dataPath, ["**/*"], resultPath);

            assert.equal(result, "abc.js,73e35fa87eee262319aaebf1de0d65ba64348422,9\nffc.txt,302c36eca3d1ad845bea5c0318e01a876b525a83,13\n");
        });
    });

    it("测试多条件： ", function () {
        return co(function*() {
            console.log('-----------------------------------------------------');
            let result = yield calculateHashes(dataPath, ["**/*", "abc.js"], resultPath);

            assert.equal(result, "ffc.txt,302c36eca3d1ad845bea5c0318e01a876b525a83,13\n");
        });
    });

    it("测试字符串过滤-通配符： ", function () {
        return co(function*() {
            console.log('-----------------------------------------------------');
            let result = yield calculateHashes(dataPath, "**/*", resultPath);

            assert.equal(result, "abc.js,73e35fa87eee262319aaebf1de0d65ba64348422,9\nffc.txt,302c36eca3d1ad845bea5c0318e01a876b525a83,13\n");
        });
    });

    it("测试字符串过滤-指定文件路径： ", function () {
        return co(function*() {
            console.log('-----------------------------------------------------');
            let result = yield calculateHashes(dataPath, "abc.js", resultPath);

            assert.equal(result, "ffc.txt,302c36eca3d1ad845bea5c0318e01a876b525a83,13\nbcd/bbc.html.js,e709c2a6efa543b0a457ce52ff72de876bd1b661,52\nbcd/ccc/file3,5e3d61ef6b90f7550f0744ea2de6c159c5d0b4b9,18\n");
        });
    });
});