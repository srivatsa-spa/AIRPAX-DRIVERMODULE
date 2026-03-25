const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const { sourceExts } = defaultConfig.resolver;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native-community/cli-types').Config}
 */
const config = {
  resolver: {
    sourceExts: [...sourceExts, 'mjs'],
    blockList: [
      /.*\/android\/\.cxx\/.*/,
      /.*\/android\/build\/.*/,
    ],
  },
};

module.exports = mergeConfig(defaultConfig, config);
