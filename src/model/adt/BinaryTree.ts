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
        n ← T.root, p ← nil
        while n ≠ nil:
          p ← n, n ← v ≺ n.value ? n.left : n.right
        c ← node(v), c.parent ← p, (v ≺ p.value ? p.left : p.right) ← c
    `)
  }

  async Insert(value: T) {
    this.Active(value)
    await PseudoCode.RunThrough(0)
    if (this._data.root === this._sentinel) {
      PseudoCode.RunAt(1)
      await this.Set(this._sentinel, 0, value)
      this._data.height = 1
    } else {
      await PseudoCode.RunThrough(2, 3)
      let node = this._data.root
      let parent = this._sentinel
      let height = 1
      while (node) {
        await PseudoCode.RunThrough(4, 5)
        ++height
        parent = node
        node = await this.Compare(value, node) < 0 ? this.Left(node)! : this.Right(node)!
      }
      PseudoCode.RunAt(6)
      this.ActActive(UniqueAction.Select)
      await this.Set(parent, this._compare(value, parent.value!) < 0 ? this.left : this.right, value)
      this._data.height = Math.max(this._data.height, height)
    }
    this.Restore()
  }

  static get deletePseudoCode() {
    return PseudoCode.Normalize(`
    delete(T, v):
      n ← search(T, v)
      if n ≠ nil:
        if n.left ≠ nil ⋀ n.right ≠ nil:
          s = min(n.right)
          n.value ← s.value
          replace(T, s, s.right)
        else:
          s ← n.left ≠ nil ? n.left : n.right
          replace(T, n, s)
    `)
  }

  async Delete(value: T) {
    await PseudoCode.RunThrough(0)
    let node = await PseudoCode.SilentExecute(() => this.Search(value)) as TreeNode<T> | null
    this.Active(value)
    this.ActActive(UniqueAction.Select)
    await PseudoCode.RunThrough(1)
    if (node) {
      this.Act(UniqueAction.Select, node)
      this.Attribute(UniqueAttribute.Ignore, node)
      await PseudoCode.RunThrough(2)
      if (this.Left(node) && this.Right(node)) {
        PseudoCode.RunAt(3)
        let successor = await this.Min(this.Right(node)!)
        this.Link(successor, node)
        await PseudoCode.RunAt(4)
        await this.Update(node, successor.value!)
        PseudoCode.RunAt(5)
        await this.ReplaceNode(successor, this.Right(successor))
        this.Unlink(successor, node)
        this.Act(UniqueAction.Target, node)
        this.ActActive(UniqueAction.Move)
      } else {
        await PseudoCode.RunThrough(6, 7)
        let successor = this.Left(node) || this.Right(node)
        PseudoCode.RunAt(8)
        await this.ReplaceNode(node, successor)
      }
    }
    this.Restore()
  }
}
