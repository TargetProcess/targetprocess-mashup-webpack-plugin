/*eslint quotes:0*/
var ExternalModule = require("webpack/lib/ExternalModule");
var OriginalSource = require("webpack-core/lib/OriginalSource");
var RawSource = require("webpack-core/lib/RawSource");
var WebpackMissingModule = require("webpack/lib/dependencies/WebpackMissingModule");

ExternalModule.prototype.source = function() {
    var str = "throw new Error('Externals not supported');";
    var request = this.request;

    if (typeof request === "object") {
        request = request[this.type];
    }

    str = "";
    if (this.optional) {
        str += "if(typeof __WEBPACK_EXTERNAL_MODULE_" + this.id + "__ === 'undefined') {"
            + WebpackMissingModule.moduleCode(request) + "}\n";
    }
    str += "module.exports = __WEBPACK_EXTERNAL_MODULE_" + this.id + "__;";

    if (this.useSourceMap) {
        return new OriginalSource(str, this.identifier());
    } else {
        return new RawSource(str);
    }
};
