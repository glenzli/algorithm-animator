import { Interact, BinaryTreeAlgorithm, BinaryTreeDelete, BinaryTreeInsert, BinaryTreeSearch, BinaryTreePostOrder, BinaryTreePreOrder, BinaryTreeInOrder, BinaryTreeMax, BinaryTreeMin, BinaryTreeSuccessor, BinaryTreePredecessor, TreeNode } from '../../src/model'
import { VALUE_GENERATORS } from '../../src/algorithm/Defs'
import { TestUtil$ } from '../Util'

const GENERATOR = VALUE_GENERATORS[0]

export function CheckBinaryConstraint(node: TreeNode<number> | null): boolean {
  if (node) {
    if (node.children[0] && (node.children[0]!.value! >= node.value! || node.children[0]!.parent !== node)) {
      return false
    }
    if (node.children[1] && (node.children[1]!.value! < node.value! || node.children[1]!.parent !== node)) {
      return false
    }
    return CheckBinaryConstraint(node.children[0]) && CheckBinaryConstraint(node.children[1])
  }
  return true
}

export function InOrderBinaryData(node: TreeNode<number> | null): Array<number> {
  if (node) {
    return [...InOrderBinaryData(node.children[0]), node.value!, ...InOrderBinaryData(node.children[1])]
  }
  return []
}

function TestWithModify<T extends BinaryTreeAlgorithm<number>>(Tree: new (...args: Array<any>) => T, operator?: (source: Array<number>, delta: Array<number>) => Array<number>, unchanged = true) {
  it(Tree.name, async () => {
    let tree = new Tree(GENERATOR)
    tree.Init()
    let source = InOrderBinaryData(tree.data.root)
    let output = await Interact.ImmediateExecute(() => tree.Run())

    expect(CheckBinaryConstraint(tree.data.root)).toBeTruthy()
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

function TestWithReturn<T extends BinaryTreeAlgorithm<number>>(Tree: new (...args: Array<any>) => T, validate?: (output: any, data: Array<number>) => any) {
  it(Tree.name, async () => {
    let tree = new Tree(GENERATOR)
    tree.Init()
    let source = InOrderBinaryData(tree.data.root)
    let output = await Interact.ImmediateExecute(() => tree.Run())

    expect(CheckBinaryConstraint(tree.data.root)).toBeTruthy()
    expect(source).toEqual(InOrderBinaryData(tree.data.root))
    if (validate) {
      expect(validate(output, source)).toBeTruthy()
    }
  })
}

describe('BinaryTree', () => {
  TestWithReturn(BinaryTreeSearch)
  TestWithModify(BinaryTreePreOrder)
  TestWithModify(BinaryTreeInOrder)
  TestWithModify(BinaryTreePostOrder)
  TestWithReturn(BinaryTreeMax, (max, values) => max === Math.max(...values))
  TestWithReturn(BinaryTreeMin, (min, values) => min === Math.min(...values))
  TestWithReturn(BinaryTreePredecessor, (pairs: Array<Array<number>>, values) => {
    values = values.sort((m, n) => m - n)
    return pairs.every(pair => {
      if (pair.length > 1) {
        return values[values.indexOf(pair[0]) - 1] === pair[1]
      } else {
        return pair[0] === Math.min(...values)
      }
    })
  })
  TestWithReturn(BinaryTreeSuccessor, (pairs: Array<Array<number>>, values) => {
    values = values.sort((m, n) => m - n)
    return pairs.every(pair => {
      if (pair.length > 1) {
        return values[values.indexOf(pair[0]) + 1] === pair[1]
      } else {
        return pair[0] === Math.max(...values)
      }
    })
  })
  TestWithModify(BinaryTreeInsert, TestUtil$.Operator.Insert)
  TestWithModify(BinaryTreeDelete, TestUtil$.Operator.Delete)
})
