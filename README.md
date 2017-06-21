# A Complete Compile-LESS-to-CSS PostCSS plugin

_Note: this plugin was mostly a proof-of-concept of converting ASTs and not something I'm actively maintaining. The best way to do this is probably just to use a tool like Gulp and pipe through [gulp-less] and then [gulp-postcss]._

This is a [PostCSS] custom parser plugin for integrating the popular [Less.js] CSS pre-processor into your PostCSS workflow! It integrates the entire Less engine, evaluates your `.less`, and exports a PostCSS AST that you can use to attach multiple subsequent PostCSS plugins.


## Note

* Because this uses the [Less.js] parser and not the default PostCSS processor, some parsing will be different. PostCSS accepts "broken" CSS, whereas Less doubles as a de facto CSS linter, and will return errors if your Less / CSS is poorly structured.
* PostCSS will also sometimes "fix" CSS that uses property hacks, which Less preserves as the property name. As well, PostCSS will remove comments from within values, which are also kept in the value by Less (in most cases).
* Less.js does not save "raws" when parsing. It also only preserves the start line / column of your source, which is still fine for Source Maps.
* **Important:** The `less()` plugin **needs to be the first PostCSS plugin called**.

[less-plugin-autoprefix]: https://github.com/less/less-plugin-autoprefix
[PostCSS]: https://github.com/postcss/postcss
[Less.js]: https://github.com/less/less.js
[gulp-less]: https://github.com/plus3network/gulp-less
[gulp-postcss]: https://github.com/postcss/gulp-postcss
[ci-img]:  https://travis-ci.org/Crunch/postcss-less.svg
[ci]:      https://travis-ci.org/Crunch/postcss-less
[postcss-less-engine]: https://github.com/Crunch/postcss-less
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss

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
var less = require('postcss-less-engine');
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

Follow these simple steps to use [postcss-less-engine].

Add [postcss-less-engine] to your build tool. (You must have Less.js and PostCSS installed as prerequisites.)

```bash
npm install postcss-less-engine --save-dev
```

#### Node

```js
var less = require('postcss-less-engine');
less({ /* Less.js options */ }).process(YOUR_CSS, { parser: less.parser });
```

Load [postcss-less-engine] as a PostCSS plugin:

```js
var less = require('postcss-less-engine');
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

Enable [postcss-less-engine] within your Gulpfile:

```js
var postcss = require('gulp-postcss');
var less = require('postcss-less-engine');

gulp.task('less', function () {
    return gulp.src('./css/src/style.less').pipe(
        postcss([
            less({ /* Less.js options */ })
        ], { parser: less.parser })
    ).pipe(
        gulp.dest('./css')
    );
});
```

#### Grunt

Add [Grunt PostCSS] to your build tool:

```sh
npm install postcss-less-engine --save-dev
```

Enable [postcss-less-engine] within your Gruntfile:

```js
grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			parser: require('postcss-less-engine').parser,
			processors: [
				require('postcss-less-engine')({ /* Less.js options */ })
			]
		},
		dist: {
			src: 'css/*.css'
		}
	}
});
```

#### Misc

Similarly to `postcss-import`, the list of imported files can be viewed by
assigning a function to the `onImport` key among the options:

```javascript
less({
	/* other Less.js options */
	onImport: function(sources){
		console.log(sources)
	}
})
```

The received sources will be an array of strings, containing the absolute path
to the files, which were imported, including the source file.
