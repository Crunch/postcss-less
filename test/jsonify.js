var path = require('path');

function clean(node) {
    if (node.source) {
        delete node.source.input.css;
        node.source.input.file = path.basename(node.source.input.file);
    }
    if (node.lastEach)
    	delete node.lastEach;
    if (node.indexes)
    	delete node.indexes;
    if (node.rawCache)
    	delete node.rawCache;
    if (node.nodes) node.nodes = node.nodes.map(clean);
    return node;
}

module.exports = function jsonify(node) {
    var cleaned = clean(node.toJSON());
    return JSON.stringify(cleaned, null, 2);
};
