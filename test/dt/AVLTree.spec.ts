import { Interact, AVLTreeAlgorithm, AVLTreeRotateLeft, AVLTreeRotateLeftRight, AVLTreeRotateRight, AVLTreeRotateRightLeft, AVLTreeBalance, AVLTreeInsert, AVLTreeDelete, AVLTreeNode } from '../../src/model'
import { VALUE_GENERATORS } from '../../src/algorithm/Defs'
import { TestUtil$ } from '../Util'

const GENERATOR = VALUE_GENERATORS[0]

function CheckAVLTreeConstraint(node: AVLTreeNode<number> | null): boolean {
  if (node) {
    if (node.children[0] && node.children[0]!.value! >= node.value!) {
      return false
    }
    if (node.children[1] && node.children[1]!.value! < node.value!) {
      return false
    }
    return CheckAVLTreeConstraint(node.children[0] as AVLTreeNode<number>) && CheckAVLTreeConstraint(node.children[1] as AVLTreeNode<number>)
  }
  return true
}

function ExtractTreeData(node: AVLTreeNode<number> | null): Array<number> {
  if (node) {
    return [node.value!, ...ExtractTreeData(node.children[0] as AVLTreeNode<number>), ...ExtractTreeData(node.children[1] as AVLTreeNode<number>)]
  }
  return []
}

function TestTree<T extends AVLTreeAlgorithm<number>>(Tree: new (...args: Array<any>) => T, operator?: (source: Array<number>, delta: Array<number>) => Array<number>, unchanged = true) {
  it(Tree.name, async () => {
    let tree = new Tree(GENERATOR)
    tree.Init()
    let source = ExtractTreeData(tree.data.root)
    let output = await Interact.ImmediateExecute(() => tree.Run())

    expect(CheckAVLTreeConstraint(tree.data.root)).toBeTruthy()
    if (operator && output) {
      let expected = operator(source, output as Array<number>).sort((m, n) => m - n)
      expect(expected).toEqual(ExtractTreeData(tree.data.root).sort((m, n) => m - n))
    } else {
      if (unchanged) {
        expect(source).toEqual(ExtractTreeData(tree.data.root))
      } else {
        expect(source.sort((m, n) => m - n)).toEqual(ExtractTreeData(tree.data.root).sort((m, n) => m - n))
      }
    }
  })
}

describe('AVLTree', () => {
  TestTree(AVLTreeRotateLeft, undefined, false)
  TestTree(AVLTreeRotateLeftRight, undefined, false)
  TestTree(AVLTreeRotateRight, undefined, false)
  TestTree(AVLTreeRotateRightLeft, undefined, false)
  TestTree(AVLTreeBalance, undefined, false)
  TestTree(AVLTreeInsert, TestUtil$.Operator.Insert)
  TestTree(AVLTreeDelete, TestUtil$.Operator.Delete)
})
