import { Array$ } from 'js-corelib'
import { PseudoCode } from '../PseudoCode'
import { UniqueAction } from './Defs'
import { TreeNode, TreeData } from './TreeDefs'
import { GenericBinaryTreeADT } from './GenericBinaryTree'

export interface AVLTreeNode<T> extends TreeNode<T> {
  height: number
}

export type AVLTreeData<T> = TreeData<T, AVLTreeNode<T>>

export class AVLTreeADT<T> extends GenericBinaryTreeADT<T, AVLTreeNode<T>> {
  constructor(compare?: (val1: T, val2: T) => number) {
    super({ height: 0 }, compare)
  }

  protected New(value: T, height = 1) {
    return Object.assign(super.New(value), { height })
  }

  Replace(values: Array<T | null>) {
    super.Replace(values)
    this.PostOrderTraverse(node => { this.UpdateHeight(node) }, this._data.root)
    this._data.height = this._data.root.height
  }

  private UpdateHeight(node: AVLTreeNode<T>) {
    if (node !== this._sentinel) {
      node.height = Math.max((this.Left(node) || this._sentinel).height, (this.Right(node) || this._sentinel).height) + 1
    }
  }

  private UpdateHeightUp(node: AVLTreeNode<T>) {
    while (node !== this._sentinel) {
      this.UpdateHeight(node)
      node = node.parent as AVLTreeNode<T>
    }
  }

  BalanceOf(node: AVLTreeNode<T>) {
    return (this.Left(node) || this._sentinel).height - (this.Right(node) || this._sentinel).height
  }

  PrepareRotateRightSample(generator: () => T) {
    this.PrepareSample(generator, 7, values => {
      let root = this.New(values[5], 4)
      this.SetChildren(root, this.New(values[3], 3), this.New(values[6]))
      this.SetChildren(this.Left(root)!, this.New(values[1], 2), this.New(values[4]))
      this.SetChildren(this.Left(this.Left(root)!)!, this.New(values[0]), this.New(values[2]))
      return root
    })
  }

  async RotateRight(pivot: AVLTreeNode<T> = this._data.root) {
    await super.RotateRight(pivot)
    this.UpdateHeightUp(pivot)
  }

  PrepareRotateLeftSample(generator: () => T) {
    this.PrepareSample(generator, 7, values => {
      let root = this.New(values[1], 4)
      this.SetChildren(root, this.New(values[0]), this.New(values[3], 3))
      this.SetChildren(this.Right(root)!, this.New(values[2]), this.New(values[5], 2))
      this.SetChildren(this.Right(this.Right(root)!)!, this.New(values[4]), this.New(values[6]))
      return root
    })
  }

  async RotateLeft(pivot: AVLTreeNode<T> = this._data.root) {
    await super.RotateLeft(pivot)
    this.UpdateHeightUp(pivot)
  }

  static get rotateRightLeftPseudoCode() {
    return PseudoCode.Normalize(`
    rotateRightLeft(T, n):
      rotateRight(T, n.right)
      rotateLeft(T, n)
    `)
  }

  PrepareRotateRightLeftSample(generator: () => T) {
    this.PrepareSample(generator, 7, values => {
      let root = this.New(values[1], 4)
      this.SetChildren(root, this.New(values[0]), this.New(values[5], 3))
      this.SetChildren(this.Right(root)!, this.New(values[3], 2), this.New(values[6]))
      this.SetChildren(this.Left(this.Right(root)!)!, this.New(values[2]), this.New(values[4]))
      return root
    })
  }

  async RotateRightLeft(pivot: AVLTreeNode<T> = this._data.root) {
    await PseudoCode.RunThrough(0)
    await PseudoCode.SilentExecute(() => this.RotateRight(this.Right(pivot)!))
    await PseudoCode.RunThrough(1)
    await PseudoCode.SilentExecute(() => this.RotateLeft(pivot))
  }

  static get rotateLeftRightPseudoCode() {
    return PseudoCode.Normalize(`
    rotateRightLeft(T, n):
      rotateLeft(T, n.left)
      rotateRight(T, n)
    `)
  }

  PrepareRotateLeftRightSample(generator: () => T) {
    return this.PrepareSample(generator, 7, values => {
      let root = this.New(values[5], 4)
      this.SetChildren(root, this.New(values[1], 3), this.New(values[6]))
      this.SetChildren(this.Left(root)!, this.New(values[0]), this.New(values[3], 2))
      this.SetChildren(this.Right(this.Left(root)!)!, this.New(values[2]), this.New(values[4]))
      return root
    })
  }

  async RotateLeftRight(pivot: AVLTreeNode<T> = this._data.root) {
    await PseudoCode.RunThrough(0)
    await PseudoCode.SilentExecute(() => this.RotateLeft(this.Left(pivot)!))
    await PseudoCode.RunThrough(1)
    await PseudoCode.SilentExecute(() => this.RotateRight(pivot))
  }

  static get balanceUpPseudoCode() {
    return PseudoCode.Normalize(`
    balanceUp(n):
      if n ≠ nil:
        bn ← balanceOf(n), bc ← balanceOf(bn > 0 ? n.left : n.right)
        switch bn, bc:
          case bn = 2, bc ≺ 0: rotateLeftRight(n)
          case bn = 2, bc ≻ 0: rotateRight(n)
          case bn = -2, bc ≺ 0: rotateLeft(n)
          case bn = -2, bc ≻ 0: rotateRightLeft(n)
        balanceUp(n.parent)
    `)
  }

