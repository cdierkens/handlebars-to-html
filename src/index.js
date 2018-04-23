#!/usr/bin/env node

let commander = require("commander");
let handlebarsToHtml = require("../build/handlebars-to-html");
let packageJson = require("../package.json");

let config = {
    partialsFolder: "src/views/partials/",
    layoutsFolder: "src/views/layouts/",
    templatesFolder: "src/views/templates/"
};

commander
  .version(packageJson.version)
  .usage("-templates <pattern> -d <path>")
  .description("Write handlebars templates to a directory as static html.")
  .option("-d, --directory", "output directory")
  .option("-H, --helpers", "path to JavaScript file containing helpers")
  .option("-p, --partials [pattern]", "glob pattern to match partial files")
  .option("-l, --layouts [pattern]", "glob pattern to match layout files")
  .option("-t, --templates <pattern>", "glob pattern to match template files")
  .option("-v, --verbose", "output more information to console")
  .parse(process.argv);

if (commander.verbose) {
    process.env.debug = true;
}

if (commander.partials) {
    handlebarsToHtml.registerPartials(commander.partials, config.partialsFolder);
}

if (commander.layouts) {
    handlebarsToHtml.registerPartials(commander.layouts, config.layoutsFolder);
}

handlebarsToHtml.writeFiles(commander.templates, config.templatesFolder);
