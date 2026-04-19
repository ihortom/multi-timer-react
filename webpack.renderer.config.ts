import type { Compiler, Configuration } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import type { BundleAnalyzerPlugin as BundleAnalyzerPluginType } from 'webpack-bundle-analyzer';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

const isProd = process.env.NODE_ENV === 'production';

// Instantiates a fresh BundleAnalyzerPlugin per compiler so the renderer and
// preload builds emit separate report files instead of overwriting each other.
class PerEntryBundleAnalyzer {
    private baseOpts: BundleAnalyzerPluginType.Options;
    constructor(opts: BundleAnalyzerPluginType.Options) {
        this.baseOpts = opts;
    }
    apply(compiler: Compiler) {
        const entry = JSON.stringify(compiler.options.entry ?? '');
        const label = entry.includes('preload') ? 'preload' : 'renderer';
        new BundleAnalyzerPlugin({
            ...this.baseOpts,
            reportFilename: `bundle-report-${label}.html`,
            reportTitle: `Bundle analysis — ${label}`,
        }).apply(compiler);
    }
}

const rendererPlugins: Configuration['plugins'] = [...plugins];
if (process.env.ANALYZE) {
    rendererPlugins.push(new PerEntryBundleAnalyzer({
        analyzerMode: 'static',
        openAnalyzer: true,
    }));
}

rules.push({
    test: /\.css$/,
    use: [
        { loader: 'style-loader' },
        { loader: 'css-loader', options: { sourceMap: !isProd } },
    ],
});

rules.push({
    test: /\.s[ac]ss$/i,
    use: [
        { loader: 'style-loader' },
        { loader: 'css-loader', options: { sourceMap: !isProd } },
        {
            loader: 'sass-loader',
            options: {
                sourceMap: !isProd,
                sassOptions: {
                    quietDeps: true,
                    silenceDeprecations: ['import', 'global-builtin', 'color-functions'],
                },
            },
        }
    ]
});

rules.push({
    test: /\.mp3$/,
    type: 'asset/resource'
});


export const rendererConfig: Configuration = {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? false : 'eval-source-map',
    module: {
        rules,
    },
    plugins: rendererPlugins,
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.scss', '.json'],
    }
};
