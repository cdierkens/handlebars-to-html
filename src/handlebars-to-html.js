import fs from "fs";
import glob from "glob";
import Handlebars from "handlebars";
import mkdirp from "mkdirp";
import path from "path";

function fileContents (file) {
    return fs.readFileSync(file).toString()
}

function files (directory) {
    var files = glob.sync(path.join(directory, pattern));

    if (process.env.debug) {
        console.log(`Files for ${pattern}`, files);
    }

    return files;
}

function isDirectory(directory) {
    if (!fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) {
        return false;
    }
    return true;
}

function relativePath (file, directory, extension = "") {
    return file.replace(directory, "").replace(path.extname(file), extension);
}

function templatePath (file, directory, extension = "html") {
    return relativePath(file, directory, extension);
}

function partialName (file, directory) {
    return relativePath(file, directory);
}

/**
 * Register partials for use inside your templates.
 * @param {string} directory - Directory path to use as the base of the search pattern.
 * @param {string} pattern - Glob pattern to match files on inside of the search directory.
 */
function registerPartials (directory, pattern) {
    if (!isDirectory(directory)) {
        throw Error(`${directory} is not a directory`);
    }

    directory = path.normalize(`${directory}${path.sep}`);

    files(directory, pattern).forEach(file => {
        var source = fileContents(file),
            name = partialName(file, directory);

        Handlebars.registerPartial(name, source);

        if (process.env.debug) {
            console.log("Partial registered with name", name);
        }
    });
}

/**
 * Write templates to an output directory.
 * @param {string} directory - Directory path to use as the base of the search pattern.
 * @param {string} pattern - Glob pattern to match files on inside of the search directory.
 * @param {string} outDirectory - Directory where templates will be written as HTML.
 */
function writeTemplates (directory, pattern, outDirectory) {
    if (!isDirectory(directory)) {
        throw Error(`${directory} is not a directory`);
    }

    directory = path.normalize(`${directory}${path.sep}`);
    outDirectory = path.normalize(`${outDirectory}${path.sep}`);

    files(directory, pattern).forEach(file => {
        var source = fileContents(file),
            template = Handlebars.compile(source),
            name = templatePath(file, directory),
            out = path.join(outDirectory, name);

        mkdirp.sync(path.dirname(out));
        fs.writeFileSync(out, template());

        if (process.env.debug) {
            console.log("Template written to", out);
        }
    });
}

export default { registerPartials, writeTemplates };
