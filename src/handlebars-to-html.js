let fs = require("fs");
let glob = require("glob");
let Handlebars = require("handlebars");
let mkdirp = require("mkdirp");
let path = require("path");

function registerPartials (pattern, folderPath) {
    var files = glob.sync(pattern);

    if (!files.length) {
        throw new Error(`No partial files found for pattern ${pattern}`);
    }

    if (process.env.debug) {
        console.log("Files", files);
    }

    files.forEach(file => {
        var source = fs.readFileSync(file).toString(),
            fileName = file.replace(folderPath, "").replace(path.extname(file), "");

        Handlebars.registerPartial(fileName, source);

        if (process.env.debug) {
            console.log("File registered with name", fileName);
        }
    });
}

function writeFiles (pattern, folderPath) {
    var files = glob.sync(pattern);

    if (!files.length) {
        throw new Error(`No template files found for pattern ${pattern}`);
    }

    if (process.env.debug) {
        console.log("Templates", files);
    }

    files.forEach(file => {
        var source = fs.readFileSync(file).toString(),
            template = Handlebars.compile(source),
            distDirectory = path.dirname(file).replace(folderPath, ""),
            distPath;

        if (distDirectory === folderPath.slice(0, folderPath.length - 1)) {
            distPath = path.basename(file, ".hbs") + ".html";
        } else {
            distPath = distDirectory + path.sep + path.basename(file, ".hbs") + ".html";
        }

        mkdirp.sync(distDirectory);
        fs.writeFileSync(distPath, template());

        if (process.env.debug) {
            console.log("Template written to", distPath);
        }
    });
}

const api = {
    registerPartials,
    writeFiles
};

module.exports = api;
