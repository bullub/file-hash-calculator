/**
 * Created by bullub on 16/9/30.
 */
const fhc = require('..');
const path = require("path");


fhc(path.join(__dirname, ".."))
    .then((results) => {
        "use strict";
        console.log(results);
    });