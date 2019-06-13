import { PseudoCode } from '../../../model'

const AVLTree: Array<{ name: string, id: string, code: string }> = []
const AVLTreeComponents = {} as { [index: string]: any }

const imports = require.context('.', false, /\.vue$/)
imports.keys().forEach(key => {
  let name = key.replace(/(\.\/|\.vue)/g, '').replace('Renderer', '')
  let id = `AVLTree${name}`
  AVLTreeComponents[id] = imports(key).default
  AVLTree.push({ name, id, code: PseudoCode.GetCode(name, 'AVLTree')! })
})

export { AVLTree, AVLTreeComponents }
