var gulp = require('gulp');

gulp.task('test', function() {
    return;
});

gulp.task('integration', function(done) {
    var postcss = require('postcss');
    var less = require('./');

    return postcss([
		less({})
	]).process('a { b: c; }', { parser: less.parser }).then(function (result) {
		console.log(result);
	}, function(err) {
		console.log(err);
	});

});