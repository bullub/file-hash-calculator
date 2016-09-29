/**
 * Created by bullub on 16/9/29.
 */
"use strict";
const crypto = require("crypto");

exports.calculateHash = calculateHash;

/**
 * 根据算法计算hash值
 * @param content {String|Buffer} 用于计算散列值的内容
 * @param algorithm {String} 计算散列值的算法
 */
function calculateHash(content, algorithm="sha1") {

    //根据算法创建hash
    let hash = crypto.createHash(algorithm);

    hash.update(content);

    return hash.digest('hex');
}