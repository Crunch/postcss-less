var chai = require('chai');
var each = require('./each');
var jsonify = require('./jsonify');
var postcss = require('postcss');
var less = require('../.');
var fs = require('fs');
var path = require('path');

var promises = [];
var i=0;

each('css')( function(name, css, json) {
	promises.push(new Promise(function(finish) {
		it('parses ' + name, function(done) {
        	postcss([
				less({ strictMath: true })
			]).process(css, {
					parser: less.parser
					, from: name
					, map: { inline: false } })
				.then(function (result) {
					try {
						var parsed = jsonify(result.root);
						chai.expect(parsed).to.eql(json);
						done();
					}
					catch(err) {
						done(err);
					}
				}, function(err) {
					done(new Error(err.message, err.file, err.line));
				});
        });
        finish();
	}));
	i++;
});


describe('LESS Parser', function() {
	describe('Process CSS', function() {
		Promise.all(promises);
	});
	describe('Process LESS', function() {
		//Promise.all(promises);
	});
});

// Through testing, I discovered that Source Maps won't be equal
// because Less doesn't save "raws". PostCSS exports that to final CSS

// describe('Less and PostCSS', function() {
// 	var lessMaps, postCSSmaps;

// 	var css = fs.readFileSync(path.join(__dirname, 'cases/atrule-decls.css'), { encoding: 'utf8'});

// 	var p1 = new Promise(function(resolve, reject) {
//     	postcss([
//     		less()
// 		]).process(css, {
// 				parser: less.parser
// 				, from: 'atrule-decls.css'
// 				, map: { inline: false } })
// 			.then(function (result) {
// 				try {
// 					lessMaps = JSON.stringify(JSON.parse(result.map.toString()), null, 2);
// 					resolve();
// 				}
// 				catch(err) {
// 					reject(err);
// 				}
// 			}, reject);
// 	});

// 	var p2 = new Promise(function(resolve, reject) {
//     	postcss([
// 		]).process(css, {
// 				from: 'atrule-decls.css'
// 				, map: { inline: false } })
// 			.then(function (result) {
// 				try {
// 					postCSSmaps = JSON.stringify(JSON.parse(result.map.toString()), null, 2);
// 					resolve();
// 				}
// 				catch(err) {
// 					reject(err);
// 				}
// 			}, reject);
// 	});

// 	it('source maps should be equal', function(done) {
// 		Promise.all([p1, p2]).then(function() {
// 			try {
// 				chai.expect(lessMaps).to.eql(postCSSmaps);
// 				done();
// 			}
// 			catch(err) {
// 				done(err);
// 			}
// 		}, function(err) {
// 			console.log(err);
// 			done();
// 		});
// 	});

// });
