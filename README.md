
# targetprocess-mashup-webpack-plugin

Webpack plugin to help writing Targetprocess mashups. 

Provides support for mashup system loader and wraps config data.

## Using

*Do not* set any values to `output.library` amd `output.libraryTarget` in webpack config.

```js
// webpack.config.js
{
    plugins: [
        new TargetprocessMashupPlugin(mashupName, {
            useConfig: false
        }),
    }
}
```

```js
// src/index.js

var dep = require('dependnency');
console.log('my pretty mashup');
```

`webpack` command will produce single file, which content can be inserted inside Mashup Manager textarea. You can use all [webpack](http://webpack.github.io) features: require NPM modules, async load of chunks, import text files, etc.

Also, it adds is a global variable `mashup`. It contains properties: 
    - `config`: data from module `<mashupName>/config` (see below)
    - `variables`: mashup system data

```js
// src/index.js
console.log(mashup.variables.placeholderId); // footerPlaceholder
```

## Options

### useConfig (boolean)

Will automatically load module `<mashupName>/config` and use its data in `mashup.config`. You should create this module separately.

## License

MIT (http://www.opensource.org/licenses/mit-license.php)


