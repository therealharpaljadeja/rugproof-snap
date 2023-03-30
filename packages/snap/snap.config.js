const envify = require('envify/custom');
require('dotenv').config();

module.exports = {
  cliOptions: {
    src: './src/index.ts',
    port: 8080,
  },
  bundlerCustomizer: (bundler) => {
    bundler.transform(
      envify({
        ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
        ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
        MORALIS_API_KEY: process.env.MORALIS_API_KEY,
      }),
    );
  },
};
