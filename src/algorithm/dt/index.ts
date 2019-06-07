import { Heap, HeapComponents } from './heap'
import { BinaryTree, BinaryTreeComponents } from './binary-tree'

export const DataStructure = { Heap, BinaryTree } as { [index: string]: typeof Heap }
export const DataStructureComponents = { ...HeapComponents, ...BinaryTreeComponents }
