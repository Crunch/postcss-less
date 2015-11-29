var postcss = require('postcss')
	, Input = require('postcss/lib/input')
	, less = require('less');


var render = require("./lib/render")(less.ParseTree, less.transformTree);

var cacheInput;

var plugin = postcss.plugin('postcss-less', function (opts) {
    opts = opts || {};
    
    // Convert PostCSS options to Less options

    return function (css, result) {

    	//console.log(css);

    	var postCssInputs = {};

    	// Less's importManager is like PostCSS's Input class.
    	// We need to convert our inputs to reference them later.
    	function convertImports(imports) {
	    	for (var file in imports) {
			    if (imports.hasOwnProperty(file)) {
			        postCssInputs[file] = new Input(imports[file], file !== "input" ? { from: file } : undefined);
			    }
			}
		}

     	// Most of Less's nodes require an object to be passed with this structure.
     	// It makes it hard to just stringify anything, because of Less's "context" and "output" paramaters that
     	// are required for many class functions.
     	var returnObj;

     	function buildNodeObject(filename, index, chunk) {
     		var input = postCssInputs[filename],
	            loc = less.utils.getLocation(index, input.css);
	        
	        return {
	        	stringValue: chunk
	        	, input: input
	        	, start: { 
		        	line: loc.line
		        	, column: loc.column
		        }
	        };
     	}
     	
     	var output = { 
     		add: function(chunk, fileInfo, index) {
     			if(chunk === "" || chunk === " ") return;

     			if(returnObj === "" && fileInfo) {
     				return returnObj = buildNodeObject(fileInfo.filename, index, chunk);
		        }
	        	returnObj.stringValue += chunk;
	        }
	    };
	    function getObject(lessNode, justString) {
	    	// Initialize the string
	    	returnObj = justString ? { stringValue: "" } : "";
	    	lessNode.genCSS(null, output);
	    	return returnObj;
	    }
	    var process = {
	    	ruleset: function(ruleset) {
	    		var i = 0, selectors = [];
	    		var tmpObj, node;

	    		ruleset.selectors.forEach(function(selector) {
    				tmpObj = getObject(selector);
    				if(i === 0) {
    					node = tmpObj;
    				}
    				selectors.push(tmpObj.stringValue);
    				i++;
    			});
    			node.selectors = selectors;

    			var rule = postcss.rule(node);
    			processRules(rule, ruleset.rules);
    			return rule;
	    	}
	    	, rule: function(rule) {
	    		var node = buildNodeObject(rule.currentFileInfo.filename, rule.index);
	    		var evalValue = getObject(rule.value, true);
	    		node.prop = rule.name;
	    		node.value = evalValue.stringValue;
	    		if(rule.important.indexOf("!i") > -1) {
	    			node.important = true;
	    		}

	    		return postcss.decl(node);
	    	}
	    	, comment: function(comment) {
	    		// PostCSS requires comments to come without comment marks
	    		return postcss.comment({ text: comment.value.replace(/^\/\*\s*/, '').replace(/\s*\*\/$/, '') });
	    	}
	    };
    	function processRules(container, rulesArray) {

    		if(rulesArray && rulesArray.length > 0) {
	    		rulesArray.forEach(function(val) {
	    			switch(val.type) {
	    				// a.k.a. PostCSS "rule"
	    				case "Ruleset":
	    					container.append(process.ruleset(val));
	    					break;
	    				// a.k.a. PostCSS "decl"
	    				case "Rule":
	    					container.append(process.rule(val));
	    					break;
	    				case "Comment":
	    					container.append(process.comment(val));
	    					break;
	    			}
	    		});
	    	}
    	}

        return new Promise(function (resolve, reject) {


            render(cacheInput, opts, function(err, evaldRoot, imports) {
				if(err) {
					// Build PostCSS error
					reject();
				}
				// Convert Less AST to PostCSS AST
				//console.log(evaldRoot, imports);

				convertImports(imports.contents);
				processRules(css, evaldRoot.rules);
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