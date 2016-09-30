/**
 * Created by bullub on 16/9/30.
 */
"use strict";
const FileUtils = require("../src/lib/FileUtils");
const assert = require("assert");
const path = require("path");
const co = require("co");
const testFilePath = path.join(__dirname, "data/abc.js");

describe("class HashCalculator test", function () {

    it("测试计算单个", function () {
        return co(function*(){
            let result = yield new Promise((resolve, reject) => {
                FileUtils.readFileAndCalculateHashAndSize(testFilePath, function (path, hash, size){
                    resolve({
                        path,
                        hash,
                        size
                    });
                });
            });

            assert.equal(result.hash, '73e35fa87eee262319aaebf1de0d65ba64348422');
            assert.equal(result.size, 9);
        });
    });

    it("测试计算多个文件满队列", function () {
        return co(function*(){
            for(var i = 0; i < 1000; i ++) {
                // let result = yield new Promise((resolve, reject) => {
                FileUtils.readFileAndCalculateHashAndSize(testFilePath, function (path, hash, size){
                    assert.equal(hash, '73e35fa87eee262319aaebf1de0d65ba64348422');
                    assert.equal(size, 9);
                }, "sha1", 1);
            }
        });
    });

});