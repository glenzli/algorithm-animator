import { Heap, HeapComponents } from './heap'
import { BinaryTree, BinaryTreeComponents } from './binary-tree'
import { AVLTree, AVLTreeComponents } from './avl-tree'

export const DataStructure = { Heap, BinaryTree, AVLTree } as { [index: string]: typeof Heap }
export const DataStructureComponents = { ...HeapComponents, ...BinaryTreeComponents, ...AVLTreeComponents }
