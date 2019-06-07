import Vue from 'vue'
import { Interact } from '../Interact'
import { PseudoCode } from '../PseudoCode'
import { AbstractData, ADT } from './ADT'
import { UniqueAction, ValueItem, UniqueState, UniqueAttribute } from './Defs'

export interface HeapData<T> extends AbstractData {
  heap: Array<ValueItem<T>>,
  count: number,
  height: number,
}

export class HeapADT<T> extends ADT<HeapData<T>> {
  private _compare: (val1: T, val2: T) => number

  constructor(compare?: (val1: T, val2: T) => number) {
    super({ heap: [], count: 0, height: 0, id: -1 })
    this._compare = compare || ((val1: T, val2: T) => val1 > val2 ? 1 : (val1 < val2 ? -1 : 0))
  }

  get count() {
    return this._data.count
  }

  get capacity() {
    return this._data.heap.length
  }

  get height() {
    return this._data.height
  }

  get root() {
    return this._data.heap[0].value!
  }

  get last() {
    let last = this._data.heap[0].value!
    for (let i = 1; i < this._data.count; ++i) {
      if (this._compare(last, this._data.heap[i].value!) > 0) {
        last = this._data.heap[i].value!
      }
    }
    return last
  }

  private ComputeCapacity(count: number) {
    let height = Math.ceil(Math.log2(count + 1))
    return Math.pow(2, height) - 1
  }

  Replace(array: Array<T | null>, heapify = true) {
    let capacity = this.ComputeCapacity(array.length)
    let empty = capacity > array.length ? new Array(capacity - array.length).fill(null) : []
    this._data.heap.splice(0, this._data.heap.length, ...array.concat(empty).map(val => ({ value: val, action: UniqueAction.None, state: UniqueState.None, attribute: UniqueAttribute.None })))
    this._data.count = array.length
    this._data.height = Math.log2(capacity + 1)
    if (heapify) {
      this.ImmediateHeapify()
    }
  }

  private Act(action: UniqueAction, ...indexes: Array<number>) {
    let origins = indexes.map(index => this._data.heap[index].action)
    indexes.forEach(index => this._data.heap[index].action = action)
    return () => { indexes.forEach((idx, i) => this._data.heap[idx].action = origins[i]) }
  }

  async Get(index: number) {
    this.Act(UniqueAction.Peek, index)
    await Interact.Doze()
    return this._data.heap[index].value
  }

  async Set(index: number, value: T | null) {
    this._data.heap[index].value = value
    this.Act(UniqueAction.Update, index)
    await Interact.Doze()
  }

  Parent(child: number) {
    return Math.floor((child - 1) / 2)
  }

  Children(parent: number) {
    return [2 * parent + 1, 2 * parent + 2].map(node => node < this.count ? node : null)
  }

  IsLeaf(parent: number) {
    return 2 * parent + 1 >= this.count
  }

  Restore() {
    this._data.heap.forEach(item => {
      item.action = UniqueAction.None
      item.state = UniqueState.None
      item.attribute = UniqueAttribute.None
    })
  }

  async PostChild(parent: number) {
    if (!this.IsLeaf(parent)) {
      let [left, right] = this.Children(parent)
      if (right != null && await this.Compare(left!, right) < 0) {
        return right
      } else {
        return left!
      }
    }
    return null
  }

  async Compare(node1: number, node2: number) {
    let restore = this.Act(UniqueAction.Peek, node1, node2)
    await Interact.Doze()
    let result = this._compare(this._data.heap[node1].value!, this._data.heap[node2].value!)
    restore()
    return result
  }

  async SwapUp(child: number) {
    let parent = this.Parent(child)
    let parentNode = this._data.heap[parent]
    this.Act(UniqueAction.Swap, parent, child)
    await Interact.Doze()
    Vue.set(this._data.heap, parent, this._data.heap[child])
    Vue.set(this._data.heap, child, parentNode)
    await Interact.Doze()
    this.Act(UniqueAction.None, parent, child)
  }

