import fs from "fs";
import glob from "glob";
import Handlebars from "handlebars";
import mkdirp from "mkdirp";
import path from "path";

function registerPartials (pattern) {
    var files = glob.sync(pattern);

    if (!files.length) {
        throw new Error(`No partial files found for pattern ${pattern}`);
    }

    if (process.env.debug) {
        console.log("Partials", files);
    }

    files.forEach(file => {
        // TODO: Does readFileSync exist in node 0.10/0.12?
        var source = fs.readFileSync(file).toString(),
            partialName = file.replace(path.extname(file), "");

        Handlebars.registerPartial(partialName, source);

        if (process.env.debug) {
            console.log("Partial registered with name", partialName);
        }
    });
}

function writeFiles (pattern) {
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
            distDirectory = path.dirname(file).replace("source" + path.sep + "pages", "dist"),
            distPath = distDirectory + path.sep + path.basename(file, ".hbs") + ".html";

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

export default api;
