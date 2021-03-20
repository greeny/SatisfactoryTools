const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const TSLintPlugin = require('tslint-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	mode: 'development',
	entry: './src/app.ts',
	output: {
		path: __dirname,
		filename: './www/assets/app.js'
	},
	plugins: [
		new webpack.IgnorePlugin(/(fs|child_process)/),
		new TSLintPlugin({
			files: ['./src/**/*.ts'],
		}),
	],
	resolve: {
		plugins: [
			new TsconfigPathsPlugin,
		],
		extensions: ['.ts', '.tsx', '.js'],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: '/node_modules/',
			},
			{
				test: /\.html$/,
				loader: "angular-templatecache-loader?module=app",
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.scss$/,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
		],
	},
	performance: {
		hints: false,
	},
};
