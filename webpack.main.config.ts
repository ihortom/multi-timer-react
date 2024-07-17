import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

export const mainConfig: Configuration = {
    /**
     * This is the main entry point for the application,
     * it's the first file that runs in the main process.
     */
    entry: './src/index.ts',
    module: {
        rules,
    },
    plugins,
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.scss', '.json'],
    },
};
