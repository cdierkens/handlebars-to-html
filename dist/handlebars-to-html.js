"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

var _handlebars = require("handlebars");

var _handlebars2 = _interopRequireDefault(_handlebars);

var _mkdirp = require("mkdirp");

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function registerPartials(pattern) {
    var files = _glob2.default.sync(pattern);

    if (!files.length) {
        throw new Error("No partial files found for pattern " + pattern);
    }

    if (process.env.debug) {
        console.log("Partials", files);
    }

    files.forEach(function (file) {
        // TODO: Does readFileSync exist in node 0.10/0.12?
        var source = _fs2.default.readFileSync(file).toString(),
            partialName = file.replace(_path2.default.extname(file), "");

        _handlebars2.default.registerPartial(partialName, source);

        if (process.env.debug) {
            console.log("Partial registered with name", partialName);
        }
    });
}

function writeFiles(pattern) {
    var files = _glob2.default.sync(pattern);

    if (!files.length) {
        throw new Error("No template files found for pattern " + pattern);
    }

    if (process.env.debug) {
        console.log("Templates", files);
    }

    files.forEach(function (file) {
        var source = _fs2.default.readFileSync(file).toString(),
            template = _handlebars2.default.compile(source),
            distDirectory = _path2.default.dirname(file).replace("source" + _path2.default.sep + "pages", "dist"),
            distPath = distDirectory + _path2.default.sep + _path2.default.basename(file, ".hbs") + ".html";

        _mkdirp2.default.sync(distDirectory);
        _fs2.default.writeFileSync(distPath, template());

        if (process.env.debug) {
            console.log("Template written to", distPath);
        }
    });
}

var api = {
    registerPartials: registerPartials,
    writeFiles: writeFiles
};

exports.default = api;