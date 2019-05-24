import { Arrayex } from 'arrayex'
import { $olink } from './ObjectLink'
import { Sleep } from './utils'

export enum BinaryNodeState {
  None = 0,
  Accessed,
  Selected,
  Swapping,
  Less,
  Greater,
}


export interface BinaryNode<T> {
  value: T,
  left: Array<BinaryNode<T>>,
  right: Array<BinaryNode<T>>,
  level: number,
  state: number,
}

export interface BinaryTreeState {
  height: number,
}

function CreateBinaryNode<T>(value: T) {
  return { value, left: [], right: [], level: 0, state: BinaryNodeState.None } as BinaryNode<T>
}

export class BinaryTree<T> {
  private _root: Array<BinaryNode<T>> = []
  private _valueCompare: (v1: T, v2: T) => number
  private _compare: (n1: BinaryNode<T>, n2: BinaryNode<T>) => number
  private _delay: number
  private _id: number
  private _state: BinaryTreeState

  constructor(array: Array<T> = [], state: BinaryTreeState, compare: (val1: T, val2: T) => number) {
    this._state = state
    this._valueCompare = compare
    this._compare = (n1: BinaryNode<T>, n2: BinaryNode<T>) => compare(n1.value, n2.value)
    for (let value of array) {
      this.InsertNormally(value)
    }
    this._delay = 0
    this._id = $olink.New(this)
  }

  private static BinaryTraverse(array: Array<number>, from: number, to: number): Array<number> {
    if (to >= from) {
      let pivot = from + Math.floor((to - from) / 2)
      let lefts = this.BinaryTraverse(array, from, pivot - 1)
      let rights = this.BinaryTraverse(array, pivot + 1, to)
      return [array[pivot], ...lefts.slice(0, 1), ...rights.slice(0, 1), ...lefts.slice(1), ...rights.slice(1)]
    } else {
      return []
    }
  }

  static NumericData(n: number, range = [0, 50]) {
    let mid = Math.round(range[0] + (range[1] - range[0]) / 2)
    let halfN = Math.floor(n / 2)
    if (halfN > 0) {
      let pivot = n % 2 ? [mid] : []
      let halfData = Arrayex.Create(halfN, () => Math.round((range[1] - range[0]) * Math.random() + range[0]))
      let data = [...halfData, ...pivot, ...halfData.map(v => range[1] - (v - range[0]))]
      data = data.sort((n1, n2) => n1 - n2)
      return this.BinaryTraverse(data, 0, data.length - 1)
    } else {
      return [mid]
    }
  }

  static Numeric(n: number, range = [0, 50], state: BinaryTreeState) {
    let data = this.NumericData(n, range)
    return this.FromNumeric(data, state)
  }

  static FromNumeric(data: Array<number>, state: BinaryTreeState) {
    let tree = new BinaryTree(data, state, (n1, n2) => n1 - n2)
    return { id: tree._id, root: tree.root }
  }

  get root() {
    return this._root
  }

  get id() {
    return this._id
  }

  get delay() {
    return this._delay
  }

  set delay(value: number) {
    this._delay = value
  }

  InsertNormally(value: T) {
    if (this._root.length > 0) {
      let node = CreateBinaryNode(value)
      let parent = this._root[0]
      let current = this._compare(node, parent) > 0 ? parent.right[0] : parent.left[0]
      while (current) {
        node.level++
        parent = current
        current = this._compare(node, parent) > 0 ? parent.right[0] : parent.left[0]
      }
      node.level++
      if (this._compare(node, parent) > 0) {
        parent.right.push(node)
      } else {
        parent.left.push(node)
      }
      this._state.height = Math.max(this._state.height, node.level)
    } else {
      this._root.push(CreateBinaryNode(value))
    }
  }

  State(state: number, ...nodes: Array<BinaryNode<T>>) {
    nodes.forEach(node => { node.state = state })
  }

  Restore(node: BinaryNode<T>) {
    if (node) {
      node.state = BinaryNodeState.None
      this.Restore(node.left[0])
      this.Restore(node.right[0])
    }
  }

  private async VisitNode(node: BinaryNode<T>, state = BinaryNodeState.Accessed) {
    this.State(state, node)
    return await Sleep(this._delay)
  }

  private async VisitCompare(node: BinaryNode<T>, ref: BinaryNode<T>) {
    let result = this._compare(node, ref)
    this.State(result > 0 ? BinaryNodeState.Greater : BinaryNodeState.Less, ref)
    await Sleep(this._delay)
    return result
  }

  async Insert(value: T) {
    if (this._root.length > 0) {
      let node = CreateBinaryNode(value)
      let parent = this._root[0]
      let current = await this.VisitCompare(node, parent) > 0 ? parent.right[0] : parent.left[0]
      while (current) {
        node.level++
        parent = current
        current = await this.VisitCompare(node, parent) > 0 ? parent.right[0] : parent.left[0]
      }
      node.level++
      if (this._compare(node, parent) > 0) {
        parent.right.push(node)
      } else {
        parent.left.push(node)
      }
      this.VisitNode(node)
      this._state.height = Math.max(this._state.height, node.level)
    } else {
      this._root.push(CreateBinaryNode(value))
    }
    await Sleep(this._delay)
    this.Restore(this._root[0])
    await Sleep(this._delay)
  }

