import { PseudoCode } from '../../../model'

const Heap: Array<{ name: string, id: string, code: string }> = []
const HeapComponents = {} as { [index: string]: any }

const imports = require.context('.', false, /\.vue$/)
imports.keys().forEach(key => {
  let name = key.replace(/(\.\/|\.vue)/g, '').replace('Renderer', '')
  let id = `Heap${name}`
  HeapComponents[id] = imports(key).default
  Heap.push({ name, id, code: PseudoCode.GetCode(name, 'Heap')! })
})

export { Heap, HeapComponents }
