/*globals tau, mashup*/
/*eslint quotes: 0*/
var ConcatSource = require("webpack-core/lib/ConcatSource");

var createDefineToMashups = function(useConfig) {

    var defineToMashups = function() {

        var args = Array.prototype.slice.call(arguments, 0);
        var deps;
        var func;
        var name;

        if (typeof args[0] === 'string') {
            name = args[0];
            deps = args[1];
            func = args[2];
        } else if (Array.isArray(args[0])) {
            deps = args[0];
            func = args[1];
        }

        var header = deps.reduce(function(res, v) {
            return res.addDependency(v);
        }, tau.mashups);

        header = header.addDependency(name + '/config');

        header = header.addMashup(function() {

            var modules = Array.prototype.slice.call(arguments, 0);

            if (deps.length > 0 && modules.length === 1) {
                throw new Error('Can\'t properly load dependencies for mashup "' + name
                    + '", mashup is stopped.');
            }

            mashup.variables = modules[modules.length - 1];

            if (modules.length - deps.length === 2) {
                mashup.config = modules[modules.length - 2];
            } else {
                mashup.config = {};
            }

            if (Object.freeze) {
                Object.freeze(mashup.variables);
                Object.freeze(mashup.config);
                Object.freeze(mashup);
            }

            return func.apply(null, modules);
        });

        return header;
    };

    var defineToMashupsStr = defineToMashups.toString().split('\n').map(function(v) {
        return v.trim();
    }).join('');

    if (!useConfig) {
        defineToMashupsStr = defineToMashupsStr.replace('header = header.addDependency(name + \'/config\');', '');
    }

    return defineToMashupsStr;
};

var MainTemplatePlugin = function(name, options) {

    this.name = name;
    this.options = options;
};

MainTemplatePlugin.prototype.apply = function(compilation) {

    var mainTemplate = compilation.mainTemplate;
    var moduleName = this.name;
    var useConfig = 'useConfig' in this.options ? this.options.useConfig : true;

    compilation.templatesPlugin("render-with-entry", function(source, chunk, hash) {

        var externals = chunk.modules.filter(function(m) {
            return m.external;
        });
        var externalsDepsArray = JSON.stringify(externals.map(function(m) {
            return typeof m.request === "object" ? m.request.amd : m.request;
        }));
        var externalsArguments = externals.map(function(m) {
            return "__WEBPACK_EXTERNAL_MODULE_" + m.id + "__";
        }).join(", ");

        var str;
        var defineToMashups = createDefineToMashups(useConfig);

        if (moduleName) {
            var name = mainTemplate.applyPluginsWaterfall("asset-path", moduleName, {
                hash: hash,
                chunk: chunk
            });

            str = new ConcatSource("define(" + JSON.stringify(name) + ", " + externalsDepsArray
                + ", function(" + externalsArguments + ") { return ", source, "});");
        } else if (externalsArguments) {
            str = new ConcatSource("define(" + externalsDepsArray + ", function(" + externalsArguments
                + ") { return ", source, "});");
        } else {
            str = new ConcatSource("define(function() { return ", source, "});");
        }

        return new ConcatSource(
            '(function() {',
            'var mashup = {}; ',
            'var define = ' + defineToMashups.toString() + ';\n',
            str,
            '})();');
    });

    mainTemplate.plugin("global-hash-paths", function(paths) {
        if (this.name) {
            paths.push(this.name);
        }
        return paths;
    }.bind(this));

    mainTemplate.plugin("hash", function(hash) {
        hash.update(this.name + "");
    }.bind(this));
};

module.exports = MainTemplatePlugin;
