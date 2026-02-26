const path = require('path');

/** @type {import('next').NextConfig} */
module.exports = {
  output: 'export',
  webpack(config, options) {
    // Allow Next.js/SWC to transpile files from main/common (symlinked as renderer/common)
    // and main/remote-states/use-remote-state.ts which are outside the renderer directory
    const includes = [
      path.join(__dirname, '..', 'main', 'common'),
      path.join(__dirname, '..', 'main', 'remote-states', 'use-remote-state.ts'),
    ];

    // Find the existing Next.js SWC rule and extend its include
    for (const rule of config.module.rules) {
      if (rule && rule.oneOf) {
        for (const oneOfRule of rule.oneOf) {
          if (
            oneOfRule
            && oneOfRule.use
            && oneOfRule.use.loader === 'next-swc-loader'
            && oneOfRule.include
          ) {
            if (Array.isArray(oneOfRule.include)) {
              oneOfRule.include.push(...includes);
            } else {
              oneOfRule.include = [oneOfRule.include, ...includes];
            }
          }
        }
      }
    }

    // Resolve symlinks so webpack follows renderer/common → main/common
    config.resolve.symlinks = true;

    if (options.isServer) {
      // Server-side (page data collection): mock electron and Node-only modules
      // so pages can be imported without crashing
      config.resolve.alias = {
        ...config.resolve.alias,
        electron: path.join(__dirname, 'utils', 'electron-server-mock.js'),
        '@electron/remote': path.join(__dirname, 'utils', 'remote-server-mock.js'),
      };
    } else {
      // Client-side: electron-renderer target makes Node.js builtins and
      // electron available at runtime
      config.target = 'electron-renderer';
    }

    config.devtool = 'cheap-module-source-map';

    return config;
  },
};
