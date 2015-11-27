var postcss = require('postcss')
	, less = require('less');

var render = require("./lib/render")(less.ParseTree, less.transformTree);

var cacheInput;

var plugin = postcss.plugin('postcss-less', function (opts) {
    opts = opts || {};
    
    // Convert PostCSS options to Less options

    return function (css, result) {

    	console.log(css);

    	function processRules(container, rulesArray) {
    		var newRule, selectors;

    		if(rulesArray && rulesArray.length > 0) {
	    		rulesArray.forEach(function(val) {
	    			selectors = [];
	    			val.selectors.forEach(function(selector) {
	    				selectors.push(selector.genCSS());
	    			})
	    			newRule = postcss.rule({ selectors: selectors });
	    			container.append(newRule);
	    			//processRules(val.rules);
	    		});
	    	}
    	}

        // Transform CSS AST here
        return new Promise(function (resolve, reject) {
            render(cacheInput, opts, function(err, lessResult) {
				if(err) {
					// Build PostCSS error
					return reject();
				}
				// Convert Less AST to PostCSS AST
				console.log(lessResult);

				processRules(css.root, lessResult.rules);
				resolve();
			});
        });
    };
});
plugin.parser = function(input) {
	cacheInput = input;
    return new postcss.root();
};

module.exports = plugin;