module.exports = function(content) {

    if (this.cacheable) {
        this.cacheable();
    }

    var json = JSON.parse(content);

    this.emitFile('./manifest.cfg', 'Placeholders:' + json.Placeholders);
    delete json.Placeholders;

    this.emitFile('./manifest.baseinfo.json', JSON.stringify(json, null, '    '));

    return '// manifest';
};
