/**
 * Created by bullub on 16/9/29.
 */
"use strict";
const crypto = require("crypto");

class HashCalculator {
    constructor(algorithm="sha1") {
        this.hash = crypto.createHash(algorithm);
    }
    update(buffer) {
        this.hash.update(buffer);
    }
    digest(encoding) {
        return this.hash.digest(encoding);
    }
}

module.exports = HashCalculator;