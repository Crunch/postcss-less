# Less for PostCSS [![Build Status][ci-img]][ci]

[PostCSS] plugin for integrating the popular Less CSS pre-processor into your PostCSS workflow.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/matthew-dean/postcss-less.svg
[ci]:      https://travis-ci.org/matthew-dean/postcss-less
[postcss-less-parser]: https://github.com/Crunch/postcss-less-parser


## Usage

Follow these simple steps to use [postcss-less-parser].

Add [postcss-less-parser] to your build tool:

```bash
npm install postcss-less-parser --save-dev
```

#### Node

```js
var less = require('postcss-less-parser');
less({ /* Less.js options */ }).process(YOUR_CSS, { parser: less.parser });
```

Load [postcss-less] as a PostCSS plugin:

```js
var less = require('postcss-less');
postcss([
    less({ /* Less.js options */ })
]).process(YOUR_CSS, { parser: less.parser }).then(function (result) {
	// do something with result.css
});
```

#### Gulp

Add [Gulp PostCSS] to your build tool:

```bash
npm install gulp-postcss --save-dev
```

Enable [postcss-less-parser] within your Gulpfile:

```js
var postcss = require('gulp-postcss');

gulp.task('less', function () {
    return gulp.src('./css/src/style.less').pipe(
        postcss([
            require('postcss-less-parser')({ /* Less.js options */ })
        ])
    ).pipe(
        gulp.dest('./css')
    );
});
```

#### Grunt

Add [Grunt PostCSS] to your build tool:

```sh
npm install postcss-less-parser --save-dev
```

Enable [postcss-less-parser] within your Gruntfile:

```js
grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			parser: require('postcss-less-parser'),
			processors: [
				require('postcss-less-parser')({ /* Less.js options */ })
			]
		},
		dist: {
			src: 'css/*.css'
		}
	}
});
```
