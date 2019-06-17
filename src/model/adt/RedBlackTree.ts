import Vue from 'vue'
import { Array$ } from 'js-corelib'
import { Interact } from '../Interact'
import { PseudoCode } from '../PseudoCode'
import { UniqueAction, UniqueState, UniqueAttribute } from './Defs'
import { TreeNode, TreeData } from './TreeDefs'
import { GenericBinaryTreeADT } from './GenericBinaryTree'

export interface RedBlackTreeNode<T> extends TreeNode<T> {
  red: boolean
}

export type RedBlackTreeData<T> = TreeData<T, RedBlackTreeNode<T>>

export class RedBlackTreeADT<T> extends GenericBinaryTreeADT<T, RedBlackTreeNode<T>> {
  constructor(compare?: (val1: T, val2: T) => number) {
    super({ red: false }, compare)
  }

  protected get nil() {
    return { value: null, red: false, parent: this._sentinel, children: [null, null], tag: -1, action: UniqueAction.None, state: UniqueState.None, attribute: UniqueAttribute.None } as RedBlackTreeNode<T>
  }

  protected IsNil(node: RedBlackTreeNode<T> | null) {
    return !node || node.children.every(c => c == null)
  }

  protected New(value: T | null, red = true) {
    return Object.assign(super.New(value), { red })
  }

  Replace(values: Array<T | null>) {
    super.Replace(values)
    this.FullTraverse((node, height) => {
      node.red = height > 1 && node.value != null && height === this._data.height - 1
    }, this._data.root)
  }

  static get insertFixUpPseudoCode() {
    return PseudoCode.Normalize(`
    insertFix(T, n):
      if n = T.root:
        black(n)
      else:
        p ← n.parent, u ← sibling(p)
        if isRed(p):
          if u = nil ⋁ isBlack(u):
            if isOutside(n):
              black(p), red(p.parent)
              isLeft(p) ? rotateRight(p.parent) : rotateLeft(p.parent)
            else:
              isLeft(p) ? rotateLeft(p) : rotateRight(p)
              insertFix(p)
          else:
            black(p), black(u), red(p.parent)
            insertFix(p.parent)
    `)
  }

  PrepareInsertFixUpSample(generator: () => T) {
    let fix: RedBlackTreeNode<T>
    switch (Math.floor(Math.random() * 4)) {
      default:
        this.PrepareSample(generator, 4, values => {
          let root = this.New(values[2], false)
          this.SetChildren(root, this.New(values[1], true), this.New(values[3], Math.random() > 0.5))
          this.SetChildren(this.Left(root)!, this.New(values[0], true), this.nil)
          fix = this.Left(this.Left(root)!)!
          return root
        })
        break
      case 1:
        this.PrepareSample(generator, 5, values => {
          let root = this.New(values[3], false)
          this.SetChildren(root, this.New(values[1], true), this.New(values[4], Math.random() > 0.5))
          this.SetChildren(this.Left(root)!, this.New(values[0], false), this.New(values[2], true))
          fix = this.Right(this.Left(root)!)!
          return root
        })
        break
      case 2:
          this.PrepareSample(generator, 6, values => {
            let root = this.New(values[3], false)
            this.SetChildren(root, this.New(values[1], Math.random() > 0.5), this.New(values[4], true))
            this.SetChildren(this.Left(root)!, this.New(values[0], false), this.New(values[2], false))
            this.SetChildren(this.Right(root)!, this.New(values[5], true), this.nil)
            fix = this.Left(this.Right(root)!)!
            return root
          })
          break
      case 4:
          this.PrepareSample(generator, 7, values => {
            let root = this.New(values[3], false)
            this.SetChildren(root, this.New(values[1], Math.random() > 0.5), this.New(values[4], true))
            this.SetChildren(this.Left(root)!, this.New(values[0], false), this.New(values[2], false))
            this.SetChildren(this.Right(root)!, this.New(values[5], false), this.New(values[6], true))
            fix = this.Right(this.Right(root)!)!
            return root
          })
          break
    }
    return fix!
  }

  async InsertFixUp(node: RedBlackTreeNode<T>) {
    await PseudoCode.RunThrough(0)
    if (node === this._data.root) {
      await PseudoCode.RunAt(1)
      node.red = false
    } else {
      await PseudoCode.RunThrough(2, 3)
      let parent = node.parent as RedBlackTreeNode<T>
      await PseudoCode.RunThrough(4)
      if (parent.red) {
        let sibling = this.Sibling(parent) as RedBlackTreeNode<T> | null
        await PseudoCode.RunThrough(5)
        if (!sibling || !sibling.red) {
          await PseudoCode.RunThrough(6)
          if (this.IsOutside(node)) {
            await PseudoCode.RunThrough(7);
            (parent.parent as RedBlackTreeNode<T>).red = true
            parent.red = false
            PseudoCode.RunAt(8)
            await (this.IsLeft(parent) ? this.RotateRight(parent.parent as RedBlackTreeNode<T>) : this.RotateLeft(parent.parent as RedBlackTreeNode<T>))
          } else {
            await PseudoCode.RunThrough(9, 10)
            await (this.IsLeft(parent) ? this.RotateLeft(parent) : this.RotateRight(parent))
            PseudoCode.RunAt(11)
            await this.InsertFixUp(parent)
          }
        } else {
          await PseudoCode.RunThrough(12);
          (parent.parent as RedBlackTreeNode<T>).red = true
          parent.red = false
          sibling.red = false
          PseudoCode.RunAt(13)
          await this.InsertFixUp(parent.parent as RedBlackTreeNode<T>)
        }
      }
    }
  }

