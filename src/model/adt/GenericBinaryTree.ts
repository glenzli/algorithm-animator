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

  protected get nil(): TNode | null {
    return null
  }

  protected get left() {
    return 0
  }

  protected get right() {
    return 1
  }

  InOrderTraverse(action: (node: TNode) => void, node: TNode) {
    let [left, right] = node.children
    if (!this.IsNil(left as TNode | null)) {
      this.InOrderTraverse(action, left as TNode)
    }
    action(node)
    if (!this.IsNil(right as TNode | null)) {
      this.InOrderTraverse(action, right as TNode)
    }
  }

  PostOrderTraverse(action: (node: TNode) => void, node: TNode) {
    let [left, right] = node.children
    if (!this.IsNil(left as TNode | null)) {
      this.PostOrderTraverse(action, left as TNode)
    }
    if (!this.IsNil(right as TNode | null)) {
      this.PostOrderTraverse(action, right as TNode)
    }
    action(node)
  }

  PreOrderTraverse(action: (node: TNode) => void, node: TNode) {
    action(node)
    let [left, right] = node.children
    if (!this.IsNil(left as TNode | null)) {
      this.PreOrderTraverse(action, left as TNode)
    }
    if (!this.IsNil(right as TNode | null)) {
      this.PreOrderTraverse(action, right as TNode)
    }
  }

  protected IsNil(node: TNode | null) {
    return node == null
  }

  HeightOf(node: TNode | null): number {
    if (node) {
      return Math.max(...node!.children.map(node => this.HeightOf(node as TNode | null))) + 1
    } else {
      return 0
    }
  }

  protected SetChildren(parent: TNode, left: TNode | null | undefined, right: TNode | null | undefined) {
    if (left !== undefined) {
      Vue.set(parent.children, this.left, left)
    }
    if (right !== undefined) {
      Vue.set(parent.children, this.right, right)
    }
    parent.children.forEach(c => { if (c) { c.parent = parent } })
  }

  private CreateTree(n: number, perfect = true) {
    let nodes = Array$.Create(n, () => this.New(null))
    let nonLeafCount = Math.ceil(nodes.length / 2) - 1
    for (let i = 0; i < nonLeafCount; ++i) {
      this.SetChildren(nodes[i], nodes[2 * i + 1], nodes[2 * i + 2])
    }
    if (!perfect) {
      while (Math.random() > 0.4) {
        let target = nodes[Math.floor(nonLeafCount * Math.random())]
        if (this.Left(target) && this.Right(target)) {
          let right = this.Right(target)!
          this.Assign(target, this.right, this.nil)
          let parent = this.Left(target)!
          let probe = this.Right(parent)
          while (probe) {
            parent = probe!
            probe = this.Right(probe)
          }
          this.Assign(parent, this.right, right)
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
    this.InOrderTraverse(n => { n.value = sorted[i++] }, this._data.root)
    this._data.height = this.HeightOf(this._data.root)
  }

  protected PrepareSample(generator: () => T, n: number, creator: (values: Array<T>) => TNode) {
    let set = new Set(Array$.Create(n, generator))
    while (set.size < n) {
      set.add(generator())
    }
    this._data.root = creator([...set].sort(this._compare))
    this._data.height = this.HeightOf(this._data.root)
  }

  protected FullTraverse(action: (node: TNode, height: number) => void, node: TNode | null = this._data.root, height = 1) {
    if (node) {
      action(node!, height)
      node!.children.forEach(child => this.FullTraverse(action, child as TNode, height + 1))
    }
  }

  IsLeaf(node: TNode) {
    return node.children.every(c => !c)
  }

  HasNonNilChildren(node: TNode) {
    return node.children.some(c => !this.IsNil(node))
  }

  Left(node: TNode) {
    return node.children[this.left] as TNode | null
  }

  Right(node: TNode) {
    return node.children[this.right] as TNode | null
  }

  IsLeft(node: TNode) {
    return this.Left(node.parent as TNode) === node
  }

  IsRight(node: TNode) {
    return this.Right(node.parent as TNode) === node
  }

  Sibling(node: TNode) {
    return this.IsLeft(node) ? this.Right(node.parent as TNode) : this.Left(node.parent as TNode)
  }

  IsOutside(node: TNode) {
    return this.IsLeft(node) === this.IsLeft(node.parent as TNode)
  }

  IsInside(node: TNode) {
    return this.IsLeft(node) !== this.IsLeft(node.parent as TNode)
  }

  protected New(value: T | null): TNode {
    let children = [this.nil, this.nil]
    let node = { value, parent: this._sentinel as TreeNode<T>, children, tag: -1, action: UniqueAction.None, state: UniqueState.None, attribute: UniqueAttribute.None } as TNode
    node.children.forEach(c => { if (c) {
      c.parent = node
    } })
    return node
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

  protected Active(value: T | null) {
    if (value != null) {
      this._data.actives.push({ value, action: UniqueAction.None, state: UniqueState.None, attribute: UniqueAttribute.None } as ValueItem<T>)
    }
  }

  protected ActActive(action: UniqueAction, ...indexes: Array<number>) {
    if (indexes.length === 0) {
      indexes = [this._data.actives.length - 1]
    }
    indexes.map(index => this._data.actives[index].action = action)
  }

  protected Link(from: TNode | null, to: TNode | null, directional = true) {
    if (from && to) {
      from!.tag = ++this._tagger
      to!.tag = this._tagger + (directional ? 0.1 : -0.1)
    }
  }

  protected Unlink(from: TNode | null, to: TNode | null) {
    if (from && to) {
      from!.tag = -1
      to!.tag = -1
    }
  }

  protected Assign(parent: TNode, index: number, node: TNode | null) {
    Vue.set(parent.children, index, node)
    if (node) {
      node.parent = parent
    }
  }

  protected ImmediateReplaceNode(node: TNode, newNode: TNode | null) {
    if (node.parent === this._sentinel) {
      this._data.root = newNode || this._sentinel
      if (newNode) {
        newNode.parent = this._sentinel
      }
    } else {
      this.Assign(node.parent as TNode, this.IsLeft(node) ?  this.left : this.right, newNode)
    }
    node.parent = this._sentinel
  }

  async ReplaceNode(node: TNode, successor: TNode | null) {
    if (successor) {
      this.Act(UniqueAction.Target, node)
      this.Act(UniqueAction.Move, successor)
    }
    await Interact.Doze(3)
    if (successor) {
      this.Act(UniqueAction.None, successor)
    }
    this.ImmediateReplaceNode(node, successor)
    this.Act(UniqueAction.None, node)
    this.Attribute(UniqueAttribute.None, node)
  }

  Restore() {
    this.FullTraverse(node => {
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
      node.parent = parent
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
    while (this.HasNonNilChildren(node) && Math.random() > 0.3) {
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

  async Min(node: TNode = this._data.root) {
    await PseudoCode.RunThrough(0)
    this.Act(UniqueAction.Peek, node)
    let minimum = node
    while (!this.IsNil(this.Left(minimum))) {
      await PseudoCode.RunThrough(1, 2)
      minimum = (await this.Get(minimum, this.left))!
    }
    this.Act(UniqueAction.Select, minimum)
    await PseudoCode.RunThrough(3)
    return minimum
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

  async Max(node: TNode = this._data.root) {
    await PseudoCode.RunThrough(0)
    this.Act(UniqueAction.Peek, node)
    let maximum = node
    while (!this.IsNil(this.Right(maximum))) {
      await PseudoCode.RunThrough(1, 2)
      maximum = (await this.Get(maximum, this.right))!
    }
    this.Act(UniqueAction.Select, maximum)
    await PseudoCode.RunThrough(3)
    return maximum
  }

  static get successorPseudoCode() {
    return PseudoCode.Normalize(`
    successor(n):
      if n.right ≠ nil:
        return min(n.right)
      else:
        while n.parent ≠ nil ⋀ isRight(n):
          n ← n.parent
        return n.parent
    `)
  }

  async Successor(node: TNode) {
    this.Active(node.value)
    this.Act(UniqueAction.Select, node)
    await PseudoCode.RunThrough(0)
    if (!this.IsNil(this.Right(node))) {
      PseudoCode.RunAt(1)
      let successor = await this.Min(this.Right(node)!)
      this.Active(successor.value)
      return successor
    } else {
      await PseudoCode.RunThrough(2)
      while (node.parent !== this._sentinel && this.IsRight(node)) {
        await PseudoCode.RunThrough(3)
        node = node.parent as TNode
        this.Act(UniqueAction.Peek, node)
        await PseudoCode.RunAt(4)
      }
      this.Act(UniqueAction.Select, node.parent as TNode)
      this.Active(node.parent.value)
      await PseudoCode.RunThrough(5)
      return node.parent as TNode
    }
  }

  static get predecessorPseudoCode() {
    return PseudoCode.Normalize(`
    predecessor(n):
      if n.left ≠ nil:
        return max(n.left)
      else:
        while n.parent ≠ nil ⋀ isLeft(n):
          n ← n.parent
        return n.parent
    `)
  }

  async Predecessor(node: TNode) {
    this.Active(node.value)
    this.Act(UniqueAction.Select, node)
    await PseudoCode.RunThrough(0)
    if (!this.IsNil(this.Left(node))) {
      PseudoCode.RunAt(1)
      let predecessor = await this.Max(this.Left(node)!)
      this.Active(predecessor.value)
      return predecessor
    } else {
      await PseudoCode.RunThrough(2)
      while (node.parent !== this._sentinel && this.IsLeft(node)) {
        await PseudoCode.RunThrough(3)
        node = node.parent as TNode
        this.Act(UniqueAction.Peek, node)
        await PseudoCode.RunAt(4)
      }
      this.Act(UniqueAction.Select, node.parent as TNode)
      this.Active(node.parent.value)
      await PseudoCode.RunThrough(5)
      return node.parent as TNode
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
    await PseudoCode.RunThrough(0)
    if (!this.IsNil(this.Left(node))) {
      PseudoCode.RunAt(1)
      await this.InOrder(this.Left(node)!)
    }
    PseudoCode.RunAt(2)
    this.Act(UniqueAction.Peek, node)
    this.Active(node.value)
    await Interact.Doze()
    await PseudoCode.RunThrough(3)
    if (!this.IsNil(this.Right(node))) {
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
    await PseudoCode.RunThrough(0)
    if (!this.IsNil(this.Left(node))) {
      PseudoCode.RunAt(1)
      await this.PostOrder(this.Left(node)!)
    }
    await PseudoCode.RunThrough(2)
    if (!this.IsNil(this.Right(node))) {
      PseudoCode.RunAt(3)
      await this.PostOrder(this.Right(node)!)
    }
    PseudoCode.RunAt(4)
    this.Act(UniqueAction.Peek, node)
    this.Active(node.value)
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
    this.Active(node.value)
    await Interact.Doze()
    await PseudoCode.RunThrough(1)
    if (!this.IsNil(this.Left(node))) {
      PseudoCode.RunAt(2)
      await this.PreOrder(this.Left(node)!)
    }
    await PseudoCode.RunThrough(3)
    if (!this.IsNil(this.Right(node))) {
      PseudoCode.RunAt(4)
      await this.PreOrder(this.Right(node)!)
    }
  }

  static get rotateRightPseudoCode() {
    return PseudoCode.Normalize(`
    rotateRight(T, n):
      left ← n.left
      n.left ← left.right, left.right.parent ← n
      left.right ← n
      replace(n, left), n.parent ← left
    `)
  }

  async RotateRight(pivot: TNode = this._data.root) {
    this.State(UniqueState.Violate, pivot)
    await PseudoCode.RunThrough(0)
    let left = this.Left(pivot)!
    let rightOfLeft = this.Right(left)
    this.Act(UniqueAction.Rotate, pivot, left)
    await PseudoCode.RunThrough(1, 2)
    await Interact.Doze(2)
    if (rightOfLeft) {
      this.Link(rightOfLeft, pivot, false)
      this.Act(UniqueAction.Isolate, rightOfLeft)
      await Interact.Doze(3)
    }
    this.State(UniqueState.None, pivot)
    this.Act(UniqueAction.None, pivot, left, rightOfLeft)
    this.Assign(pivot, this.left, rightOfLeft)
    Vue.set(left.children, this.right, pivot)
    PseudoCode.RunAt(3)
    this.ImmediateReplaceNode(pivot, left)
    pivot.parent = left
    this.Unlink(rightOfLeft, pivot)
    await Interact.Doze(1)
  }

  static get rotateLeftPseudoCode() {
    return PseudoCode.Normalize(`
    rotateLeft(T, n):
      right ← n.right
      n.right ← right.left, right.left.parent ← n
      right.left ← n
      replace(n, right), n.parent ← right
    `)
  }

  async RotateLeft(pivot: TNode = this._data.root) {
    this.State(UniqueState.Violate, pivot)
    await PseudoCode.RunThrough(0)
    let right = this.Right(pivot)!
    let leftOfRight = this.Left(right)
    this.Act(UniqueAction.Rotate, pivot, right)
    await PseudoCode.RunThrough(1, 2)
    await Interact.Doze(2)
    if (leftOfRight) {
      this.Link(leftOfRight, pivot, false)
      this.Act(UniqueAction.Isolate, leftOfRight)
      await Interact.Doze(3)
    }
    this.State(UniqueState.None, pivot)
    this.Act(UniqueAction.None, pivot, right, leftOfRight)
    this.Assign(pivot, this.right, leftOfRight)
    Vue.set(right.children, this.left, pivot)
    PseudoCode.RunAt(3)
    this.ImmediateReplaceNode(pivot, right)
    pivot.parent = right
    this.Unlink(leftOfRight, pivot)
    await Interact.Doze(1)
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

  async Search(value: T) {
    this.Active(value)
    await PseudoCode.RunThrough(0)
    let node = this._data.root as TNode | null
    while (!this.IsNil(node)) {
      await PseudoCode.RunThrough(1, 2)
      let result = await this.Compare(value, node!, true)
      if (result === 0) {
        this.Act(UniqueAction.Select, node)
        this.ActActive(UniqueAction.Select)
        await PseudoCode.RunAt(3)
        this.Restore()
        return node
      } else {
        await PseudoCode.RunAt(5)
        node = node!.children[result < 0 ? this.left : this.right] as TNode | null
      }
    }
    await PseudoCode.RunThrough(6)
    this.Restore()
    return null
  }
}
