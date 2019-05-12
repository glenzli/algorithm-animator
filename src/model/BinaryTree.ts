import { Arrayex } from 'arrayex'
import { $olink } from './ObjectLink'
import { ObservableState, Sleep } from './utils'

export interface ObservableBinaryNode<T> {
  value: T,
  left: Array<ObservableBinaryNode<T>>,
  right: Array<ObservableBinaryNode<T>>,
  level: number,
  state: number,
}

export interface ObservableBinaryTreeState {
  height: number,
}

function CreateBinaryNode<T>(value: T) {
  return { value, left: [], right: [], level: 0, state: ObservableState.None } as ObservableBinaryNode<T>
}

export class ObservableBinaryTree<T> {
  private _root: Array<ObservableBinaryNode<T>> = []
  private _valueCompare: (v1: T, v2: T) => number
  private _compare: (n1: ObservableBinaryNode<T>, n2: ObservableBinaryNode<T>) => number
  private _delay: number
  private _id: number
  private _state: ObservableBinaryTreeState

  constructor(array: Array<T> = [], state: ObservableBinaryTreeState, compare: (val1: T, val2: T) => number) {
    this._state = state
    this._valueCompare = compare
    this._compare = (n1: ObservableBinaryNode<T>, n2: ObservableBinaryNode<T>) => compare(n1.value, n2.value)
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

  static NearlyBalancedNumericData(n: number, range = [0, 50]) {
    let data = Arrayex.Create(n, () => Math.round((range[1] - range[0]) * Math.random() + range[0]))
    data = data.sort((n1, n2) => n1 - n2)
    return this.BinaryTraverse(data, 0, data.length - 1)
  }

  static Numeric(n: number, range = [0, 50], state: ObservableBinaryTreeState) {
    let data = this.NearlyBalancedNumericData(n, range)
    return this.FromNumeric(data, state)
  }

  static FromNumeric(data: Array<number>, state: ObservableBinaryTreeState) {
    let tree = new ObservableBinaryTree(data, state, (n1, n2) => n1 - n2)
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

  State(state: number, ...nodes: Array<ObservableBinaryNode<T>>) {
    nodes.forEach(node => { node.state = state })
  }

  Restore(node: ObservableBinaryNode<T>) {
    if (node) {
      node.state = ObservableState.None
      this.Restore(node.left[0])
      this.Restore(node.right[0])
    }
  }

  private async VisitNode(node: ObservableBinaryNode<T>, state = ObservableState.Accessed) {
    this.State(state, node)
    return await Sleep(this._delay)
  }

  async Insert(value: T) {
    if (this._root.length > 0) {
      let node = CreateBinaryNode(value)
      let parent = this._root[0]
      await this.VisitNode(parent)
      let current = this._compare(node, parent) > 0 ? parent.right[0] : parent.left[0]
      while (current) {
        node.level++
        parent = current
        await this.VisitNode(parent)
        current = this._compare(node, parent) > 0 ? parent.right[0] : parent.left[0]
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

  private async SearchAt(node: ObservableBinaryNode<T>, value: T) {
    await this.VisitNode(node)
    let result = this._valueCompare(value, node.value)
    if (result > 0) {
      if (node.right.length > 0) {
        await this.SearchAt(node.right[0], value)
      }
    } else if (result < 0) {
      if (node.left.length > 0) {
        await this.SearchAt(node.left[0], value)
      }
    } else {
      this.State(ObservableState.Selected, node)
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

  private async PreorderInterval(node: ObservableBinaryNode<T>) {
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

  private async PostorderInterval(node: ObservableBinaryNode<T>) {
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

  private async InorderInterval(node: ObservableBinaryNode<T>) {
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

  private InstantSearchAt(node: ObservableBinaryNode<T>, parentNode: ObservableBinaryNode<T> | null, value: T): { node: ObservableBinaryNode<T>, parentNode: ObservableBinaryNode<T> | null } | null {
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

  private async SpliceNode(parentNode: ObservableBinaryNode<T> | null, node: ObservableBinaryNode<T>, ...newNodes: Array<ObservableBinaryNode<T>>) {
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
      await this.VisitNode(result.node, ObservableState.Selected)
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
        this.State(ObservableState.Swapping, node, successor)
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
        this.State(ObservableState.Swapping, node, branchNode)
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
