# Finally, Less comes to PostCSS

[![Build Status][ci-img]][ci]

**The PostCSS plugin you've been waiting for**: a [PostCSS] custom parser plugin for integrating the popular [Less.js] CSS pre-processor into your PostCSS workflow! It integrates the entire Less engine, evaluates your `.less`, and exports a PostCSS AST that you can use to attach multiple subsequent PostCSS plugins.

Instead of trying to assemble a hodge-podge collection of PostCSS plugins that "emulate" a pre-processor, use a pre-processor!

**THAT'S RIGHT.** This plugin doesn't give you "Less-like" functionality, or "Less-like" parsing. It gives you the full awesomeness of Less, with the flexibility of PostCSS. Basically, you can throw your "pre-processor-y" and "Sass-ish" plugins away now.

## Having said that...

* Because this uses the [Less.js] parser and not the default PostCSS processor, some parsing will be different. PostCSS accepts "broken" CSS, whereas Less doubles as a de facto CSS linter, and will return errors if your Less / CSS is poorly structured.
* PostCSS will also sometimes "fix" CSS that uses property hacks, which Less preserves as the property name, or will remove comments from within values, which are also kept in the value by Less.
* The `less()` plugin needs to be the first plugin called.
* Less.js does not save "raws" when parsing. It also only preserves the start line / column of your source, which is still fine for Source Maps.

## How is this different from a Less plugin?
A plugin like [less-plugin-autoprefix] parses your CSS twice. First, [Less.js] parses your `.less`, evaluates it, and outputs CSS as a string. Then, the [less-plugin-autoprefix] plugin calls PostCSS to parse that CSS output to make an AST.

Instead of parsing twice, the [postcss-less-parser] plugin directly converts the evaluated Less AST to a PostCSS AST without re-parsing. WHICH WAS REALLY HARD. But I did it for you. Because I love you.

I'm not sure if that would have a major performance difference or not. Someone else can do the benchmarks, my brain is full.

[less-plugin-autoprefix]: https://github.com/less/less-plugin-autoprefix
[PostCSS]: https://github.com/postcss/postcss
[Less.js]: https://github.com/less/less.js
[ci-img]:  https://travis-ci.org/Crunch/postcss-less.svg
[ci]:      https://travis-ci.org/Crunch/postcss-less
[postcss-less-parser]: https://github.com/Crunch/postcss-less-parser

## Example

### Input `example.less` file

```less
.add-bg-size(@size) {
	-webkit-background-size+: @size;
	background-size+: @size;
}

@default-size: 20px;

.box {
	.add-bg-size(@default-size (@default-size / 2));
	.add-bg-size(cover);
	width: calc(100% - 50px);
}
```

### JavaScript
```js
var less = require('postcss-less-parser');
var autoprefixer = require('autoprefixer');
var clean = require('postcss-clean');

var exampleLess = fs.readFileSync(path.join(__dirname, 'example.less'), 'utf8');

postcss([
    less({ strictMath: true }), 
    autoprefixer(), 
    clean()
  ])
  .process(exampleLess, { parser: less.parser, from: 'example.less' })
  .then(function (result) {
    console.log(result.css);
  }, function(err) {});
```

### Output

```css
.box{background-size:20px 10px,cover;width:calc(100% - 50px)}
```

## Usage

Follow these simple steps to use [postcss-less-parser].

Add [postcss-less-parser] to your build tool. (You must have Less.js and PostCSS installed as prerequisites.)

```bash
npm install postcss-less-parser --save-dev
```

#### Node

```js
var less = require('postcss-less-parser');
less({ /* Less.js options */ }).process(YOUR_CSS, { parser: less.parser });
```

Load [postcss-less-parser] as a PostCSS plugin:

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
