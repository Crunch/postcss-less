var chai = require('chai');
var cases = require('postcss-parser-tests');
var postcss = require('postcss');
var less = require('../.');
var promise = require('bluebird');

var promises = [];


cases.each( function(name, css, json) {
	promises.push(new promise(function(finish) {
		it('parses ' + name, function(done) {
        	postcss([
				less({ hello: true})
			]).process(css, { parser: less.parser, from: name }).then(function (result) {
				try {
					var parsed = cases.jsonify(result.root);
					chai.expect(parsed).to.eql(json);
					done();
				}
				catch(err) {
					done(err);
				}
			}, done);
        });
        finish();
	}));
});


describe('LESS Parser', function() {

	promise.all(promises);

});
