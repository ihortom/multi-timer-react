import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerDMG } from '@electron-forge/maker-dmg';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';
import appPackage from './package.json';


const appName = appPackage.productName;
const appVersion = appPackage.version;
const appArch = process.arch;
const appCopyright = `Copyright © ${new Date().getFullYear()} ${appPackage.author}`;

const config: ForgeConfig = {
    packagerConfig: {
        name: `${appName}`,
        appVersion: `${appVersion}`,
        appCopyright: `${appCopyright}`,
        asar: true,
        icon: './assets/multi-timer',
        appBundleId: 'com.electron.multi-timer',
    },
    rebuildConfig: {},
    hooks: {
        postPackage: async (_forgeConfig, packageResult) => {
            if (process.platform !== 'darwin') return;
            const { execSync } = await import('child_process');
            for (const outputPath of packageResult.outputPaths) {
                const appPath = `${outputPath}/Multi-Timer.app`;
                const frameworkPath = `${appPath}/Contents/Frameworks/Electron Framework.framework`;

                // Apple Silicon ships every nested binary ad-hoc signed; Intel ships them
                // unsigned. Outer-bundle signing without --deep requires nested frameworks
                // and helpers to already have a signature, so on x64 we ad-hoc deep-sign
                // first. On arm64 we must NOT deep-sign — Fuse bytes (e.g. the embedded
                // ASAR integrity hash) live in regions excluded from the existing Framework
                // signature, and re-signing causes a Code Signature Invalid crash at startup.
                let needsDeepSign = false;
                try {
                    execSync(`codesign --verify "${frameworkPath}"`, { stdio: 'ignore' });
                } catch {
                    needsDeepSign = true;
                }
                if (needsDeepSign) {
                    execSync(
                        `codesign --force --sign - --deep "${appPath}"`,
                        { stdio: 'inherit' }
                    );
                }

                // Re-sign the outer bundle (no --deep) so the bundle identity becomes
                // com.electron.multi-timer without disturbing nested signatures.
                execSync(
                    `codesign --force --sign - --identifier "com.electron.multi-timer" "${appPath}"`,
                    { stdio: 'inherit' }
                );
            }
        },
    },
    makers: [
        new MakerDMG({
            name: `${appName}_v${appVersion}_${appArch}`,
            icon: './assets/multi-timer.icns',
            background: './assets/installer.png',
            overwrite: true,
            format: 'ULFO',
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
        [FuseV1Options.EnableCookieEncryption]: false,
        [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
        [FuseV1Options.EnableNodeCliInspectArguments]: false,
        [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
        [FuseV1Options.OnlyLoadAppFromAsar]: true,
        }),
    ],
};

export default config;
