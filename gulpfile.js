var gulp = require('gulp');

gulp.task('test', function() {
    var mocha = require('gulp-mocha');
    return gulp.src('test/*.js', { read: false }).pipe(mocha());
});

gulp.task('integration', function(done) {
    var postcss = require('postcss');
    var less = require('./');
    var autoprefixer = require('autoprefixer');
    var fs = require('fs');
    var path = require('path');

    var testFile = fs.readFileSync(path.join(__dirname, 'test/less/tests.less'), { });

    return postcss([
		less(), autoprefixer()
	]).process(testFile.toString(), { parser: less.parser, from: 'test/less/tests.less' }).then(function (result) {
		console.log(result);
	}, function(err) {
		console.log(err.message);
	});

});