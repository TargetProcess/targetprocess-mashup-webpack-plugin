var LibraryTemplatePlugin = function(name, options) {

    this.name = name;
    this.options = options || {};
};

LibraryTemplatePlugin.prototype.apply = function(compiler) {

    compiler.plugin('this-compilation', function(compilation) {

        var MainTemplatePlugin = require('./MainTemplatePlugin');

        compilation.apply(new MainTemplatePlugin(this.name, this.options));

    }.bind(this));
};

module.exports = LibraryTemplatePlugin;
