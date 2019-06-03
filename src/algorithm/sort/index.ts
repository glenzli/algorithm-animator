import { PseudoCode } from '../../model'

const Sort: Array<{ name: string, id: string, code: string }> = []
const SortComponents = {} as { [index: string]: any }

const imports = require.context('.', false, /\.vue$/)
imports.keys().forEach(key => {
  let name = key.replace(/(\.\/|\.vue)/g, '').replace('Renderer', '')
  let id = `Sort${name}`
  SortComponents[id] = imports(key).default
  Sort.push({ name, id, code: PseudoCode.GetCode(name)! })
})

export { Sort, SortComponents }
