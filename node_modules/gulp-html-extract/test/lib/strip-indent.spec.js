var EOL = require("os").EOL;
var expect = require("chai").expect;
var strip = require("../../lib/strip-indent");

describe("lib/strip-indent", function () {

  it("should handle base cases", function () {
    expect(strip()).to.equal("");
    expect(strip(null)).to.equal("");
    expect(strip("")).to.equal("");
  });

  it("should strip whitespace only to empty string", function () {
    expect(strip(" ")).to.equal("");
    expect(strip(" \t")).to.equal("");
    expect(strip(" \t \t\t" + EOL)).to.equal("");
  });

  it("should strip single lines", function () {
    expect(strip("var foo;")).to.equal("var foo;" + EOL);
    expect(strip(" var foo;")).to.equal("var foo;" + EOL);
    expect(strip("\tvar foo;")).to.equal("var foo;" + EOL);
    expect(strip(" \t \t\t" + EOL + "var foo;")).to.equal("var foo;" + EOL);
  });

  it("should strip to indented multiple lines with spaces", function () {
    expect(strip([
      "var foo;",
      "var bar = 42;"
    ].join(EOL))).to.equal([
      "var foo;",
      "var bar = 42;",
      ""
    ].join(EOL));

    expect(strip([
      "  var foo;",
      "  var bar = 42;"
    ].join(EOL))).to.equal([
      "var foo;",
      "var bar = 42;",
      ""
    ].join(EOL));

    expect(strip([
      "  var foo;",
      "  if (foo) {",
      "    bar = 43;",
      "  }"
    ].join(EOL))).to.equal([
      "var foo;",
      "if (foo) {",
      "  bar = 43;",
      "}",
      ""
    ].join(EOL));

    expect(strip([
      "  var foo;",
      "  if (foo) {",
      "    bar = 43;",
      "",
      "  ",
      "  }"
    ].join(EOL))).to.equal([
      "var foo;",
      "if (foo) {",
      "  bar = 43;",
      "",
      "",
      "}",
      ""
    ].join(EOL));
  });

  it("should strip to indented multiple lines with tabs", function () {
    expect(strip([
      "\t\tvar foo;",
      "\t\tvar bar = 42;"
    ].join(EOL))).to.equal([
      "var foo;",
      "var bar = 42;",
      ""
    ].join(EOL));
  });

  it("leaves trailing spaces", function () {
    expect(strip([
      "  var foo;",
      "  if (foo) {\t",
      "    bar = 43;  ",
      "  }"
    ].join(EOL))).to.equal([
      "var foo;",
      "if (foo) {\t",
      "  bar = 43;  ",
      "}",
      ""
    ].join(EOL));
  });

  it("strips whitespace only lines at end", function () {

    expect(strip([
      "  var foo;",
      "  if (foo) {",
      "    bar = 43;",
      "  }",
      "",
      "\t\t   ",
      "\t",
      "   "
    ].join(EOL))).to.equal([
      "var foo;",
      "if (foo) {",
      "  bar = 43;",
      "}",
      ""
    ].join(EOL));
  });

  it("removes multiple whitespace-only starting lines", function () {
    expect(strip([
      "",
      "\t\t   ",
      "\t",
      "   ",
      "  var foo;",
      "  if (foo) {",
      "    bar = 43;",
      "  }"
    ].join(EOL))).to.equal([
      "var foo;",
      "if (foo) {",
      "  bar = 43;",
      "}",
      ""
    ].join(EOL));
  });

});
