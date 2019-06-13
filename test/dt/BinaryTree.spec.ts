import { Interact, BinaryTreeAlgorithm, BinaryTreeDelete, BinaryTreeInsert, BinaryTreeSearch, BinaryTreePostOrder, BinaryTreePreOrder, BinaryTreeInOrder, BinaryTreeMax, BinaryTreeMin, BinaryTreeSuccessor, BinaryTreePredecessor, TreeNode } from '../../src/model'
import { VALUE_GENERATORS } from '../../src/algorithm/Defs'
import { TestUtil$ } from '../Util'

const GENERATOR = VALUE_GENERATORS[0]

function CheckBinaryTreeConstraint(node: TreeNode<number> | null): boolean {
  if (node) {
    if (node.children[0] && node.children[0]!.value! >= node.value!) {
      return false
    }
    if (node.children[1] && node.children[1]!.value! < node.value!) {
      return false
    }
    return CheckBinaryTreeConstraint(node.children[0]) && CheckBinaryTreeConstraint(node.children[1])
  }
  return true
}

function ExtractTreeData(node: TreeNode<number> | null): Array<number> {
  if (node) {
    return [node.value!, ...ExtractTreeData(node.children[0]), ...ExtractTreeData(node.children[1])]
  }
  return []
}

function TestTree<T extends BinaryTreeAlgorithm<number>>(Tree: new (...args: Array<any>) => T, operator?: (source: Array<number>, delta: Array<number>) => Array<number>, unchanged = true) {
  it(Tree.name, async () => {
    let tree = new Tree(GENERATOR)
    tree.Init()
    let source = ExtractTreeData(tree.data.root)
    let output = await Interact.ImmediateExecute(() => tree.Run())

    expect(CheckBinaryTreeConstraint(tree.data.root)).toBeTruthy()
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

function TestTreeResult<T extends BinaryTreeAlgorithm<number>>(Tree: new (...args: Array<any>) => T, validate?: (output: any, data: Array<number>) => any) {
  it(Tree.name, async () => {
    let tree = new Tree(GENERATOR)
    tree.Init()
    let source = ExtractTreeData(tree.data.root)
    let output = await Interact.ImmediateExecute(() => tree.Run())

    expect(source).toEqual(ExtractTreeData(tree.data.root))
    if (validate) {
      expect(validate(output, source)).toBeTruthy()
    }
  })
}

describe('Tree', () => {
  TestTreeResult(BinaryTreeSearch)
  TestTree(BinaryTreePreOrder)
  TestTree(BinaryTreeInOrder)
  TestTree(BinaryTreePostOrder)
  TestTreeResult(BinaryTreeMax, (max, values) => max === Math.max(...values))
  TestTreeResult(BinaryTreeMin, (min, values) => min === Math.min(...values))
  TestTreeResult(BinaryTreePredecessor, (pairs: Array<Array<number>>, values) => {
    values = values.sort((m, n) => m - n)
    return pairs.every(pair => {
      if (pair.length > 1) {
        return values[values.indexOf(pair[0]) - 1] = pair[1]
      } else {
        return pair[0] === Math.min(...values)
      }
    })
  })
  TestTreeResult(BinaryTreeSuccessor, (pairs: Array<Array<number>>, values) => {
    values = values.sort((m, n) => m - n)
    return pairs.every(pair => {
      if (pair.length > 1) {
        return values[values.indexOf(pair[0]) + 1] = pair[1]
      } else {
        return pair[0] === Math.max(...values)
      }
    })
  })
  TestTree(BinaryTreeInsert, TestUtil$.Operator.Insert)
  TestTree(BinaryTreeDelete, TestUtil$.Operator.Delete)
})
