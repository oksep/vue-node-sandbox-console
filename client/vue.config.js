module.exports = {
    publicPath: '',
    devServer: {
      proxy: {
        '/api': {
          target: 'http://localhost:8088/api',
          changeOrigin: true, // needed for virtual hosted sites
          secure: false,
          pathRewrite: {
            '^/api': '/', // rewrite path
          },
        },
      },
      overlay: {
        warnings: false,
        errors: false,
      },
    },
    css: {
      loaderOptions: {
        less: {
          // DO NOT REMOVE THIS LINE
          javascriptEnabled: true,
        },
      },
    },
    chainWebpack: (config) => {
      const svgRule = config.module.rule('svg');
      svgRule.uses.clear();
      svgRule
        .use('babel-loader')
        .loader('babel-loader')
        .end()
        .use('vue-svg-loader')
        .loader('vue-svg-loader');
    },
  };
  