import Vue from 'vue'
import { Interact } from '../Interact'
import { PseudoCode } from '../PseudoCode'
import { AbstractData, ADT } from './ADT'
import { UniqueAction, ValueItem, UniqueState, UniqueAttribute } from './Defs'
import { TreeNodeItem } from './TreeForm'

const SENTINEL = {} as TreeNodeItem<any>

export interface BinaryTreeData<T> extends AbstractData {
  root: TreeNodeItem<T>,
  height: number
}

export class BinaryTreeADT<T> extends ADT<BinaryTreeData<T>> {
  private _compare: (val1: T, val2: T) => number

  constructor(compare?: (val1: T, val2: T) => number) {
    super({ id: -1, root: SENTINEL, height: 0 })
    this._compare = compare || ((val1: T, val2: T) => val1 > val2 ? 1 : (val1 < val2 ? -1 : 0))
  }

  get height() {
    return this._data.height
  }

  get root() {
    return this._data.root
  }

  private static BinaryTraverse<T>(array: Array<T>, start: number, end: number, action: (val: T) => void) {
    if (end > start) {
      let mid = Math.floor((start + end) / 2)
      action(array[mid])
      this.BinaryTraverse(array, start, mid, action)
      this.BinaryTraverse(array, mid + 1, end, action)
    }
  }

  private Traverse(action: (node: TreeNodeItem<T>) => void, node: TreeNodeItem<T> | null = this._data.root) {
    if (node) {
      action(node)
      node.children.forEach(child => this.Traverse(action, child))
    }
  }

  Replace(array: Array<T | null>) {
    let sorted = (array.filter(val => val != null) as Array<T>).sort()
    BinaryTreeADT.BinaryTraverse(sorted, 0, sorted.length, val => this.ImmediateInsert(val))
  }

  IsLeaf(node: TreeNodeItem<T>) {
    return node.children.every(c => !c)
  }

  Left(node: TreeNodeItem<T>) {
    return node.children[0]
  }

  Right(node: TreeNodeItem<T>) {
    return node.children[1]
  }

  private Act(action: UniqueAction, ...nodes: Array<TreeNodeItem<T>>) {
    let origins = nodes.map(node => node.action)
    nodes.forEach(node => node.action = action)
    return () => { nodes.forEach((node, i) => node.action = origins[i] ) }
  }

  Restore() {
    this.Traverse(node => {
      node.action = UniqueAction.None
      node.state = UniqueState.None
      node.attribute = UniqueAttribute.None
    })
  }

  async Set(parent: TreeNodeItem<T>, index: number, value: T) {
    let node = { value, parent: SENTINEL, children: [null, null], action: UniqueAction.None, state: UniqueState.None, attribute: UniqueAttribute.None } as TreeNodeItem<T>
    if (parent === SENTINEL) {
      this._data.root = node
    } else {
      Vue.set(parent.children, index, node)
    }
    this.Act(UniqueAction.Update, node)
    await Interact.Doze()
    return node
  }

  async Compare(value: T, node: TreeNodeItem<T>) {
    this.Act(UniqueAction.Peek, node)
    let result = this._compare(value, node.value!)
    node.state = result < 0 ? UniqueState.Less : UniqueState.GreaterOrEqual
    await Interact.Doze()
    this.Act(UniqueAction.None, node)
    return result
  }

  ImmediateInsert(value: T) {
    let node = { value, parent: SENTINEL, children: [null, null], action: UniqueAction.None, state: UniqueState.None, attribute: UniqueAttribute.None } as TreeNodeItem<T>
    if (this._data.root === SENTINEL) {
      this._data.root = node
      this._data.height = 1
    } else {
      let current = this._data.root as TreeNodeItem<T> | null
      let parent = current!.parent
      let height = 1
      while (current) {
        ++height
        parent = current
        current = this._compare(value, current.value!) < 0 ? this.Left(current) : this.Right(parent)
      }
      Vue.set(parent.children, this._compare(value, parent.value!) < 0 ? 0 : 1, node)
      node.parent = parent
      this._data.height = Math.max(this._data.height, height)
    }
  }

  static get insertPseudoCode() {
    return PseudoCode.Normalize(`
    insert(T, v):
      if T.root = nil:
        T.root ← node(v)
      else:
        n ← T.root, p ← n.parent
        while n ≠ nil:
          p ← n, n ← v ≺ n.value ? p.left : p.right
        (p.value ≺ v ? p.left : p.right) ← node(v)
    `)
  }

  async Insert(value: T) {
    await PseudoCode.RunAt(0)
    if (this._data.root === SENTINEL) {
      PseudoCode.RunAt(1)
      await this.Set(SENTINEL, 0, value)
      this._data.height = 1
    } else {
      await PseudoCode.RunAt(3)
      let current = this._data.root as TreeNodeItem<T> | null
      let parent = current!.parent
      let height = 1
      while (current) {
        await PseudoCode.RunAt(4)
        ++height
        await PseudoCode.RunAt(5)
        parent = current
        current = await this.Compare(value, current) < 0 ? this.Left(parent) : this.Right(current)
        this.Act(UniqueAction.Select, parent)
      }
      PseudoCode.RunAt(6)
      let node = await this.Set(parent, this._compare(value, parent.value!) < 0 ? 0 : 1, value)
      node.parent = parent
      this._data.height = Math.max(this._data.height, height)
    }
    this.Restore()
  }
}
