var loaderUtils = require("loader-utils");

module.exports = function(content) {

    if (this.cacheable) {
        this.cacheable();
    }

    var query = loaderUtils.parseQuery(this.query);

    var json = JSON.parse(content);
    var output = JSON.stringify(json, null, '    ');

    var outputFile = query.outputFile || './mashup.config.js';

    this.emitFile(outputFile, 'tau.mashups.addModule("' + (query.libraryTarget || '.') + '/config", '
        + output + ');');

    return '// config';
};
