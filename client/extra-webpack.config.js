module.exports = {
	module: {
		rules: [
			{
				test: /\.css$/,
				loader: "postcss-loader",
				options: {
					postcssOptions: require("./postcss.config.js"),
				},
			},
		],
	},
};
