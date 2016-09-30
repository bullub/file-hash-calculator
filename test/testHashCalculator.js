/**
 * Created by bullub on 16/9/30.
 */
/**
 * Created by bullub on 16/9/29.
 */
"use strict";
const HashCalculator = require("../src/lib/HashCalculator");
const assert = require("assert");

describe("class HashCalculator test", function () {

    it("测试计算MD5", function () {
        let hashCalculator = new HashCalculator("md5");
        hashCalculator.update("123");
        let result = hashCalculator.digest('hex');
        assert.equal(result, '202cb962ac59075b964b07152d234b70');
    });

    it("测试计算SHA1", function () {
        let hashCalculator = new HashCalculator();
        hashCalculator.update("123");
        let result = hashCalculator.digest('hex');
        assert.equal(result, '40bd001563085fc35165329ea1ff5c5ecbdbbeef');
    });


    it("测试计算SHA256", function () {
        let hashCalculator = new HashCalculator("sha256");
        hashCalculator.update("123");
        let result = hashCalculator.digest('hex');
        assert.equal(result, 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3');
    });
});