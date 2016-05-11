# Finally, Less comes to PostCSS

[![Build Status][ci-img]][ci]

**What you've been waiting for**: a [PostCSS] custom parser plugin for integrating the popular [Less.js] CSS pre-processor into your PostCSS workflow! It integrates the entire Less engine, evaluates your `.less`, and exports a PostCSS AST that you can use to attach multiple subsequent PostCSS plugins.

Instead of trying to assemble a hodge-podge collection of PostCSS plugins that "emulate" a pre-processor, use a pre-processor!

## Some caveats

Because this uses the [Less.js] parser and not the default PostCSS processor, some parsing will be different. PostCSS accepts "broken" CSS, whereas Less doubles as a de facto CSS linter, and will return errors if your Less / CSS is poorly structured.

PostCSS will also sometimes "fix" CSS that uses property hacks, which Less preserves as the property name, or will remove comments from within values, which are also kept in the value by Less.

The `less()` plugin needs to be the first plugin called.

[PostCSS]: https://github.com/postcss/postcss
[Less.js]: https://github.com/less/less.js
[ci-img]:  https://travis-ci.org/Crunch/postcss-less.svg
[ci]:      https://travis-ci.org/Crunch/postcss-less
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
var less = require('postcss-less-parser');
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
