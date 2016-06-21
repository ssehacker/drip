'use strict';

var webpack = require("webpack");
var fs = require("fs");
var path = require("path");
let BannerPlugin = webpack.BannerPlugin;

//过滤node_modules中所有的模块
var nodeModules = {};
fs.readdirSync("node_modules")
    .filter(function(x) {
        return [".bin"].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = "commonjs " + mod;
    });

    
nodeModules["transform-runtime"] ="commonjs transform-runtime";
nodeModules["stream"] ="commonjs stream";

// var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        index: "./bin/server.js"
    },
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "[name].js"
    },
    target: "node",
    externals: nodeModules,
    context: __dirname,
    node: {
        __filename: false,
        __dirname: false
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: "babel-loader",
            query: {
                plugins: ["transform-runtime"],
                presets: ["es2015", "stage-0"]
            },
            // exclude: [
            //     path.resolve(__dirname, "node_modules"),
            // ]
            include: [
                path.resolve(__dirname, "app"),
                path.resolve(__dirname, "bin")
            ]
        }, 
        {
            test: /\.json$/,
            loader: "json-loader"
        }]
    },
    resolve: {
        extensions: ["", ".js", ".json"]
    },
    plugins: [
        new BannerPlugin('require("source-map-support").install();',{ raw: true, entryOnly: false })
    ]
};