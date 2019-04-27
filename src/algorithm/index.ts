const AlgorithmComponents = {} as any

const imports = require.context('.', false, /\.vue$/)
imports.keys().forEach(key => {
  let id = key.replace(/(\.\/|\.vue)/g, '')
  AlgorithmComponents[id] = imports(key).default
})


export { AlgorithmComponents }
