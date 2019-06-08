import { Interact, BinaryTreeAlgorithm, BinaryTreeDelete, BinaryTreeInsert, BinaryTreeSearch, TreeData, TreeNodeItem } from '../../model'
import { VALUE_GENERATORS } from '../../algorithm/Defs'
import { TestUtil$ } from '../Util'

const GENERATOR = VALUE_GENERATORS[0]

function CheckBinaryTreeConstraint(node: TreeNodeItem<number> | null): boolean {
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

function ExtractTreeData(node: TreeNodeItem<number> | null): Array<number> {
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
      let expected = operator(source, output as Array<number>).sort()
      expect(expected).toEqual(ExtractTreeData(tree.data.root).sort())
    } else {
      if (unchanged) {
        expect(source).toEqual(ExtractTreeData(tree.data.root))
      } else {
        expect(source.sort()).toEqual(ExtractTreeData(tree.data.root).sort())
      }
    }
  })
}

describe('Tree', () => {
  TestTree(BinaryTreeSearch)
  TestTree(BinaryTreeInsert, TestUtil$.Operator.Insert)
  TestTree(BinaryTreeDelete, TestUtil$.Operator.Delete)
})
