const modulesFiles = require.context('./', true, /\index.js$/)

const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  if (modulePath === './index.js') {
    return modules
  }
  const moduleName = modulePath.replace(/^\.\/(.*)\/index\.\w+$/, '$1')

  const value = modulesFiles(modulePath)
  modules['Air' + moduleName.charAt(0).toUpperCase() + moduleName.slice(1)] = value.default
  return modules
}, {})

export default modules
