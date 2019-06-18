import { Interact, RedBlackTreeAlgorithm, RedBlackTreeInsert, RedBlackTreeInsertFixUp, RedBlackTreeDelete, RedBlackTreeNode, RedBlackTreeADT } from '../../src/model'
import { VALUE_GENERATORS } from '../../src/algorithm/Defs'
import { TestUtil$ } from '../Util'

const GENERATOR = VALUE_GENERATORS[0]

function CheckRedBlackNodeConstraint(node: RedBlackTreeNode<number> | null, adt: RedBlackTreeADT<number>): boolean {
  if (node && node.value != null) {
    if (node.children[0] && node.children[0]!.value != null && (node.children[0]!.value! >= node.value! || node.children[0]!.parent !== node)) {
      return false
    }
    if (node.children[1] && node.children[1]!.value != null && (node.children[1]!.value! < node.value! || node.children[1]!.parent !== node)) {
      return false
    }
    if (node.red && node.children.some(c => (c as RedBlackTreeNode<number>).red)) {
      return false
    }
    return CheckRedBlackNodeConstraint(node.children[0] as RedBlackTreeNode<number> | null, adt) && CheckRedBlackNodeConstraint(node.children[1] as RedBlackTreeNode<number> | null, adt)
  }
  return true
}

function CheckRedBlackConstraint(adt: RedBlackTreeADT<number>): boolean {
  return !adt.root.red && CheckRedBlackNodeConstraint(adt.root, adt)
}

function InOrderBinaryData(node: RedBlackTreeNode<number> | null): Array<number> {
  if (node && node.value != null) {
    return [...InOrderBinaryData(node.children[0] as RedBlackTreeNode<number> | null), node.value!, ...InOrderBinaryData(node.children[1] as RedBlackTreeNode<number> | null)]
  }
  return []
}

function TestWithModify<T extends RedBlackTreeAlgorithm<number>>(Tree: new (...args: Array<any>) => T, operator?: (source: Array<number>, delta: Array<number>) => Array<number>, unchanged = true) {
  it(Tree.name, async () => {
    let tree = new Tree(GENERATOR)
    tree.Init()
    let source = InOrderBinaryData(tree.data.root)
    let output = await Interact.ImmediateExecute(() => tree.Run())

    expect(CheckRedBlackConstraint(tree.adt)).toBeTruthy()
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

describe('RedBlackTree', () => {
  TestWithModify(RedBlackTreeInsertFixUp, undefined, false)
  TestWithModify(RedBlackTreeInsert, TestUtil$.Operator.Insert)
  TestWithModify(RedBlackTreeDelete, TestUtil$.Operator.Delete)
})

