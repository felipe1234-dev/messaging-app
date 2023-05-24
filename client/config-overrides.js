const path = require("path");
const { addWebpackAlias } = require("customize-cra");

module.exports = function override(config, env) {
    // Adiciona o path alias
    config = addWebpackAlias({
        "@components": path.resolve(__dirname, "src/components"),
        "@providers": path.resolve(__dirname, "src/providers"),
        "@functions": path.resolve(__dirname, "src/functions"),
        "@services": path.resolve(__dirname, "src/services"),
        "@pages": path.resolve(__dirname, "src/pages"),
        "@styles": path.resolve(__dirname, "src/styles"),
        "@constants": path.resolve(__dirname, "src/constants"),
        "@hooks": path.resolve(__dirname, "src/hooks"),
        "@layout": path.resolve(__dirname, "src/layout"),
        "@types": path.resolve(__dirname, "src/types"),
        "@images": path.resolve(__dirname, "src/images"),
    })(config);

    config.module.rules.push({
        test: /\.svg$/,
        exclude: /node_modules/,
        use: {
            loader: "svg-react-loader",
            options: {
                tag: "symbol",
                attrs: {
                    title: "example",
                },
                name: "MyIcon",
            },
        },
    });

    return config;
};
