#!/usr/bin/env node

import commander from "commander";
import handlebarsToHtml from "./handlebars-to-html";
import packageJson from "../package.json";

var program = commander.command("handlebars-to-html");

program.version(packageJson.version)
    .usage("-t <path> -T <pattern> -p [path] -P [pattern] -d <directory>")
    .description("Write handlebars templates to a directory as static html.")
    .option("-d, --directory <path>", "output directory")
    .option("-P, --partial-directory [path]", "directory to prepend to pattern")
    .option("-p, --partial-pattern [pattern]", "glob pattern to match partial files")
    .option("-T, --template-directory <path>", "directory to prepend to pattern")
    .option("-t, --template-pattern <path>", "glob pattern to match template files in template path")
    .option("-v, --verbose", "output more information to console")
    .parse(process.argv);

if (program.verbose) {
    process.env.debug = true;
}

if (program.partialDirectory && program.partialPattern) {
    handlebarsToHtml.registerPartials(program.partialDirectory, program.partialPattern)
} else if (program.partialDirectory && !program.partialPattern) {
    console.error('  Supplied partial directory with no pattern');
} else if (!program.partialDirectory && program.partialPattern) {
    console.error('  Supplied partial patern with no directory');
}

if (program.templateDirectory && program.templatePattern && program.directory) {
    handlebarsToHtml.writeTemplates(program.templateDirectory, program.templatePattern, program.directory);
} else {
    console.error('  Missing required argument');
    program.help();
}
