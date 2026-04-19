import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

const isProd = process.env.NODE_ENV === 'production';

const mainRules: Required<Configuration>['module']['rules'] = [
    ...rules,
    {
        test: /native_modules[/\\].+\.node$/,
        use: 'node-loader',
    },
    {
        test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
        parser: { amd: false },
        use: {
            loader: '@vercel/webpack-asset-relocator-loader',
            options: {
                outputAssetBase: 'native_modules',
            },
        },
    },
];

export const mainConfig: Configuration = {
    /**
     * This is the main entry point for the application,
     * it's the first file that runs in the main process.
     */
    entry: './src/index.ts',
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? false : 'eval-source-map',
    module: {
        rules: mainRules,
    },
    plugins,
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.scss', '.json'],
    },
};