  PrepareBalanceUpSample(generator: () => T) {
    switch (Math.floor(Math.random() * 4)) {
      case 0: this.PrepareRotateLeftRightSample(generator); break
      case 1: this.PrepareRotateLeftSample(generator); break
      case 2: this.PrepareRotateRightLeftSample(generator); break
      default: this.PrepareRotateRightSample(generator); break
    }
  }

  async BalanceUp(node = this._data.root) {
    await PseudoCode.RunThrough(0)
    if (node && node !== this._sentinel) {
      await PseudoCode.RunThrough(1)
      let bn = this.BalanceOf(node)
      if (bn === 2) {
        await PseudoCode.RunThrough(2)
        let bc = this.BalanceOf(this.Left(node)!)
        if (bc < 0) {
          PseudoCode.RunAt(3)
          await PseudoCode.SilentExecute(() => this.RotateLeftRight(node))
        } else {
          PseudoCode.RunAt(4)
          await PseudoCode.SilentExecute(() => this.RotateRight(node))
        }
      } else if (bn === -2) {
        await PseudoCode.RunThrough(2)
        let bc = this.BalanceOf(this.Right(node)!)
        if (bc < 0) {
          PseudoCode.RunAt(5)
          await PseudoCode.SilentExecute(() => this.RotateLeft(node))
        } else {
          PseudoCode.RunAt(6)
          await PseudoCode.SilentExecute(() => this.RotateRightLeft(node))
        }
      }
      await PseudoCode.RunThrough(7)
      await this.BalanceUp(node.parent as AVLTreeNode<T>)
    }
  }

  static get insertPseudoCode() {
    return PseudoCode.Normalize(`
    insert(T, v, n ← T.root):
      if T.root = nil:
        T.root = node(v)
      else:
        n ← T.root, p ← nil
        while n ≠ nil ⋀ n.value ≠ v:
          p ← n, n ← v ≺ n.value ? n.left : n.right
        if n = nil
          c ← node(v), c.parent ← p, (v ≺ p.value ? p.left : p.right) ← c
          balanceUp(p)
    `)
  }

  async Insert(value: T): Promise<boolean> {
    this.Active(value)
    let inserted = false
    await PseudoCode.RunThrough(0)
    if (this.root === this._sentinel) {
      PseudoCode.RunAt(1)
      this.ActActive(UniqueAction.Select)
      await this.Set(this._sentinel, 0, value)
      inserted = true
    } else {
      await PseudoCode.RunThrough(2, 3)
      let node = this._data.root
      let parent = this._sentinel
      while (node) {
        await PseudoCode.RunThrough(4, 5)
        let result = await this.Compare(value, node)
        if (result === 0) { break }
        parent = node
        node = await this.Compare(value, node) < 0 ? this.Left(node)! : this.Right(node)!
      }
      await PseudoCode.RunThrough(6)
      if (!node) {
        PseudoCode.RunAt(7)
        inserted = true
        this.ActActive(UniqueAction.Select)
        await this.Set(parent, this._compare(value, parent.value!) < 0 ? this.left : this.right, value)
        PseudoCode.RunAt(8)
        this.UpdateHeightUp(parent)
        await this.BalanceUp(parent)
      }
    }
    this.data.height = this.root.height
    this.Restore()
    return inserted
  }

  static get deletePseudoCode() {
    return PseudoCode.Normalize(`
    delete(T, v):
      n ← search(T, v)
      if n ≠ nil:
        s ← nil
        if n.left ≠ nil ⋀ n.right ≠ nil:
          s = min(n.right)
          n.value ← s.value
          n ← s, s ← s.right
        else:
          s ← n.left ≠ nil ? n.left : n.right
        p ← s.parent, replace(T, s, s.right)
        balance(p)
    `)
  }

  async Delete(value: T) {
    await PseudoCode.RunThrough(0)
    let node = await PseudoCode.SilentExecute(() => this.Search(value)) as AVLTreeNode<T> | null
    await PseudoCode.RunThrough(1)
    if (node) {
      this.Active(value)
      this.ActActive(UniqueAction.Select)
      await PseudoCode.RunThrough(2)
      let successor: AVLTreeNode<T> | null = null
      await PseudoCode.RunThrough(3)
      if (this.Left(node) && this.Right(node)) {
        PseudoCode.RunAt(4)
        successor = await PseudoCode.SilentExecute(() => this.Min(this.Right(node!)!))
        this.Link(successor, node)
        await PseudoCode.RunThrough(5)
        await this.Update(node, successor.value!)
        this.Unlink(successor, node)
        await PseudoCode.RunThrough(6)
        node = successor
        successor = this.Right(successor)
      } else {
        await PseudoCode.RunThrough(7, 8)
        successor = this.Left(node) || this.Right(node)
      }
      PseudoCode.RunAt(9)
      let parent = node.parent as AVLTreeNode<T>
      await this.ReplaceNode(node, successor)
      PseudoCode.RunAt(10)
      this.UpdateHeightUp(parent)
      await this.BalanceUp(parent)
    }
    this.data.height = this.root.height
    this.Restore()
  }
}
