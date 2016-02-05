var LibraryTemplatePlugin = require('./lib/LibraryTemplatePlugin');
var PublicPathPlugin = require('./lib/PublicPathPlugin');
var IgnoreFoldersPlugin = require('./lib/IgnoreFoldersPlugin');

var TargetprocessMashupPlugin = function(name, options) {
    this.name = name;
    this.options = options || {};
    require('./lib/ExternalModulePatch');
};

TargetprocessMashupPlugin.prototype.apply = function(compiler) {

    compiler.apply(new PublicPathPlugin());
    compiler.apply(new LibraryTemplatePlugin(this.name, {
        useConfig: this.options.useConfig
    }));
    compiler.apply(new IgnoreFoldersPlugin({
        foldersToIgnore: this.options.foldersToIgnore
    }));
};

module.exports = TargetprocessMashupPlugin;
