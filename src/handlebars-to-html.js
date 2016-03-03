import fs from "fs";
import glob from "glob";
import Handlebars from "handlebars";
import mkdirp from "mkdirp";
import path from "path";

function files (directory = process.cwd(), pattern = '**/*.hbs') {
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

function registerPartials (directory, pattern) {
    if (!isDirectory(directory)) {
        throw Error(`${directory} is not a directory`);
    }

    directory = path.normalize(`${directory}${path.sep}`);

    files(directory, pattern).forEach(file => {
        var source = fs.readFileSync(file).toString(),
            name = file.replace(directory, "").replace(path.extname(file), "");

        Handlebars.registerPartial(name, source);

        if (process.env.debug) {
            console.log("Partial registered with name", name);
        }
    });
}

function writeTemplates (directory, pattern, outDirectory) {
    if (!isDirectory(directory)) {
        throw Error(`${directory} is not a directory`);
    }

    directory = path.normalize(`${directory}${path.sep}`);
    outDirectory = path.normalize(`${outDirectory}${path.sep}`);

    files(directory, pattern).forEach(file => {
        var source = fs.readFileSync(file).toString(),
            template = Handlebars.compile(source),
            name = file.replace(directory, "").replace(path.extname(file), ".html"),
            out = path.join(outDirectory, name);

        mkdirp.sync(path.dirname(out));
        fs.writeFileSync(out, template());

        if (process.env.debug) {
            console.log("Template written to", out);
        }
    });
}

export default { registerPartials, writeTemplates };
