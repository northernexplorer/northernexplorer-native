const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Force Metro to resolve Node's 'punycode' module to the npm package
config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    punycode: require.resolve('punycode/'),
};

module.exports = config;