import Vue from 'vue'
import { Array$ } from 'js-corelib'
import { Interact } from '../Interact'
import { ADT } from './ADT'
import { UniqueAction, UniqueState, UniqueAttribute, ValueItem } from './Defs'
import { TreeNode, TreeData } from './TreeDefs'
import { PseudoCode } from '../PseudoCode'

export abstract class GenericBinaryTreeADT<T, TNode extends TreeNode<T> = TreeNode<T>> extends ADT<TreeData<T, TNode>> {
  protected _compare: (val1: T, val2: T) => number
  protected _sentinel: TNode
  private _tagger = 0

  constructor(sentinel: Partial<TNode> = {}, compare?: (val1: T, val2: T) => number) {
    super({ id: -1, root: sentinel as TNode, height: 0, actives: [] })
    this._sentinel = sentinel as TNode
    this._compare = compare || ((val1: T, val2: T) => val1 > val2 ? 1 : (val1 < val2 ? -1 : 0))
  }

  get root() {
    return this._data.root
  }

  get height() {
    return this._data.height
  }

  protected get left() {
    return 0
  }

  protected get right() {
    return 1
  }

  static InOrderTraverse<T, TNode extends TreeNode<T> = TreeNode<T>>(action: (node: TNode) => void, node: TNode) {
    let [left, right] = node.children
    if (left) {
      this.InOrderTraverse(action, left as TNode)
    }
    action(node)
    if (right) {
      this.InOrderTraverse(action, right as TNode)
    }
  }

  static PostOrderTraverse<T, TNode extends TreeNode<T> = TreeNode<T>>(action: (node: TNode) => void, node: TNode) {
    let [left, right] = node.children
    if (left) {
      this.PostOrderTraverse(action, left as TNode)
    }
    if (right) {
      this.PostOrderTraverse(action, right as TNode)
    }
    action(node)
  }

  static PreOrderTraverse<T, TNode extends TreeNode<T> = TreeNode<T>>(action: (node: TNode) => void, node: TNode) {
    action(node)
    let [left, right] = node.children
    if (left) {
      this.PreOrderTraverse(action, left as TNode)
    }
    if (right) {
      this.PreOrderTraverse(action, right as TNode)
    }
  }

  static HeightOf<T, TNode extends TreeNode<T> = TreeNode<T>>(node: TNode | null): number {
    if (node != null) {
      return Math.max(...node.children.map(node => this.HeightOf(node))) + 1
    } else {
      return 0
    }
  }

  private CreateTree(n: number, perfect = true) {
    let nodes = Array$.Create(n, () => this.New(null))
    let nonLeafCount = Math.ceil(nodes.length / 2) - 1
    for (let i = 0; i < nonLeafCount; ++i) {
      nodes[i].children = [nodes[2 * i + 1] || null, nodes[2 * i + 2] || null]
    }
    if (!perfect) {
      while (Math.random() > 0.4) {
        let target = nodes[Math.floor(nonLeafCount * Math.random())]
        if (this.Left(target) && this.Right(target)) {
          let right = this.Right(target)!
          Vue.set(target.children, this.right, null)
          let parent = this.Left(target)!
          let probe = this.Right(parent)
          while (probe) {
            parent = probe!
            probe = this.Right(probe)
          }
          Vue.set(parent.children, this.right, right)
        }
      }
    }
    return nodes[0]
  }

  Replace(values: Array<T | null>, perfect = true) {
    let sorted = [...new Set(Array$.NonNull(values))].sort(this._compare)
    // create tree
    this._data.root = this.CreateTree(sorted.length, perfect)
    // set value
    let i = 0
    GenericBinaryTreeADT.InOrderTraverse(n => { n.value = sorted[i++] }, this._data.root)
    this._data.height = GenericBinaryTreeADT.HeightOf(this._data.root)
  }

  protected Traverse(action: (node: TNode) => void, node: TNode | null = this._data.root) {
    if (node) {
      action(node)
      node.children.forEach(child => this.Traverse(action, child as TNode))
    }
  }

  IsLeaf(node: TNode) {
    return node.children.every(c => !c)
  }

  Left(node: TNode) {
    return node.children[this.left] as TNode | null
  }

  Right(node: TNode) {
    return node.children[this.right] as TNode | null
  }

  protected New(value: T | null): TNode {
    return { value, children: [null, null], tag: -1, action: UniqueAction.None, state: UniqueState.None, attribute: UniqueAttribute.None } as TNode
  }

  protected Act(action: UniqueAction, ...nodes: Array<TNode | null>) {
    nodes = Array$.NonNull(nodes)
    let origins = nodes.map(node => node!.action)
    nodes.forEach(node => node!.action = action)
    return () => { nodes.forEach((node, i) => node!.action = origins[i] ) }
  }

  protected State(state: UniqueState, ...nodes: Array<TNode>) {
    nodes.forEach(node => node.state = state)
  }

