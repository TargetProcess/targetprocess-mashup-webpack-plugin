var TargetprocessMashupPublicPathPlugin = function(name) {
    this.name = name;
};

TargetprocessMashupPublicPathPlugin.prototype.apply = function(compiler) {

    compiler.plugin('compilation', function(compilation) {

        compilation.templatesPlugin('require-extensions', function(source) {

            return source
                + '\n__webpack_require__.p = mashup.variables ? mashup.variables.mashupPath : __webpack_require__.p;';

        });

    });
};

module.exports = TargetprocessMashupPublicPathPlugin;
