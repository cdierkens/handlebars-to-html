#!/usr/bin/env node
"use strict";

var _commander = require("commander");

var _commander2 = _interopRequireDefault(_commander);

var _handlebarsToHtml = require("./handlebars-to-html");

var _handlebarsToHtml2 = _interopRequireDefault(_handlebarsToHtml);

var _package = require("../package.json");

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.version(_package2.default.version).usage("-templates <pattern> -d <path>").description("Write handlebars templates to a directory as static html.").option("-d, --directory", "output directory").option("-H, --helpers", "path to JavaScript file containing helpers").option("-p, --partials [pattern]", "glob pattern to match partial files").option("-t, --templates <pattern>", "glob pattern to match template files").option("-v, --verbose", "output more information to console").parse(process.argv);

if (_commander2.default.verbose) {
    process.env.debug = true;
}

if (_commander2.default.partials) {
    _handlebarsToHtml2.default.registerPartials(_commander2.default.partials);
}

_handlebarsToHtml2.default.writeFiles(_commander2.default.templates);