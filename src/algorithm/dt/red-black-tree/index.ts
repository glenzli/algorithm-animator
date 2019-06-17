import { PseudoCode } from '../../../model'

const RedBlackTree: Array<{ name: string, id: string, code: string }> = []
const RedBlackTreeComponents = {} as { [index: string]: any }

const imports = require.context('.', false, /\.vue$/)
imports.keys().forEach(key => {
  let name = key.replace(/(\.\/|\.vue)/g, '').replace('Renderer', '')
  let id = `RedBlackTree${name}`
  RedBlackTreeComponents[id] = imports(key).default
  RedBlackTree.push({ name, id, code: PseudoCode.GetCode(name, 'RedBlackTree')! })
})

export { RedBlackTree, RedBlackTreeComponents }
