var EOL = require("os").EOL;
var fs = require("fs");
var path = require("path");
var expect = require("chai").expect;
var gutil = require("gulp-util");

var extract = require("../html-extract");
var html = fs.readFileSync(path.join(__dirname, "test.html"), "utf8");

var file;
var count;
var err;

// Helpers
var expectEmpty = function (opts, target, done) {
  extract(opts || {})
    .on("data", function () {
      count++;
    })
    .on("error", function (error) {
      err = error;
    })
    .on("end", function () {
      expect(err).to.not.be.ok;
      expect(count).to.equal(0);
      done(err);
    })
    .end(target);
};

describe("html-extract", function () {

  beforeEach(function () {
    // Fake file.
    file = new gutil.File({
      path: "test/test.html",
      contents: new Buffer(html)
    });

    count = 0;
    err = null;
  });

  describe("base cases", function () {

    it("handles an empty string", function (done) {
      file = new gutil.File({
        path: "test/test.html",
        contents: new Buffer("")
      });

      expectEmpty({}, file, done);
    });

    it("handles bad HTML", function (done) {
      file = new gutil.File({
        path: "test/test.html",
        contents: new Buffer("<html_OMG_THIS_ISBAD</BAD>")
      });

      expectEmpty({}, file, done);
    });

    it("handles no body", function (done) {
      file = new gutil.File({
        path: "test/test.html",
        contents: new Buffer("<html></html>")
      });

      expectEmpty({}, file, done);
    });

    it("extracts scripts by default", function (done) {
      extract()
        .on("data", function (target) {
          count++;
          expect(target.path).to.contain("-script");
          expect(target.contents.toString()).to.contain("var ");
        })
        .on("error", function (error) {
          err = error;
        })
        .on("end", function () {
          expect(err).to.not.be.ok;
          expect(count).to.equal(4);
          done(err);
        })
        .end(file);
    });

  });

  describe("selector option", function () {

    it("handles no matches with custom selectors", function (done) {
      extract({ sel: ".NO_MATCH" })
        .on("data", function () {
          count++;
        })
        .on("error", function (error) {
          err = error;
        })
        .on("end", function () {
          expect(err).to.not.be.ok;
          expect(count).to.equal(0);
          done(err);
        })
        .end(file);
    });


    it("extracts custom selectors", function (done) {
      extract({ sel: "textarea" })
        .on("data", function (target) {
          count++;
          expect(target.path).to.contain("-textarea");
          expect(target.contents.toString()).to.contain("_TEXT");
        })
        .on("error", function (error) {
          err = error;
        })
        .on("end", function () {
          expect(err).to.not.be.ok;
          expect(count).to.equal(2);
          done(err);
        })
        .end(file);
    });

    it("matches id", function (done) {
      extract({ sel: "#first-textarea" })
        .on("data", function (target) {
          var text = target.contents.toString().replace(/^\s*|\s*$/g, "");

          count++;
          expect(target.path).to.contain("first-textarea");
          expect(text).to.equal("FIRST_TEXT");
        })
        .on("error", function (error) {
          err = error;
        })
        .on("end", function () {
          expect(err).to.not.be.ok;
          expect(count).to.equal(1);
          done(err);
        })
        .end(file);
    });
  });

  describe("strip option", function () {

    it("handles an empty string", function (done) {
      file = new gutil.File({
        path: "test/test.html",
        contents: new Buffer("")
      });

      expectEmpty({ strip: true }, file, done);
    });

    it("handles bad HTML", function (done) {
      file = new gutil.File({
        path: "test/test.html",
        contents: new Buffer("<html_OMG_THIS_ISBAD</BAD>")
      });

      expectEmpty({ strip: true }, file, done);
    });

    it("handles no body", function (done) {
      file = new gutil.File({
        path: "test/test.html",
        contents: new Buffer("<html></html>")
      });

      expectEmpty({ strip: true }, file, done);
    });

    it("strips single line snippets", function (done) {
      extract({ sel: "#first-script", strip: true })
        .on("data", function (target) {
          var text = target.contents.toString();

          count++;
          expect(target.path).to.contain("first-script");
          expect(text).to.equal("var first = \"first\";" + EOL);
        })
        .on("error", function (error) {
          err = error;
        })
        .on("end", function () {
          expect(err).to.not.be.ok;
          expect(count).to.equal(1);
          done(err);
        })
        .end(file);
    });

    it("strips multiple line snippets", function (done) {
      extract({ sel: "#indented-script", strip: true })
        .on("data", function (target) {
          var text = target.contents.toString();

          count++;
          expect(target.path).to.contain("indented-script");
          expect(text).to.equal([
            "var second = \"second\";",
            "if (first && second) {",
            "  var third = \"third\";",
            "  // Completely empty line next",
            "",
            "}",
            ""
          ].join(EOL));
        })
        .on("error", function (error) {
          err = error;
        })
        .on("end", function () {
          expect(err).to.not.be.ok;
          expect(count).to.equal(1);
          done(err);
        })
        .end(file);
    });

  });
});
