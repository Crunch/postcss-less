var gulp = require('gulp');
var postcss = require('postcss');
var less = require('./');
var autoprefixer = require('autoprefixer');
var fs = require('fs');
var path = require('path');

gulp.task('test', function() {
    var mocha = require('gulp-mocha');
    return gulp.src('test/*.js', { read: false }).pipe(mocha());
});

function testLess(filename, plugins) {
    var testFile = fs.readFileSync(path.join(__dirname, 'test/less/' + filename + '.less'), { });

    return postcss(plugins).process(testFile.toString(), { parser: less.parser, from: 'test/less/' + filename + '.less' }).then(function (result) {
		console.log(result.css);
	}, function(err) {
		console.log(err.message);
	});
}

gulp.task('integration', function(done) {
	testLess('tests', [less(), autoprefixer()]);
});


gulp.task('benchmark', function(done) {
    testLess('benchmark', [less()]);
});