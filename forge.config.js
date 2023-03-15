require('dotenv').config();
module.exports = {
    packagerConfig: {
        name: 'Tactical',
        overwrite: true,
        icon: './icons/app',
        osxSign: {},
        appBundleId: 'org.tacticalapp.wallet',
        osxNotarize: {
            tool: 'notarytool',
            appleId: process.env.APPLE_ID,
            appleIdPassword: process.env.APPLE_PASSWORD,
            teamId: process.env.APPLE_TEAM_ID
        },
        ignore: [
            '^/public$',
            '^/src$',
            '^/out$',
            '^/dist$'
        ]
    },
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                authors: 'Bulka, LLC',
                description: 'Professional tools for TON',
            }
        },
        {
            name: '@electron-forge/maker-zip',
            platforms: [
                'darwin'
            ]
        },
        {
            name: '@electron-forge/maker-dmg',
            config: {
                format: 'ULFO'
            }
        },
        {
            name: '@electron-forge/maker-deb',
            config: {}
        },
        {
            name: '@electron-forge/maker-rpm',
            config: {}
        }
    ],
    plugins: [
        {
            name: 'electron-forge-plugin-vite',
            config: {
                // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
                // If you are familiar with Vite configuration, it will look really familiar.
                build: [
                    {
                        // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
                        entry: 'src/main.ts',
                        config: 'vite.main.config.ts',
                    },
                    {
                        entry: 'src/preload.ts',
                        config: 'vite.preload.config.ts',
                    },
                ],
                renderer: [
                    {
                        name: 'main_window',
                        config: 'vite.config.ts',
                    },
                ],
            },
        },
    ],
    publishers: [
        {
            name: '@electron-forge/publisher-github',
            config: {
                repository: {
                    owner: 'bulkovo',
                    name: 'tactical'
                },
                prerelease: true,
                authToken: process.env.GITHUB_TOKEN
            }
        }
    ]
};