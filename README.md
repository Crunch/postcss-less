# Less for PostCSS [![Build Status][ci-img]][ci]

[PostCSS] plugin for integrating the popular Less CSS pre-processor into your PostCSS workflow.

WIP - DO NOT USE

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/matthew-dean/postcss-less.svg
[ci]:      https://travis-ci.org/matthew-dean/postcss-less


## Usage

Follow these simple steps to use [postcss-less].

Add [postcss-less] to your build tool:

```bash
npm install postcss-less --save-dev
```

#### Node

```js
var less = require('postcss-less');
less({ /* options */ }).process(YOUR_CSS, { parser: less });
```

Load [postcss-less] as a PostCSS plugin:

```js
var less = require('postcss-less');
postcss([
    less({ /* options */ })
]).process(YOUR_CSS, { parser: less }).then(function (result) {
	// do something with result.css
});
```

#### Gulp

Add [Gulp PostCSS] to your build tool:

```bash
npm install gulp-postcss --save-dev
```

Enable [postcss-less] within your Gulpfile:

```js
var postcss = require('gulp-postcss');

gulp.task('less', function () {
    return gulp.src('./css/src/style.less').pipe(
        postcss([
            require('postcss-less')({ /* options */ })
        ])
    ).pipe(
        gulp.dest('./css')
    );
});
```

#### Grunt

Add [Grunt PostCSS] to your build tool:

```sh
npm install postcss-less --save-dev
```

Enable [postcss-less] within your Gruntfile:

```js
grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			parser: require('postcss-less'),
			processors: [
				require('postcss-less')({ /* options */ })
			]
		},
		dist: {
			src: 'css/*.css'
		}
	}
});
```
