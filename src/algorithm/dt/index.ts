import { Heap, HeapComponents } from './heap'
import { BinaryTree, BinaryTreeComponents } from './binary-tree'
import { AVLTree, AVLTreeComponents } from './avl-tree'
import { RedBlackTree, RedBlackTreeComponents } from './red-black-tree'

export const DataType = { Heap, BinaryTree, AVLTree, RedBlackTree } as { [index: string]: typeof Heap }
export const DataTypeComponents = { ...HeapComponents, ...BinaryTreeComponents, ...AVLTreeComponents, ...RedBlackTreeComponents }
