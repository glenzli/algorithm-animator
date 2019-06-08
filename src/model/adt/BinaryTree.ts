import Vue from 'vue'
import { Interact } from '../Interact'
import { PseudoCode } from '../PseudoCode'
import { ADT } from './ADT'
import { UniqueAction, UniqueState, UniqueAttribute, ValueItem } from './Defs'
import { TreeNodeItem, TreeData } from './TreeDefs'

const SENTINEL = {} as TreeNodeItem<any>

const LEFT = 0
const RIGHT = 1

export class BinaryTreeADT<T> extends ADT<TreeData<T>> {
  private _compare: (val1: T, val2: T) => number

  constructor(compare?: (val1: T, val2: T) => number) {
    super({ id: -1, root: SENTINEL, height: 0, actives: [] })
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
    return node.children[LEFT]
  }

  Right(node: TreeNodeItem<T>) {
    return node.children[RIGHT]
  }

  private Act(action: UniqueAction, ...nodes: Array<TreeNodeItem<T>>) {
    let origins = nodes.map(node => node.action)
    nodes.forEach(node => node.action = action)
    return () => { nodes.forEach((node, i) => node.action = origins[i] ) }
  }

  private Attribute(attribute: UniqueAttribute, ...nodes: Array<TreeNodeItem<T>>) {
    nodes.forEach(node => node.attribute = attribute)
  }

  private Active(value: T) {
    this._data.actives.push({ value, action: UniqueAction.None, state: UniqueState.None, attribute: UniqueAttribute.None } as ValueItem<T>)
  }

  private ActActive(action: UniqueAction, ...indexes: Array<number>) {
    if (indexes.length === 0) {
      indexes = [this._data.actives.length - 1]
    }
    indexes.map(index => this._data.actives[index].action = action)
  }

  Restore() {
    this.Traverse(node => {
      node.action = UniqueAction.None
      node.state = UniqueState.None
      node.attribute = UniqueAttribute.None
    })
    this._data.actives.splice(0)
  }

  async Get(parent: TreeNodeItem<T>, index: number) {
    let child = parent.children[index]
    if (child) {
      this.Act(UniqueAction.Peek, child)
    }
    await Interact.Doze()
    return child
  }

  async ReplaceUp(parent: TreeNodeItem<T>, bridge: TreeNodeItem<T>, descendant: TreeNodeItem<T> | null, reserve = false) {
    this.Act(UniqueAction.Target, bridge)
    this.Attribute(UniqueAttribute.Ignore, bridge)
    if (descendant) {
      this.Act(UniqueAction.Move, descendant)
    }
    await Interact.Doze()
    if (descendant) {
      this.Act(UniqueAction.None, descendant)
    }
    if (parent === SENTINEL) {
      this._data.root = descendant || SENTINEL
    } else {
      Vue.set(parent.children, this.Left(parent) === bridge ? LEFT : RIGHT, descendant)
    }
    if (reserve) {
      this.Active(bridge.value!)
    }
    await Interact.Doze()
    this.Act(UniqueAction.None, bridge)
    this.Attribute(UniqueAttribute.None, bridge)
  }

  async Set(parent: TreeNodeItem<T>, index: number, value: T) {
    this.Act(UniqueAction.Select, parent)
    let node = { value, parent: SENTINEL, children: [null, null], action: UniqueAction.None, state: UniqueState.None, attribute: UniqueAttribute.None } as TreeNodeItem<T>
    if (parent === SENTINEL) {
      this._data.root = node
    } else {
      Vue.set(parent.children, index, node)
    }
    this.Act(UniqueAction.Update, node)
    await Interact.Doze()
    this.Act(UniqueAction.None, parent, node)
    return node
  }

  async Update(node: TreeNodeItem<T>, value: T) {
    this.Act(UniqueAction.Update, node)
    node.value = value
    await Interact.Doze()
  }

  async Compare(value: T, node: TreeNodeItem<T>, markEqual = false) {
    this.Act(UniqueAction.Peek, node)
    let result = this._compare(value, node.value!)
    if (result < 0) {
      node.state = UniqueState.Less
    } else if (result > 0) {
      node.state = UniqueState.Greater
    } else {
      node.state = markEqual ? UniqueState.Equal : UniqueState.GreaterOrEqual
    }
    await Interact.Doze()
    return result
  }

  ImmediateInsert(value: T) {
    let node = { value, parent: SENTINEL, children: [null, null], action: UniqueAction.None, state: UniqueState.None, attribute: UniqueAttribute.None } as TreeNodeItem<T>
    if (this._data.root === SENTINEL) {
      this._data.root = node
      this._data.height = 1
    } else {
      let current = this._data.root as TreeNodeItem<T> | null
      let parent = SENTINEL
      let height = 1
      while (current) {
        ++height
        parent = current
        current = this._compare(value, current.value!) < 0 ? this.Left(current) : this.Right(parent)
      }
      Vue.set(parent.children, this._compare(value, parent.value!) < 0 ? LEFT : RIGHT, node)
      this._data.height = Math.max(this._data.height, height)
    }
  }

