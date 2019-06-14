import Vue from 'vue'
import { Interact } from '../Interact'
import { PseudoCode } from '../PseudoCode'
import { UniqueAction, UniqueAttribute } from './Defs'
import { TreeNode } from './TreeDefs'
import { GenericBinaryTreeADT } from './GenericBinaryTree'

export class BinaryTreeADT<T> extends GenericBinaryTreeADT<T> {
  constructor(compare?: (val1: T, val2: T) => number) {
    super({}, compare)
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
    if (this._data.root === this._sentinel) {
      PseudoCode.RunAt(1)
      await this.Set(this._sentinel, 0, value)
      this._data.height = 1
    } else {
      await PseudoCode.RunAt(3)
      let current = this._data.root as TreeNode<T> | null
      let parent = this._sentinel
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
      await this.Set(parent, this._compare(value, parent.value!) < 0 ? this.left : this.right, value)
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
    let parent = this._sentinel as TreeNode<T> | null
    let node = this._data.root as TreeNode<T> | null
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
        node = node.children[result < 0 ? this.left : this.right]
      }
    }
    await PseudoCode.RunAt(6)
    this.Restore()
    return withParent ? [null, null] : null
  }

  static get deletePseudoCode() {
    return PseudoCode.Normalize(`
    delete(T, v):
      n ← search(T, v)
      if n ≠ nil:
        if n.left ≠ nil ⋀ n.right ≠ nil:
          s = min(n.right)
          replace(T, s, s.right)
          n.value ← s.value
        else:
          s ← n.left ≠ nil ? n.left : n.right
          replace(T, n, s)
    `)
  }

  async Delete(value: T) {
    PseudoCode.RunAt(0)
    let [node, parent] = await PseudoCode.SilentExecute(() => this.Search(value, true)) as Array<TreeNode<T> | null>
    this.Active(value)
    this.ActActive(UniqueAction.Select)
    await PseudoCode.RunAt(1)
    if (node) {
      this.Act(UniqueAction.Select, node)
      this.Attribute(UniqueAttribute.Ignore, node)
      await PseudoCode.RunAt(2)
      if (this.Left(node) && this.Right(node)) {
        PseudoCode.RunAt(3)
        let [successor, sp] = await this.Min(this.Right(node)!, node)
        this.Link(successor, node)
        PseudoCode.RunAt(4)
        await this.ReplaceNode(sp, successor, this.Right(successor))
        this.Unlink(successor, node)
        this.Act(UniqueAction.Target, node)
        this.ActActive(UniqueAction.Move)
        await Interact.Doze()
        PseudoCode.RunAt(5)
        await this.Update(node, successor.value!)
      } else {
        await PseudoCode.RunAt(7)
        let successor = this.Left(node) || this.Right(node)
        PseudoCode.RunAt(8)
        await this.ReplaceNode(parent!, node, successor)
      }
    }
    this.Restore()
  }
}
