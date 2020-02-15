const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const TSLintPlugin = require('tslint-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: './src/app.ts',
	output: {
		path: __dirname,
		filename: './www/assets/app.js'
	},
	plugins: [
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
				test: /\.less$/,
				use: ['style-loader', 'css-loader', 'less-loader'],
			},
		],
	},
	performance: {
		hints: false,
	},
};
