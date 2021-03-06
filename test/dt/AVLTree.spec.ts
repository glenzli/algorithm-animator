import { Interact, AVLTreeAlgorithm, AVLTreeRotateLeft, AVLTreeRotateLeftRight, AVLTreeRotateRight, AVLTreeRotateRightLeft, AVLTreeBalanceUp, AVLTreeInsert, AVLTreeDelete, AVLTreeNode, AVLTreeADT } from '../../src/model'
import { VALUE_GENERATORS } from '../../src/algorithm/Defs'
import { TestUtil$ } from '../Util'
import { CheckBinaryConstraint, InOrderBinaryData } from './BinaryTree.spec'

const GENERATOR = VALUE_GENERATORS[0]

function CheckAVLConstraint(node: AVLTreeNode<number> | null, adt: AVLTreeADT<number>): boolean {
  if (CheckBinaryConstraint(node)) {
    if (node && Math.abs(adt.BalanceOf(node)) >= 2) {
      return false
    }
    return true
  }
  return false
}

function TestWithModify<T extends AVLTreeAlgorithm<number>>(Tree: new (...args: Array<any>) => T, operator?: (source: Array<number>, delta: Array<number>) => Array<number>, unchanged = true) {
  it(Tree.name, async () => {
    let tree = new Tree(GENERATOR)
    tree.Init()
    let source = InOrderBinaryData(tree.data.root)
    let output = await Interact.ImmediateExecute(() => tree.Run())

    expect(CheckAVLConstraint(tree.data.root, tree.adt)).toBeTruthy()
    if (operator && output) {
      let expected = operator(source, output as Array<number>).sort((m, n) => m - n)
      expect(expected).toEqual(InOrderBinaryData(tree.data.root).sort((m, n) => m - n))
    } else {
      if (unchanged) {
        expect(InOrderBinaryData(tree.data.root)).toEqual(source)
      } else {
        expect(InOrderBinaryData(tree.data.root).sort((m, n) => m - n)).toEqual(source.sort((m, n) => m - n))
      }
    }
  })
}

describe('AVLTree', () => {
  TestWithModify(AVLTreeRotateLeft, undefined, false)
  TestWithModify(AVLTreeRotateLeftRight, undefined, false)
  TestWithModify(AVLTreeRotateRight, undefined, false)
  TestWithModify(AVLTreeRotateRightLeft, undefined, false)
  TestWithModify(AVLTreeBalanceUp, undefined, false)
  TestWithModify(AVLTreeInsert, TestUtil$.Operator.Insert)
  TestWithModify(AVLTreeDelete, TestUtil$.Operator.Delete)
})
