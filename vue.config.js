module.exports = {
  publicPath: './',
  productionSourceMap: false,
  configureWebpack: config => {
    config.externals = {
      paper: 'paper',
      vue: 'Vue',
      vuetify: 'Vuetify'
    }
  }
}

