import "should";
import handlebarsToHtml from "../src/handlebars-to-html";

describe("Handlebars to html", () => {
    describe("Register partials", () => {
        it("Should be a function", () => {
            handlebarsToHtml.registerPartials.should.be.type("function");
        });
    });
});