  static get insertPseudoCode() {
    return PseudoCode.Normalize(`
    insert(T, v):
      if T.root = nil:
        c ← node(v), T.root = node(v), insertFix(T, c)
      else:
        n ← T.root, p ← nil
        while n ≠ nil ⋀ n.value ≠ v:
          p ← n, n ← v ≺ n.value ? n.left : n.right
        if n = nil:
          c ← node(v), c.parent ← p, (v ≺ p.value ? p.left : p.right) ← c
          insertFix(T, c)
    `)
  }

  async Insert(value: T) {
    this.Active(value)
    await PseudoCode.RunThrough(0)
    if (this._data.root === this._sentinel) {
      await PseudoCode.RunAt(1)
      this._data.root = this.New(value, false)
    } else {
      await PseudoCode.RunThrough(2, 3)
      let node = this._data.root as RedBlackTreeNode<T> | null
      let parent = this._sentinel
      while (node && !this.IsNil(node)) {
        await PseudoCode.RunThrough(4, 5)
        let result = await this.Compare(value, node)
        if (result === 0) { break }
        parent = node
        node = result < 0 ? this.Left(node)! : this.Right(node)!
      }
      await PseudoCode.RunThrough(6)
      if (this.IsNil(node)) {
        this.ActActive(UniqueAction.Select)
        PseudoCode.RunAt(7)
        let cNode = await this.Set(parent, this._compare(value, parent.value!) < 0 ? this.left : this.right, value)
        PseudoCode.RunAt(8)
        await PseudoCode.SilentExecute(() => this.InsertFixUp(cNode))
      }
      this._data.height = this.HeightOf(this._data.root)
      this.Restore()
      return !node
    }
  }

  static get deleteFixPseudoCode() {
    return PseudoCode.Normalize(`
    deleteFix(T, n):
      if n ≠ T.root:
        p ← n.parent, s ← sibling(n)
        if isRed(s):
          isLeft(n) ? rotateLeft(p) : rotateRight(p)
          swapColor(p, s), deleteFix(T, n)
        else:
          sl ← s.left, sr ← s.right
          if isBlack(sl) ⋀ isBlack(sr):
            if isBlack(p):
              red(s), deleteFix(T, p)
            else:
              swapColor(p, s)
          else if (isRight(s) ⋀ isBlack(sr)) ⋁ (isLeft(s) ⋀ isBlack(sl)):
            isRight(s) ? rotateRight(s) : rotateLeft(s)
            swapColor(s, s.parent), deleteFix(T, n)
          else:
            swapColor(s, p)
            if isRight(s):
              rotateLeft(p), black(sr)
            else:
              rotateRight(p), black(sl)
    `)
  }

  private SwapColor(node1: RedBlackTreeNode<T>, node2: RedBlackTreeNode<T>) {
    let c1 = node1.red
    node1.red = node2.red
    node2.red = c1
  }

  async DeleteFixUp(node: RedBlackTreeNode<T>) {
    if (node.parent !== this._sentinel) {
      let parent = node.parent as RedBlackTreeNode<T>
      let sibling = this.Sibling(node)!
      if (sibling.red) {
        await (this.IsLeft(node) ? this.RotateLeft(parent) : this.RotateRight(parent))
        this.SwapColor(parent, sibling)
        await this.DeleteFixUp(node)
      } else {
        let sl = this.Left(sibling)!
        let sr = this.Right(sibling)!
        if (!sl.red && !sr.red) {
          if (!parent.red) {
            sibling.red = true
            await this.DeleteFixUp(parent)
          } else {
            this.SwapColor(parent, sibling)
          }
        } else if ((this.IsRight(sibling) && sl.red) || (this.IsLeft(sibling) && sr.red)) {
          await (this.IsRight(sibling) ? this.RotateRight(sibling) : this.RotateLeft(sibling))
          this.SwapColor(sibling, sibling.parent as RedBlackTreeNode<T>)
          await this.DeleteFixUp(node)
        } else {
          this.SwapColor(parent, sibling)
          if (this.IsRight(sibling)) {
            await this.RotateLeft(parent)
            sr.red = false
          } else {
            await this.RotateRight(parent)
            sl.red = false
          }
        }
      }
    }
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
        nIsBlack ← isBlack(n), sIsRed ← isRed(s), replace(T, n, s)
        if nIsBlack:
          if sIsRed:
            black(s)
          else:
            deleteFix(T, s)
    `)
  }

  async Delete(value: T) {
    await PseudoCode.RunThrough(0)
    let node = await PseudoCode.SilentExecute(() => this.Search(value)) as RedBlackTreeNode<T> | null
    await PseudoCode.RunThrough(1)
    if (node) {
      this.Active(value)
      this.ActActive(UniqueAction.Select)
      await PseudoCode.RunThrough(2)
      let successor: RedBlackTreeNode<T> | null = null
      await PseudoCode.RunThrough(3)
      if (!this.IsNil(this.Left(node)) && !this.IsNil(this.Right(node))) {
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
        successor = this.IsNil(this.Left(node)) ? this.Right(node) : this.Left(node)
      }
      PseudoCode.RunAt(9)
      let nodeIsBlack = !node.red
      let successorIsRed = successor!.red
      await this.ReplaceNode(node, successor)
      await PseudoCode.RunThrough(10)
      if (nodeIsBlack) {
        await PseudoCode.RunThrough(11)
        if (successorIsRed) {
          this.Act(UniqueAction.Target, successor)
          await PseudoCode.RunThrough(12)
          successor!.red = false
        } else {
          await PseudoCode.RunThrough(13, 14)
          await this.DeleteFixUp(successor!)
        }
      }
    }
    this.data.height = this.HeightOf(this._data.root)
    this.Restore()
  }
}
