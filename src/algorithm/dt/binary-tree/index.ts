import { PseudoCode } from '../../../model'

const BinaryTree: Array<{ name: string, id: string, code: string }> = []
const BinaryTreeComponents = {} as { [index: string]: any }

const imports = require.context('.', false, /\.vue$/)
imports.keys().forEach(key => {
  let name = key.replace(/(\.\/|\.vue)/g, '').replace('Renderer', '')
  let id = `BinaryTree${name}`
  BinaryTreeComponents[id] = imports(key).default
  BinaryTree.push({ name, id, code: PseudoCode.GetCode(name, 'BinaryTree')! })
})

export { BinaryTree, BinaryTreeComponents }
