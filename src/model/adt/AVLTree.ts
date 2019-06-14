import Vue from 'vue'
import { Array$ } from 'js-corelib'
import { Interact } from '../Interact'
import { PseudoCode } from '../PseudoCode'
import { UniqueAction, UniqueState } from './Defs'
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
    return Object.assign({ height }, super.New(value))
  }

  Replace(values: Array<T | null>) {
    super.Replace(values)
    AVLTreeADT.PostOrderTraverse(node => { this.UpdateHeight(node) }, this._data.root)
    this._data.height = this._data.root.height
  }

  private UpdateHeight(node: AVLTreeNode<T>) {
    if (node !== this._sentinel) {
      node.height = Math.max((this.Left(node) || this._sentinel).height, (this.Right(node) || this._sentinel).height) + 1
    }
  }

  private BalanceOf(node: AVLTreeNode<T>) {
    return (this.Left(node) || this._sentinel).height - (this.Right(node) || this._sentinel).height
  }

  private PrepareRotateSample(generator: () => T, creator: (values: Array<T>) => AVLTreeNode<T>) {
    let set = new Set(Array$.Create(7, generator))
    while (set.size < 7) {
      set.add(generator())
    }
    this._data.root = creator([...set].sort(this._compare))
    this._data.height = this._data.root.height
  }

  static get rotateRightPseudoCode() {
    return PseudoCode.Normalize(`
    rotateRight(T, n):
      left ← n.left
      n.left ← left.right
      left.right ← n
      (n = T.root ? T.root : isLeft(n) ? (parent(n).left : parent(n).right)) ← left
    `)
  }

  PrepareRotateRightSample(generator: () => T) {
    this.PrepareRotateSample(generator, values => {
      let root = this.New(values[5], 4)
      root.children = [this.New(values[3], 3), this.New(values[6])]
      this.Left(root)!.children = [this.New(values[1], 2), this.New(values[4])]
      this.Left(this.Left(root)!)!.children = [this.New(values[0]), this.New(values[2])]
      return root
    })
  }

  async RotateRight(pivot: AVLTreeNode<T> = this._data.root, parent: AVLTreeNode<T> = this._sentinel) {
    this.State(UniqueState.Violate, pivot)
    PseudoCode.RunAt(0)
    let left = this.Left(pivot)!
    let rightOfLeft = this.Right(left)
    this.Act(UniqueAction.Rotate, pivot, left)
    await PseudoCode.RunAt(1)
    await PseudoCode.RunAt(2)
    await Interact.Doze(1)
    if (rightOfLeft) {
      this.Link(rightOfLeft, pivot, false)
      this.Act(UniqueAction.Isolate, rightOfLeft)
      await Interact.Doze(3)
    }
    this.State(UniqueState.None, pivot)
    this.Act(UniqueAction.None, pivot, left, rightOfLeft)
    Vue.set(pivot.children, this.left, rightOfLeft)
    Vue.set(left.children, this.right, pivot)
    PseudoCode.RunAt(3)
    this.ImmediateReplaceNode(parent, pivot, left)
    this.UpdateHeight(pivot)
    this.UpdateHeight(left)
    this.UpdateHeight(parent)
    this.Unlink(rightOfLeft, pivot)
    await Interact.Doze(1)
  }

  static get rotateLeftPseudoCode() {
    return PseudoCode.Normalize(`
    rotateLeft(T, n):
      right ← n.right
      n.right ← right.left
      right.left ← n
      (n = T.root ? T.root : isLeft(n) ? (parent(n).left : parent(n).right)) ← right
    `)
  }

  PrepareRotateLeftSample(generator: () => T) {
    this.PrepareRotateSample(generator, values => {
      let root = this.New(values[1], 4)
      root.children = [this.New(values[0]), this.New(values[3], 3)]
      this.Right(root)!.children = [this.New(values[2]), this.New(values[5], 2)]
      this.Right(this.Right(root)!)!.children = [this.New(values[4]), this.New(values[6])]
      return root
    })
  }

  async RotateLeft(pivot: AVLTreeNode<T> = this._data.root, parent: AVLTreeNode<T> = this._sentinel) {
    this.State(UniqueState.Violate, pivot)
    PseudoCode.RunAt(0)
    let right = this.Right(pivot)!
    let leftOfRight = this.Left(right)
    this.Act(UniqueAction.Rotate, pivot, right)
    await PseudoCode.RunAt(1)
    await PseudoCode.RunAt(2)
    await Interact.Doze(1)
    if (leftOfRight) {
      this.Link(leftOfRight, pivot, false)
      this.Act(UniqueAction.Isolate, leftOfRight)
      await Interact.Doze(3)
    }
    this.State(UniqueState.None, pivot)
    this.Act(UniqueAction.None, pivot, right, leftOfRight)
    Vue.set(pivot.children, this.right, leftOfRight)
    Vue.set(right.children, this.left, pivot)
    PseudoCode.RunAt(3)
    this.ImmediateReplaceNode(parent, pivot, right)
    this.UpdateHeight(pivot)
    this.UpdateHeight(right)
    this.UpdateHeight(parent)
    this.Unlink(leftOfRight, pivot)
    await Interact.Doze(1)
  }

  static get rotateRightLeftPseudoCode() {
    return PseudoCode.Normalize(`
    rotateRightLeft(T, n):
      rotateRight(T, n.right)
      rotateLeft(T, n)
    `)
  }

  PrepareRotateRightLeftSample(generator: () => T) {
    this.PrepareRotateSample(generator, values => {
      let root = this.New(values[1], 4)
      root.children = [this.New(values[0]), this.New(values[5], 3)]
      this.Right(root)!.children = [this.New(values[3], 2), this.New(values[6])]
      this.Left(this.Right(root)!)!.children = [this.New(values[2]), this.New(values[4])]
      return root
    })
  }

  async RotateRightLeft(pivot: AVLTreeNode<T> = this._data.root, parent: AVLTreeNode<T> = this._sentinel) {
    await this.RotateRight(this.Right(pivot)!, pivot)
    await this.RotateLeft(pivot, parent)
  }

  static get rotateLeftRightPseudoCode() {
    return PseudoCode.Normalize(`
    rotateRightLeft(T, n):
      rotateLeft(T, n.left)
      rotateRight(T, n)
    `)
  }

  PrepareRotateLeftRightSample(generator: () => T) {
    return this.PrepareRotateSample(generator, values => {
      let root = this.New(values[5], 4)
      root.children = [this.New(values[1], 3), this.New(values[6])]
      this.Left(root)!.children = [this.New(values[0]), this.New(values[3], 2)]
      this.Right(this.Left(root)!)!.children = [this.New(values[2]), this.New(values[4])]
      return root
    })
  }

  async RotateLeftRight(pivot: AVLTreeNode<T> = this._data.root, parent: AVLTreeNode<T> = this._sentinel) {
    await this.RotateLeft(this.Left(pivot)!, pivot)
    await this.RotateRight(pivot, parent)
  }

  static get balancePseudoCode() {
    return PseudoCode.Normalize(`
    balance(n):
      bn ← balanceOf(n), bc ← balanceOf(bn > 0 ? n.left : n.right)
      switch bn, bc:
        case bn = 2, bc ≺ 0: rotateLeftRight(n)
        case bn = 2, bc ≻ 0: rotateRight(n)
        case bn = -2, bc ≺ 0: rotateLeft(n)
        case bn = -2, bc ≻ 0: rotateRightLeft(n)
    `)
  }

  PrepareBalanceSample(generator: () => T) {
    switch (Math.floor(Math.random() * 4)) {
      case 0: this.PrepareRotateLeftRightSample(generator); break
      case 1: this.PrepareRotateLeftSample(generator); break
      case 2: this.PrepareRotateRightLeftSample(generator); break
      default: this.PrepareRotateRightSample(generator); break
    }
  }

  async Balance(node = this._data.root, parent = this._sentinel) {
    await PseudoCode.RunAt(0)
    let bn = this.BalanceOf(node)
    if (bn === 2) {
      let bc = this.BalanceOf(this.Left(node)!)
      if (bc < 0) {
        PseudoCode.RunAt(2)
        await PseudoCode.SilentExecute(() => this.RotateLeftRight(node, parent))
      } else {
        PseudoCode.RunAt(3)
        await PseudoCode.SilentExecute(() => this.RotateRight(node, parent))
      }
    } else if (bn === -2) {
      let bc = this.BalanceOf(this.Right(node)!)
      if (bc < 0) {
        PseudoCode.RunAt(4)
        await PseudoCode.SilentExecute(() => this.RotateLeft(node, parent))
      } else {
        PseudoCode.RunAt(5)
        await PseudoCode.SilentExecute(() => this.RotateRightLeft(node, parent))
      }
    }
  }

  static get insertPseudoCode() {
    return PseudoCode.Normalize(`
    insert(T, v, p ← T.root):
      if T.root = nil:
        T.root = node(v)
      else:
        if p.value ≠ v:
          n ← v ≺ p.value ? p.left : p.right
          if n ≠ nil:
            insert(T, v, n), n ← v ≺ p.value ? p.left : p.right
          else:
            (v ≺ p.value ? p.left : p.right) ← node(v)
          balance(p)
    `)
  }

  async Insert(value: T, node = this._data.root, parent = this._sentinel): Promise<boolean> {
    if (node === this.root) {
      this.Active(value)
    }
    let inserted = false
    await PseudoCode.RunAt(0)
    if (this.root === this._sentinel) {
      PseudoCode.RunAt(1)
      this.ActActive(UniqueAction.Select, 0)
      await this.Set(this._sentinel, 0, value)
      inserted = true
    } else {
      PseudoCode.RunAt(3)
      let result = await this.Compare(value, node)
      // AVL Tree do not support duplicate keys
      if (result !== 0) {
        PseudoCode.RunAt(4)
        let child = result < 0 ? this.Left(node) : this.Right(node)
        await PseudoCode.RunAt(5)
        if (child) {
          await PseudoCode.RunAt(6)
          inserted = await this.Insert(value, child, node)
          child = result < 0 ? this.Left(node) : this.Right(node)
        } else {
          PseudoCode.RunAt(8)
          await this.Set(node, result < 0 ? this.left : this.right, value)
          this.ActActive(UniqueAction.Select, 0)
          inserted = true
        }
        await PseudoCode.RunAt(9)
        this.Restore()
        this.Act(UniqueAction.Peek, node)
        await PseudoCode.SilentExecute(() => this.Balance(node, parent))
        this.UpdateHeight(node)
      }
    }
    if (node === this.root) {
      this.data.height = this.root.height
      this.Restore()
    }
    return inserted
  }

  static get deletePseudoCode() {
    return PseudoCode.Normalize(`
    delete(T, v, n ← T.root):
      if n ≠ nil:
        if v = n.value:
          if n.left ≠ nil ⋀ n.right ≠ nil:
            s = min(n.right)
            delete(T, s.value, n.right)
            n.value ← s.value
          else:
            s ← n.left ≠ nil ? n.left : n.right
            replace(T, n, s), n ← s
        else:
          delete(T, v, v ≺ n.value ? n.left : n.right)
        if n ≠ nil:
          balance(n)
    `)
  }

  async Delete(value: T, node: AVLTreeNode<T> | null = this.root, parent = this._sentinel, fastCompare = false) {
    if (node === this.root) {
      this.Active(value)
    }
    await PseudoCode.RunAt(0)
    if (node) {
      await PseudoCode.RunAt(1)
      let result = 0
      if (fastCompare) {
        result = this._compare(value, node.value!)
      } else {
        result = await this.Compare(value, node, true)
      }
      if (result === 0) {
        this.ActActive(UniqueAction.Select, 0)
        await PseudoCode.RunAt(2)
        if (this.Left(node) && this.Right(node)) {
          await PseudoCode.RunAt(3)
          let [successor] = await PseudoCode.SilentExecute(() => this.Min(this.Right(node!)!, node!))
          this.Link(successor, node)
          await PseudoCode.RunAt(4)
          await this.Delete(successor.value!, this.Right(node)!, node, true)
          this.Unlink(successor, node)
          PseudoCode.RunAt(5)
          await this.Update(node, successor.value!)
        } else {
          await PseudoCode.RunAt(7)
          let successor = this.Left(node) || this.Right(node)
          PseudoCode.RunAt(8)
          await this.ReplaceNode(parent, node, successor)
          this.UpdateHeight(parent)
          node = successor
        }
      } else {
        await PseudoCode.RunAt(10)
        await this.Delete(value, result < 0 ? this.Left(node) : this.Right(node), node, fastCompare)
      }
      PseudoCode.RunAt(11)
      if (node) {
        PseudoCode.RunAt(12)
        await this.Balance(node, parent)
      }
    }
    if (node === this.root) {
      this.data.height = this.root.height
      this.Restore()
    }
  }
}