  private async SearchAt(node: BinaryNode<T>, value: T) {
    let fakeNode = CreateBinaryNode(value)
    let result = await this.VisitCompare(fakeNode, node)
    if (result > 0) {
      if (node.right.length > 0) {
        await this.SearchAt(node.right[0], value)
      }
    } else if (result < 0) {
      if (node.left.length > 0) {
        await this.SearchAt(node.left[0], value)
      }
    } else {
      this.State(BinaryNodeState.Selected, node)
      await Sleep(this._delay)
    }
  }

  async Search(value: T, restored = true) {
    await this.SearchAt(this._root[0], value)
    if (restored) {
      await Sleep(this._delay)
      this.Restore(this._root[0])
    }
  }

  private async PreorderInterval(node: BinaryNode<T>) {
    await this.VisitNode(node)
    if (node.left.length > 0) {
      await this.PreorderInterval(node.left[0])
    }
    if (node.right.length > 0) {
      await this.PreorderInterval(node.right[0])
    }
  }

  async Preorder() {
    if (this._root.length > 0) {
      await this.PreorderInterval(this._root[0])
    }
  }

  private async PostorderInterval(node: BinaryNode<T>) {
    if (node.left.length > 0) {
      await this.PostorderInterval(node.left[0])
    }
    if (node.right.length > 0) {
      await this.PostorderInterval(node.right[0])
    }
    await this.VisitNode(node)
  }

  async Postorder() {
    if (this._root.length > 0) {
      await this.PostorderInterval(this._root[0])
    }
  }

  private async InorderInterval(node: BinaryNode<T>) {
    if (node.left.length > 0) {
      await this.InorderInterval(node.left[0])
    }
    await this.VisitNode(node)
    if (node.right.length > 0) {
      await this.InorderInterval(node.right[0])
    }
  }

  async Inorder() {
    if (this._root.length > 0) {
      await this.InorderInterval(this._root[0])
    }
  }

  private InstantSearchAt(node: BinaryNode<T>, parentNode: BinaryNode<T> | null, value: T): { node: BinaryNode<T>, parentNode: BinaryNode<T> | null } | null {
    let result = this._valueCompare(value, node.value)
    if (result > 0) {
      if (node.right.length > 0) {
        return this.InstantSearchAt(node.right[0], node, value)
      } else {
        return null
      }
    } else if (result < 0) {
      if (node.left.length > 0) {
        return this.InstantSearchAt(node.left[0], node, value)
      } else {
        return null
      }
    } else {
      return { node, parentNode }
    }
  }

  private async SpliceNode(parentNode: BinaryNode<T> | null, node: BinaryNode<T>, ...newNodes: Array<BinaryNode<T>>) {
    if (parentNode) {
      if (parentNode.left.includes(node)) {
        parentNode.left.splice(0, 1, ...newNodes)
      } else {
        parentNode.right.splice(0, 1, ...newNodes)
      }
    } else {
      this._root.splice(0, 1, ...newNodes)
    }
    newNodes.forEach(nn => nn.level = node.level)
    await Sleep(this._delay)
    if (this._root.length > 0) {
      this.Restore(this._root[0])
    }
  }

  async Delete(value: T) {
    await this.Search(value, false)
    let result = this.InstantSearchAt(this._root[0], null, value)
    while (result) {
      await this.VisitNode(result.node, BinaryNodeState.Selected)
      let { node, parentNode } = result
      let branches = node.left.length + node.right.length
      if (branches > 1) {
        let ps = node
        let successor = node.right[0]
        await this.VisitNode(successor)
        let probe = successor.left[0]
        while (probe) {
          await this.VisitNode(probe)
          ps = successor
          successor = probe
          probe = probe.left[0]
        }
        this.State(BinaryNodeState.Swapping, node, successor)
        await Sleep(this._delay)
        // successor should have no left child but possible right child, isolate successor
        let right = successor.right.splice(0)
        if (ps !== node) {
          ps.left.splice(0, 1, ...right)
        } else {
          ps.right.splice(0, 1, ...right)
        }
        // now the successor is isolated
        successor.left.push(...node.left.splice(0))
        successor.right.push(...node.right.splice(0))
        await this.SpliceNode(parentNode, node, successor)
      } else if (branches > 0) {
        let branchNode = node.left.length > 0 ? node.left[0] : node.right[0]
        this.State(BinaryNodeState.Swapping, node, branchNode)
        await Sleep(this._delay)
        await this.SpliceNode(parentNode, node, branchNode)
      } else {
        await this.SpliceNode(parentNode, node)
      }
      result = this._root.length > 0 ? this.InstantSearchAt(this._root[0], null, value) : null
      if (this._root.length > 0) {
        this.Restore(this._root[0])
      }
    }
    this.Restore(this._root[0])
  }
}
