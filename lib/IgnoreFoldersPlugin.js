var ConcatSource = require('webpack-core/lib/ConcatSource');

var IgnoreFoldersPlugin = function(config) {

    config = config || {};

    this.foldersToIgnore = config.foldersToIgnore || [];
};

IgnoreFoldersPlugin.prototype.apply = function(compiler) {

    compiler.plugin('emit', function(compilation, next) {

        this.foldersToIgnore.forEach(function(folderName) {
            compilation.assets[folderName + '/mashup.ignore'] = new ConcatSource();
        });

        next();
    }.bind(this));
};

module.exports = IgnoreFoldersPlugin;
