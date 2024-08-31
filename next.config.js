// next.config.js

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });
  
  module.exports = withBundleAnalyzer({
    webpack: (config, { isServer }) => {
      // Ignore .map files in chrome-aws-lambda
      config.module.rules.push({
        test: /\.map$/,
        loader: 'ignore-loader',
      });
  
      // Exclude chrome-aws-lambda from being processed by Webpack
      config.externals = config.externals || [];
      if (!isServer) {
        config.externals.push({
          'chrome-aws-lambda': 'chrome-aws-lambda',
        });
      }
  
      return config;
    },
  });
  