  static get downPseudoCode() {
    return PseudoCode.Normalize(`
    down(H, i):
      while i < H.count:
        j ← H[left(i)] ≻ H[right(i)] ? left(i) : right(i)
        if H[i] ≺ H[j]:
          swap(i, j)
        i ← j

    left(i): return 2 * i + 1
    right(i): return 2 * i + 2
    `)
  }

  async Down(node: number) {
    while (!this.IsLeaf(node)) {
      PseudoCode.RunAt(1)
      this.Act(UniqueAction.Select, node)
      let child = (await this.PostChild(node))!
      this.Act(UniqueAction.Select, child)
      await Interact.Doze()
      PseudoCode.RunAt(2)
      if (await this.Compare(node, child) < 0) {
        PseudoCode.RunAt(3)
        await this.SwapUp(child)
      } else {
        this.Act(UniqueAction.None, node, child)
      }
      await PseudoCode.RunAt(4)
      node = child
    }
    this.Restore()
  }

  static get heapifyPseudoCode() {
    return PseudoCode.Normalize(`
    heapify(H):
      firstLeaf ← (H.capacity + 1) / 2 - 1
      for i ∈ (firstLeaf, 0]:
        down(H, i)
    `)
  }

  async Heapify() {
    await PseudoCode.RunAt(0)
    let firstLeaf = (this.capacity + 1) / 2 - 1
    for (let i = firstLeaf - 1; i >= 0; --i) {
      if (!this.IsLeaf(i)) {
        await PseudoCode.RunAt(1)
        PseudoCode.RunAt(2)
        await PseudoCode.SilentExecute(() => this.Down(i))
      }
    }
    this.Restore()
  }

  ImmediateHeapify() {
    let firstLeaf = (this.capacity + 1) / 2 - 1
    for (let i = firstLeaf - 1; i >= 0; --i) {
      let j = i
      while (!this.IsLeaf(j)) {
        let children = this.Children(j)
        let child = children[1]
        if (child == null || this._compare(this._data.heap[children[0]!].value!, this._data.heap[child].value!) > 0) {
          child = children[0]!
        }
        if (this._compare(this._data.heap[j].value!, this._data.heap[child].value!) < 0) {
          let temp = this._data.heap[child]
          Vue.set(this._data.heap, child, this._data.heap[j])
          Vue.set(this._data.heap, j, temp)
        }
        j = child
      }
    }
  }

  static get insertPseudoCode() {
    return PseudoCode.Normalize(`
    insert(H, v):
      ensureCapacity(↑H.count)
      d ← H.count
      H[d] ← v
      while d > 0 ⋀ heap[d] ≻ heap[parent(d)]:
        swap(d, parent(d))
        d ← parent(d)

    parent(i): ⌊(i - 1) / 2⌋
    `)
  }

  async Insert(value: T) {
    await PseudoCode.RunAt(0)
    if (++this._data.count > this.capacity) {
      let increase = this.ComputeCapacity(this.count) - this.capacity
      this._data.heap = this._data.heap.concat(new Array(increase).fill(null).map(val => ({ value: val, action: UniqueAction.None, state: UniqueState.None, attribute: UniqueAttribute.None })))
    }
    await PseudoCode.RunAt(1)
    let descendant = this.count - 1
    let parent = this.Parent(descendant)
    await PseudoCode.RunAt(2)
    await this.Set(descendant, value)
    while (descendant > 0 && await this.Compare(descendant, parent) > 0) {
      PseudoCode.RunAt(4)
      await this.SwapUp(descendant)
      await PseudoCode.RunAt(5)
      descendant = parent
      parent = this.Parent(descendant)
    }
    this.Restore()
  }

  static get deletePseudoCode() {
    return PseudoCode.Normalize(`
    delete(H):
      top ← H[0]
      H[0] ← H[--H.count]
      delete H[H.count]
      down(0)
      return top
    `)
  }

  async Delete() {
    PseudoCode.RunAt(0)
    let top = await this.Get(0)
    PseudoCode.RunAt(1)
    await this.Set(0, await this.Get(this.count - 1))
    PseudoCode.RunAt(2)
    await this.Set(--this._data.count, null)
    PseudoCode.RunAt(3)
    await PseudoCode.SilentExecute(() => this.Down(0))
    await PseudoCode.RunAt(4)
    this.Restore()
    return top
  }
}
