let path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: false,
  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('src'))
    config.resolve.alias.set('style', resolve('src/assets/style'))
  }
}
