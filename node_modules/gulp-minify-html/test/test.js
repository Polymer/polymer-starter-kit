var gulp = require('gulp');
var expect = require('chai').expect;
var minifyHTML = require('../');
var Minimize = require('minimize');
var through = require('through2');
var fs = require('fs');

describe('gulp-minify-html', function() {
	var filename = __dirname + '/fixture/index.html';
	it('should minify my files when not given options', function(done) {
		return gulp.src(filename)
			.pipe(minifyHTML())
			.pipe(through.obj(function(file, encoding, callback){
				var source = fs.readFileSync(filename);
				var minimize = new Minimize();

				minimize.parse(source.toString(), function (err, data) {
					if (err) {
						throw err;
					}

					expect(data).to.be.equal(file.contents.toString());
					done();
				});
			}));
	});

	it('should minify my files when given options', function(done) {
		var opt = {comments:true, loose:true};
		return gulp.src(filename)
			.pipe(minifyHTML(opt))
			.pipe(through.obj(function(file, encoding, callback){
				var source = fs.readFileSync(filename);
				var minimize = new Minimize(opt);

				minimize.parse(source.toString(), function (err, data) {
					if (err) {
						throw err;
					}
					expect(data).to.be.equal(file.contents.toString());
					done();
				});
			}));
	});

	it('should return file.contents as a buffer', function(done) {
		return gulp.src(filename)
			.pipe(minifyHTML())
			.pipe(through.obj(function(file, encoding, callback) {
				expect(file.contents).to.be.an.instanceof(Buffer);
				done();
			}));
	});

	it('should do nothing when given nothing', function(done) {
		return gulp.src('')
			.pipe(minifyHTML())
			.pipe(through.obj(function(file, encoding, callback) {
				done();
			}));
	});
});