  protected Attribute(attribute: UniqueAttribute, ...nodes: Array<TNode>) {
    nodes.forEach(node => node.attribute = attribute)
  }

  protected Active(value: T) {
    this._data.actives.push({ value, action: UniqueAction.None, state: UniqueState.None, attribute: UniqueAttribute.None } as ValueItem<T>)
  }

  protected ActActive(action: UniqueAction, ...indexes: Array<number>) {
    if (indexes.length === 0) {
      indexes = [this._data.actives.length - 1]
    }
    indexes.map(index => this._data.actives[index].action = action)
  }

  protected Link(from: TNode | null, to: TNode | null, directional = true) {
    if (from && to) {
      from.tag = ++this._tagger
      to.tag = this._tagger + (directional ? 0.1 : -0.1)
    }
  }

  protected Unlink(from: TNode | null, to: TNode | null) {
    if (from && to) {
      from.tag = -1
      to.tag = -1
    }
  }

  protected ImmediateReplaceNode(parent: TNode, node: TNode, newNode: TNode | null) {
    if (parent === this._sentinel) {
      this.data.root = newNode!
    } else {
      Vue.set(parent.children, this.Left(parent) === node ? this.left : this.right, newNode)
    }
  }

  async ReplaceNode(parent: TNode, node: TNode, successor: TNode | null) {
    if (successor) {
      this.Act(UniqueAction.Target, node)
      this.Act(UniqueAction.Move, successor)
    }
    await Interact.Doze(3)
    if (successor) {
      this.Act(UniqueAction.None, successor)
    }
    this.ImmediateReplaceNode(parent, node, successor)
    this.Act(UniqueAction.None, node)
    this.Attribute(UniqueAttribute.None, node)
  }

  Restore() {
    this.Traverse(node => {
      node.action = UniqueAction.None
      node.state = UniqueState.None
      node.attribute = UniqueAttribute.None
      node.tag = -1
    })
    this._data.actives.splice(0)
  }

  async Get(parent: TNode, index: number) {
    let child = parent.children[index]
    if (child) {
      this.Act(UniqueAction.Peek, child as TNode)
    }
    await Interact.Doze()
    return child as TNode | null
  }

  async Set(parent: TNode, index: number, value: T) {
    this.Act(UniqueAction.Select, parent)
    let node = this.New(value)
    if (parent === this._sentinel) {
      this._data.root = node as TNode
    } else {
      Vue.set(parent.children, index, node)
    }
    this.Act(UniqueAction.Update, node as TNode)
    await Interact.Doze()
    this.Act(UniqueAction.None, parent, node as TNode)
    return node
  }

  async Update(node: TNode, value: T) {
    this.Act(UniqueAction.Update, node)
    node.value = value
    await Interact.Doze()
  }

  async Compare(value: T, node: TNode, markEqual = false) {
    this.Act(UniqueAction.Peek, node)
    let result = this._compare(value, node.value!)
    if (result < 0) {
      node.state = UniqueState.Less
    } else if (result > 0) {
      node.state = UniqueState.Greater
    } else {
      node.state = markEqual ? UniqueState.Equal : UniqueState.GreaterOrEqual
    }
    await Interact.Doze(0.5)
    return result
  }

  RandomPick(node: TNode = this._data.root): TNode {
    while (!this.IsLeaf(node) && Math.random() > 0.3) {
      let children = node.children.filter(c => !!c) as Array<TreeNode<T>>
      let next = children[Math.floor(children.length * Math.random())]
      return this.RandomPick(next as TNode)
    }
    return node
  }

  static get minPseudoCode() {
    return PseudoCode.Normalize(`
    min(n):
      let m ← n
      while m.left ≠ nil:
        m ← m.left
      return m
    `)
  }

  async Min(node: TNode = this._data.root, parent: TNode = this._sentinel) {
    await PseudoCode.RunAt(0)
    this.Act(UniqueAction.Peek, node)
    let minimum = node
    PseudoCode.RunAt(1)
    while (this.Left(minimum)) {
      PseudoCode.RunAt(2)
      parent = minimum
      minimum = (await this.Get(minimum, this.left))!
    }
    this.Act(UniqueAction.Select, minimum)
    await PseudoCode.RunAt(3)
    return [minimum, parent]
  }

  static get maxPseudoCode() {
    return PseudoCode.Normalize(`
    max(n):
      let m ← n
      while m.right ≠ nil:
        m ← m.right
      return m
    `)
  }

  async Max(node: TNode = this._data.root, parent: TNode = this._sentinel) {
    await PseudoCode.RunAt(0)
    this.Act(UniqueAction.Peek, node)
    let maximum = node
    PseudoCode.RunAt(1)
    while (this.Right(maximum)) {
      PseudoCode.RunAt(2)
      parent = maximum
      maximum = (await this.Get(maximum, this.right))!
    }
    this.Act(UniqueAction.Select, maximum)
    await PseudoCode.RunAt(3)
    return [maximum, parent]
  }

