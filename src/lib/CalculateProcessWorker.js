/**
 * Created by bullub on 16/9/29.
 */
"use strict";
const HashCalculator = require("./HashCalculator");
const fs = require("fs");
const path = require("path");
const co = require("co");

process.on('message', function (message) {

    if(message === 'close') {
        process.exit();
        return ;
    }

    let results = [];
    let {files, baseDir, cpId} = message,
        completed = 0;


    for (let i = 0, buffer, len = files.length; i < len; i++) {
        buffer = fs.readFileSync(files[i]);
        results.push({
            path: files[i].replace(baseDir, ''),
            hash: HashCalculator.calculateHash(buffer),
            size: buffer.length
        });
    }

    process.send({cpId:cpId, results: results});
    // process.exit();
});
