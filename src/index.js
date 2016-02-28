#!/usr/bin/env node

import commander from "commander";
import handlebarsToHtml from "./handlebars-to-html";
import packageJson from "../package.json";

commander
  .version(packageJson.version)
  .usage("-templates <pattern> -d <path>")
  .description("Write handlebars templates to a directory as static html.")
  .option("-d, --directory", "output directory")
  .option("-H, --helpers", "path to JavaScript file containing helpers")
  .option("-p, --partials [pattern]", "glob pattern to match partial files")
  .option("-t, --templates <pattern>", "glob pattern to match template files")
  .option("-v, --verbose", "output more information to console")
  .parse(process.argv);

if (commander.verbose) {
    process.env.debug = true;
}

if (commander.partials) {
    handlebarsToHtml.registerPartials(commander.partials);
}

handlebarsToHtml.writeFiles(commander.templates);