  static get insertPseudoCode() {
    return PseudoCode.Normalize(`
    insert(T, v):
      if T.root = nil:
        T.root ← node(v)
      else:
        p ← nil, n ← T.root
        while n ≠ nil:
          p ← n, n ← v ≺ n.value ? p.left : p.right
        (v ≺ p.value ? p.left : p.right) ← node(v)
    `)
  }

  async Insert(value: T) {
    this.Active(value)
    await PseudoCode.RunAt(0)
    if (this._data.root === SENTINEL) {
      PseudoCode.RunAt(1)
      await this.Set(SENTINEL, 0, value)
      this._data.height = 1
    } else {
      await PseudoCode.RunAt(3)
      let current = this._data.root as TreeNodeItem<T> | null
      let parent = SENTINEL
      let height = 1
      while (current) {
        await PseudoCode.RunAt(4)
        ++height
        await PseudoCode.RunAt(5)
        parent = current
        current = await this.Compare(value, current) < 0 ? this.Left(parent) : this.Right(current)
      }
      PseudoCode.RunAt(6)
      this.ActActive(UniqueAction.Select)
      await this.Set(parent, this._compare(value, parent.value!) < 0 ? LEFT : RIGHT, value)
      this._data.height = Math.max(this._data.height, height)
    }
    this.Restore()
  }

  static get searchPseudoCode() {
    return PseudoCode.Normalize(`
    search(T, v):
      n ← T.root
      while n ≠ nil:
        if n.value = v:
          return n
        else:
          n ← v ≺ n.value ? n.left : n.right
      return nil
    `)
  }

  async Search(value: T, withParent = false) {
    this.Active(value)
    await PseudoCode.RunAt(0)
    let parent = SENTINEL as TreeNodeItem<T> | null
    let node = this._data.root as TreeNodeItem<T> | null
    while (node) {
      PseudoCode.RunAt(2)
      let result = await this.Compare(value, node, true)
      if (result === 0) {
        this.Act(UniqueAction.Select, node)
        this.ActActive(UniqueAction.Select)
        await PseudoCode.RunAt(3)
        this.Restore()
        return withParent ? [node, parent] : node
      } else {
        await PseudoCode.RunAt(5)
        parent = node
        node = node.children[result < 0 ? LEFT : RIGHT]
      }
    }
    await PseudoCode.RunAt(6)
    this.Restore()
    return withParent ? [null, null] : null
  }

  static get deletePseudoCode() {
    return PseudoCode.Normalize(`
    delete(T, v):
      n, pn ← searchWithParent(T, v)
      if n ≠ nil:
        if n.left ≠ nil ⋀ n.right ≠ nil:
          pm ← n, m ← n.right
          while m.left ≠ nil:
            pm ← m, m ← m.left
          (m = pm.left ? pm.left : pm.right) ← m.right
          n.value ← m.value
        else:
          m ← n.left ≠ nil ? n.left : n.right
          if n = H.root:
            H.root ← m
          else:
            (n = pn.left ? pn.left : pn.right) ← m
    `)
  }

  RandomPick(node: TreeNodeItem<T> = this._data.root): T | null {
    while (!this.IsLeaf(node) && Math.random() > 0.3) {
      let children = node.children.filter(c => !!c) as Array<TreeNodeItem<T>>
      let next = children[Math.floor(children.length * Math.random())]
      return this.RandomPick(next)
    }
    return node.value
  }

  async Delete(value: T) {
    PseudoCode.RunAt(0)
    let [node, parent] = await PseudoCode.SilentExecute(() => this.Search(value, true)) as Array<TreeNodeItem<T> | null>
    this.Active(value)
    this.ActActive(UniqueAction.Select)
    await PseudoCode.RunAt(1)
    if (node) {
      this.Act(UniqueAction.Select, node)
      await PseudoCode.RunAt(2)
      if (this.Left(node) && this.Right(node)) {
        PseudoCode.RunAt(3)
        let postParent = node
        let postNode = (await this.Get(node, RIGHT))!
        while (this.Left(postNode)) {
          PseudoCode.RunAt(5)
          postParent = postNode
          postNode = (await this.Get(postNode, LEFT))!
        }
        PseudoCode.RunAt(6)
        await this.ReplaceUp(postParent, postNode, this.Right(postNode), true)
        this.Act(UniqueAction.Target, node)
        this.ActActive(UniqueAction.Move)
        PseudoCode.RunAt(7)
        await Interact.Doze()
        await this.Update(node, postNode.value!)
      } else {
        await PseudoCode.RunAt(9)
        let postNode = this.Left(node) || this.Right(node)
        await PseudoCode.RunAt(10)
        if (parent === SENTINEL) {
          PseudoCode.RunAt(11)
          await this.ReplaceUp(parent, node, postNode)
        } else {
          PseudoCode.RunAt(13)
          await this.ReplaceUp(parent!, node, postNode)
        }
      }
    }
    this.Restore()
  }
}
