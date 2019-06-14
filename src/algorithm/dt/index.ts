import { Heap, HeapComponents } from './heap'
import { BinaryTree, BinaryTreeComponents } from './binary-tree'
import { AVLTree, AVLTreeComponents } from './avl-tree'

export const DataType = { Heap, BinaryTree, AVLTree } as { [index: string]: typeof Heap }
export const DataTypeComponents = { ...HeapComponents, ...BinaryTreeComponents, ...AVLTreeComponents }
