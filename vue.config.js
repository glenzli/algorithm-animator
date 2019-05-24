module.exports = {
  publicPath: './',
  productionSourceMap: false,
  filenameHashing: false,
  configureWebpack: config => {
    config.externals = {
      paper: 'paper',
      vue: 'Vue',
      vuetify: 'Vuetify'
    }
  }
}

