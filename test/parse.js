var chai = require('chai');
var cases = require('postcss-parser-tests');
var postcss = require('postcss');
var less = require('../.');

describe('LESS Parser', function() {

    cases.each( function(name, css, json) {
        it('parses ' + name, function(done) {

        	postcss([
				less({})
			]).process(css, { parser: less.parser, from: name }).then(function (result) {
				try {
					var parsed = cases.jsonify(result);
					chai.expect(parsed).to.eql(json);
					done();
				}
				catch(err) {
					done(err);
				}
			}, done);

        });
    });

});
