import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerDMG } from '@electron-forge/maker-dmg';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';


const appName = 'Multi-Timer';
const appVersion = '2.1.0';
const appCopyright = 'Copyright © 2024 Ihor Tomilenko';

const config: ForgeConfig = {
    packagerConfig: {
        name: `${appName}`,
        appVersion: `${appVersion}`,
        appCopyright: `${appCopyright}`,
        asar: true,
        icon: './assets/multi-timer',
    },
    rebuildConfig: {},
    makers: [ 
        new MakerDMG({
            name: `${appName}_v${appVersion}`,
            icon: './assets/multi-timer.icns',
            background: './assets/installer.png',
            overwrite: true,
        })
    ],
    plugins: [
        new AutoUnpackNativesPlugin({}),
        new WebpackPlugin({
            mainConfig,
            renderer: {
                config: rendererConfig,
                entryPoints: [
                    {
                        html: './src/index.html',
                        js: './src/renderer.tsx',
                        name: 'main_window',
                        preload: {
                            js: './src/preload.ts',
                        },
                    },
                ],
            },
        }),
        // Fuses are used to enable/disable various Electron functionality
        // at package time, before code signing the application
        new FusesPlugin({
        version: FuseVersion.V1,
        [FuseV1Options.RunAsNode]: false,
        [FuseV1Options.EnableCookieEncryption]: true,
        [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
        [FuseV1Options.EnableNodeCliInspectArguments]: false,
        [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
        [FuseV1Options.OnlyLoadAppFromAsar]: true,
        }),
    ],
};

export default config;