  protected SearchNode(node: TNode) {
    let path = []
    let current = this._data.root
    while (current && current !== node) {
      path.push(current)
      if (this._compare(node.value!, current.value!) < 0) {
        current = this.Left(current)!
      } else {
        current = this.Right(current)!
      }
    }
    return path
  }

  static get successorPseudoCode() {
    return PseudoCode.Normalize(`
    successor(n):
      if n.right ≠ nil:
        return min(n.right)
      else:
        while parent(n) ≠ nil ⋀ n = parent(n).right:
          n ← parent(n)
        return parent(n)
    `)
  }

  async Successor(node: TNode) {
    this.Active(node.value!)
    this.Act(UniqueAction.Select, node)
    await PseudoCode.RunAt(0)
    if (this.Right(node)) {
      let successor = (await this.Min(this.Right(node)!))[0]
      this.Active(successor.value!)
      await PseudoCode.RunAt(1)
      return successor
    } else {
      let path = this.SearchNode(node)
      let parent = path.pop() || null
      this.Act(UniqueAction.Peek, parent)
      while (parent && node === this.Right(parent)) {
        node = parent
        parent = path.pop() || null
        this.Act(UniqueAction.Peek, parent)
        await PseudoCode.RunAt(3)
      }
      this.Act(UniqueAction.Select, parent)
      if (parent) {
        this.Active(parent.value!)
      }
      await PseudoCode.RunAt(4)
      return parent
    }
  }

  static get predecessorPseudoCode() {
    return PseudoCode.Normalize(`
    predecessor(n):
      if n.left ≠ nil:
        return max(n.left)
      else:
        while parent(n) ≠ nil ⋀ n = parent(n).left:
          n ← parent(n)
        return parent(n)
    `)
  }

  async Predecessor(node: TNode) {
    this.Active(node.value!)
    this.Act(UniqueAction.Select, node)
    await PseudoCode.RunAt(0)
    if (this.Left(node)) {
      let predecessor = (await this.Max(this.Left(node)!))[0]
      this.Active(predecessor.value!)
      await PseudoCode.RunAt(1)
      return predecessor
    } else {
      let path = this.SearchNode(node)
      let parent = path.pop() || null
      this.Act(UniqueAction.Peek, parent)
      while (parent && node === this.Left(parent)) {
        node = parent
        parent = path.pop() || null
        this.Act(UniqueAction.Peek, parent)
        await PseudoCode.RunAt(3)
      }
      this.Act(UniqueAction.Select, parent)
      if (parent) {
        this.Active(parent.value!)
      }
      await PseudoCode.RunAt(4)
      return parent
    }
  }

  static get inOrderPseudoCode() {
    return PseudoCode.Normalize(`
      inorder(n ← T.root):
        if n.left ≠ nil
          inorder(n.left)
        visit(n)
        if n.right ≠ nil
          inorder(n.right)
    `)
  }

  async InOrder(node = this._data.root) {
    PseudoCode.RunAt(0)
    if (this.Left(node)) {
      PseudoCode.RunAt(1)
      await this.InOrder(this.Left(node)!)
    }
    PseudoCode.RunAt(2)
    this.Act(UniqueAction.Peek, node)
    this.Active(node.value!)
    await Interact.Doze()
    PseudoCode.RunAt(3)
    if (this.Right(node)) {
      PseudoCode.RunAt(4)
      await this.InOrder(this.Right(node)!)
    }
  }

  static get postOrderPseudoCode() {
    return PseudoCode.Normalize(`
      postorder(n ← T.root):
        if n.left ≠ nil
          postorder(n.left)
        if n.right ≠ nil
          postorder(n.right)
        visit(n)
    `)
  }

  async PostOrder(node = this._data.root) {
    PseudoCode.RunAt(0)
    if (this.Left(node)) {
      PseudoCode.RunAt(1)
      await this.PostOrder(this.Left(node)!)
    }
    PseudoCode.RunAt(2)
    if (this.Right(node)) {
      PseudoCode.RunAt(3)
      await this.PostOrder(this.Right(node)!)
    }
    PseudoCode.RunAt(4)
    this.Act(UniqueAction.Peek, node)
    this.Active(node.value!)
    await Interact.Doze()
  }

  static get preOrderPseudoCode() {
    return PseudoCode.Normalize(`
      preorder(n ← T.root):
        visit(n)
        if n.left ≠ nil
          preorder(n.left)
        if n.right ≠ nil
          preorder(n.right)
    `)
  }

  async PreOrder(node = this._data.root) {
    PseudoCode.RunAt(0)
    this.Act(UniqueAction.Peek, node)
    this.Active(node.value!)
    await Interact.Doze()
    PseudoCode.RunAt(1)
    if (this.Left(node)) {
      PseudoCode.RunAt(2)
      await this.PreOrder(this.Left(node)!)
    }
    PseudoCode.RunAt(3)
    if (this.Right(node)) {
      PseudoCode.RunAt(4)
      await this.PreOrder(this.Right(node)!)
    }
  }
}
