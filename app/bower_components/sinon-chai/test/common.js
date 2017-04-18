"use strict";

global.chai = require("chai");
global.should = require("chai").should();
global.expect = require("chai").expect;
global.AssertionError = require("chai").AssertionError;

global.swallow = function (thrower) {
    try {
        thrower();
    } catch (e) { }
};

var sinonChai = require("../lib/sinon-chai");
chai.use(sinonChai);
