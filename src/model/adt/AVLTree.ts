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

  private GetBalanceFactor(node: AVLTreeNode<T>) {
    return (this.Left(node) || this._sentinel).height - (this.Right(node) || this._sentinel).height
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
    let values = Array$.Create(7, generator)
    let root = this.New(values[5], 4)
    root.children = [this.New(values[3], 3), this.New(values[6])]
    this.Left(root)!.children = [this.New(values[1], 2), this.New(values[4])]
    this.Left(this.Left(root)!)!.children = [this.New(values[0]), this.New(values[2])]
    this._data.root = root
    this._data.height = root.height
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
    let values = Array$.Create(7, generator)
    let root = this.New(values[1], 4)
    root.children = [this.New(values[0]), this.New(values[3], 3)]
    this.Right(root)!.children = [this.New(values[2]), this.New(values[5], 2)]
    this.Right(this.Right(root)!)!.children = [this.New(values[4]), this.New(values[6])]
    this._data.root = root
    this._data.height = root.height
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

  async RotateRightLeft(pivot: AVLTreeNode<T>, parent: AVLTreeNode<T>) {
    await this.RotateRight(this.Right(pivot)!, pivot)
    await this.RotateLeft(pivot, parent)
  }

  async RotateLeftRight(pivot: AVLTreeNode<T>, parent: AVLTreeNode<T>) {
    await this.RotateLeft(this.Left(pivot)!, pivot)
    await this.RotateRight(pivot, parent)
  }

  static get insertPseudoCode() {
    return PseudoCode.Normalize(`
    insert(T, v, p ← T.root):
      if T.root = nil:
        T.root = node(v)
      else:
        n ← v ≺ p.value ? p.left : p.right
        if n ≠ nil:
          insert(T, v, n), n ← v ≺ p.value ? p.left : p.right
        else:
          (v ≺ p.value ? p.left : p.right) ← node(v)
        bp = balance(p), bn = balance(n)
        switch bp, bn:
          case bp = 2, bn ≺ 0: rotateLeftRight(p)
          case bp = 2, bn ≽ 0: rotateRight(p)
          case bp = -2, bn ≺ 0: rotateLeft(p)
          case bp = -2, bn ≽ 0: rotateRightLeft(p)
    `)
  }

  async Insert(value: T, node = this.root, parent = this._sentinel) {
    if (node === this.root) {
      this.Active(value)
    }
    await PseudoCode.RunAt(0)
    if (this.root === this._sentinel) {
      PseudoCode.RunAt(1)
      await this.Set(this._sentinel, 0, value)
    } else {
      PseudoCode.RunAt(3)
      let result = await this.Compare(value, node)
      let child = result < 0 ? this.Left(node) : this.Right(node)
      await PseudoCode.RunAt(4)
      if (child) {
        await PseudoCode.RunAt(5)
        await this.Insert(value, child, node)
        child = result < 0 ? this.Left(node) : this.Right(node)
      } else {
        PseudoCode.RunAt(7)
        await this.Set(node, result < 0 ? this.left : this.right, value)
      }
      await PseudoCode.RunAt(8)
      this.Restore()
      this.Act(UniqueAction.Peek, node)
      let bf = this.GetBalanceFactor(node)
      if (bf === 2) {
        if (this.GetBalanceFactor(child!) < 0) {
          PseudoCode.RunAt(10)
          await PseudoCode.SilentExecute(() => this.RotateLeftRight(node, parent))
        } else {
          PseudoCode.RunAt(11)
          await PseudoCode.SilentExecute(() => this.RotateRight(node, parent))
        }
      } else if (bf === -2) {
        if (this.GetBalanceFactor(child!) < 0) {
          PseudoCode.RunAt(12)
          await PseudoCode.SilentExecute(() => this.RotateLeft(node, parent))
        } else {
          PseudoCode.RunAt(13)
          await PseudoCode.SilentExecute(() => this.RotateRightLeft(node, parent))
        }
      } else {
        this.UpdateHeight(node)
      }
    }
    if (node === this.root) {
      this.data.height = this.root.height
      this.Restore()
    }
  }
}
