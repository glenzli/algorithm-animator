const LOCATOR = /[A-Z]/g

function Decompose(fullname: string) {
  let names = fullname.split(LOCATOR)
  let index = names.length - 1
  let categoryLength = names[index].length + 1
  if (!names[index]) {
    while (!names[--index]) { ++categoryLength }
  }
  return [fullname.substr(0, fullname.length - categoryLength), fullname.substr(fullname.length - categoryLength)]
}

const AlgorithmComponents = {} as any
const AlgorithmCategories = {} as any

const imports = require.context('.', false, /\.vue$/)
imports.keys().forEach(key => {
  let id = key.replace(/(\.\/|\.vue)/g, '')
  AlgorithmComponents[id] = imports(key).default
  let code = imports(key).PseudoCode || ''
  let [name, category] = Decompose(id)
  if (!AlgorithmCategories[category]) {
    AlgorithmCategories[category] = []
  }
  AlgorithmCategories[category].push({ name, id, code })
})

export { AlgorithmComponents, AlgorithmCategories }
