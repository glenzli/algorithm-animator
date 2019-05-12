module.exports = {
  publicPath: './',
  productionSourceMap: false,
  filenameHashing: false,
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.externals = {
        paper: 'paper',
        vue: 'Vue'
      }
    }
  }
}

