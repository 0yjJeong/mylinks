module.exports = {
  rollup(config) {
    config.plugins.push(
      require('rollup-plugin-styles')({
        mode: 'extract',
      })
    );
    return config;
  },
};
