'use strict';

var clc = require('../');

var text = '.........\n' + '. Hello .\n' + '.........\n';
var style = { ".": clc.yellowBright("X") };

process.stdout.write(clc.art(text, style));
