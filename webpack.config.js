var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var BrowserSyncPlugin = require('browser-sync-webpack-plugin')

var definePlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
    WEBGL_RENDERER: true,
    CANVAS_RENDERER: true
})

module.exports = {
    entry: {
        app: [
            path.resolve(__dirname, 'src/main.ts'),
        ],
        vendor: ['pixi', 'p2', 'phaser', 'phaserNineslice', 'phaserScrolling', 'gameAnalytics']
    },
    devtool: 'cheap-source-map',
    output: {
        pathinfo: true,
        path: path.resolve(__dirname, 'dist'),
        publicPath: './dist/',
        filename: 'bundle.js'
    },
    watch: true,
    plugins: [
        definePlugin,
        // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        // new webpack.optimize.UglifyJsPlugin({
        //     drop_console: true,
        //     minimize: true,
        //     output: {
        //         comments: false
        //     }
        // }),
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor'/* chunkName= */, filename: 'vendor.bundle.js'/* filename= */ }),
        new HtmlWebpackPlugin({
            filename: '../index.html',
            template: './src/index.html',
            chunks: ['vendor', 'app'],
            chunksSortMode: 'manual',
            minify: {
                removeAttributeQuotes: false,
                collapseWhitespace: false,
                html5: false,
                minifyCSS: false,
                minifyJS: false,
                minifyURLs: false,
                removeComments: false,
                removeEmptyAttributes: false
            },
            hash: false
        }),
        new BrowserSyncPlugin({
            host: process.env.IP || 'localhost',
            port: process.env.PORT || 3000,
            server: {
                baseDir: ['./', './build']
            },
            https:true,
            open: false,
        })
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                loaders: ['babel-loader', 'awesome-typescript-loader'],
                include: path.join(__dirname, 'src'),
            },
            {
                test: [/\.vert$/, /\.frag$/],
                use: 'raw-loader'
            }
            ,
            { test: /pixi\.js$/, loader: 'expose-loader?PIXI' },
            { test: /phaser-split\.js$/, loader: 'expose-loader?Phaser' },
            { test: /p2\.js$/, loader: 'expose-loader?p2' },
            { test: /phaser-nineslice\.js$/, loader: 'expose-loader?phaserNineslice' },
            { test: /phaser-kinetic-scrolling-plugin\.js$/, loader: 'expose-loader?phaserScrolling' },
            { test: /GameAnalytics\.node\.js$/, loader: 'expose-loader?gameAnalytics' },
        ]
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            pixi: path.join(__dirname, 'node_modules/phaser-ce/build/custom/pixi.js'),
            phaser: path.join(__dirname, 'node_modules/phaser-ce/build/custom/phaser-split.js'),
            p2: path.join(__dirname, 'node_modules/phaser-ce/build/custom/p2.js'),
            phaserNineslice: path.join(__dirname, 'node_modules/phaser-nineslice/build/phaser-nineslice.js'),
            phaserScrolling: path.join(__dirname, 'node_modules/phaser-kinetic-scrolling-plugin/dist/phaser-kinetic-scrolling-plugin.js'),
            gameAnalytics: path.join(__dirname, 'node_modules/gameanalytics/dist/GameAnalytics.node.js'),
        }
    }
}
