// Modified from postcss-parser-tests

var path = require('path');
var fs   = require('fs');
var extra = require('./extra-cases');

module.exports = function(folder) {
	function read(file) {
	    return fs.readFileSync(path.join(__dirname, folder, file));
	}
	return function (callback) {
	    fs.readdirSync(path.join(__dirname, folder)).filter(function (i) {
	        if ( path.extname(i) !== '.json' ) return;
	        var json = read(i).toString().trim();
	        var name = path.basename(i, '.json');
	        var css  = extra[name];
	        if ( !css ) css = read(name + '.css').toString();
	        callback(name + '.css', css, json);
	    });
	};
}