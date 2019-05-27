import Vue from 'vue'
import { $olink } from './ObjectLink'
import { Arrayex } from 'arrayex'
import { Sleep } from './utils'

export enum HeapNodeState {
  None = 0,
  Accessed,
  Selected,
  Swapping,
}

export interface HeapNode<T> {
  value: T,
  state: number,
}

function CreateHeapNode<T>(value: T) {
  return { value, state: HeapNodeState.None } as HeapNode<T>
}

export interface HeapState {
  count: number,
}

export class Heap<T> {
  private _heap: Array<HeapNode<T>>
  private _state: HeapState
  private _compare: (n1: HeapNode<T>, n2: HeapNode<T>) => number
  private _isNull: (val: T) => boolean
  private _continue: () => Promise<any>
  private _nullValue: T
  private _delay: number
  private _pointTo: (pointer: number) => void = () => {}

  private CalcHeapCapacity(n: number) {
    let level = Math.ceil(Math.log2(n + 1))
    return Math.pow(2, level)
  }

  constructor(array: Array<T> = [], state: HeapState, nullValue: T, compare: (val1: T, val2: T) => number, isNull?: (val: T) => boolean, continuing?: () => Promise<any>) {
    this._nullValue = nullValue
    this._heap = Arrayex.Create(this.CalcHeapCapacity(array.length), index => {
      return CreateHeapNode((index > 0 && index <= array.length) ? array[index - 1] : nullValue)
    })
    this._heap.id = $olink.New(this)
    this._state = state
    this._state.count = array.length
    this._compare = (n1: HeapNode<T>, n2: HeapNode<T>) => compare(n1.value, n2.value)
    this._isNull = isNull || ((val: T) => val === nullValue)
    this._continue = continuing || (() => new Promise(resolve => resolve()))
    this._delay = 0
  }

  static Numeric(n: number, range = [0, 50], state: HeapState, continuing?: () => Promise<any>) {
    let data = Arrayex.Create(n, () => Math.round((range[1] - range[0]) * Math.random() + range[0]))
    return new Heap(data, state, Number.NaN, (n1, n2) => n1 - n2, Number.isNaN, continuing).data
  }

  static FromNumeric(data: Array<number>, state: HeapState, continuing?: () => Promise<any>) {
    return new Heap(data, state, Number.NaN, (n1, n2) => n1 - n2, Number.isNaN, continuing).data
  }

  get pointTo() {
    return this._pointTo
  }

  set pointTo(value: (pointer: number) => void) {
    this._pointTo = value
  }

  get data() {
    return this._heap
  }

  get delay() {
    return this._delay
  }

  set delay(value: number) {
    this._delay = value
  }

  private Left(index: number) {
    return 2 * index
  }

  private NextSibling(index: number) {
    return index + 1
  }

  private Parent(index: number) {
    return Math.floor(index / 2)
  }

  private Alter(alter: (item: HeapNode<T>) => void, ...indexes: Array<number>) {
    indexes.forEach(index => {
      let item = this._heap[index]
      if (item && !this._isNull(item.value)) {
        alter(item)
      }
    })
  }

  Peek() {
    return this.Get(0)
  }

  Get(index: number, state?: number) {
    let node = this._heap[index + 1]
    if (node) {
      if (state != null) {
        node.state = state
      }
      return node.value
    }
    return undefined
  }

  Set(index: number, value: T, state?: number) {
    let node = this._heap[index + 1]
    if (node) {
      node.value = value
      if (state != null) {
        node.state = state
      }
    }
  }

  Raw(index: number) {
    return this._heap[index + 1]
  }

  State(state: number, ...indexes: Array<number>) {
    this.Alter(item => { item.state = state }, ...indexes)
  }

  Restore() {
    for (let i = 1; i <= this._state.count; ++i) {
      this._heap[i].state = HeapNodeState.None
    }
  }

  PartialRestore(state: number) {
    for (let i = 1; i <= this._state.count; ++i) {
      if (this._heap[i].state === state) {
        this._heap[i].state = HeapNodeState.None
      }
    }
  }

  async Swap(from: number, to: number, restoreState = HeapNodeState.Accessed) {
    if (from !== to) {
      let temp = this._heap[from]
      // state
      this.State(HeapNodeState.Swapping, from, to)
      await Sleep(this._delay)
      await this._continue()
      Vue.set(this._heap, from, this._heap[to])
      Vue.set(this._heap, to, temp)
      await Sleep(this._delay)
      await this._continue()
      // clear state
      this.State(restoreState, from, to)
    }
  }

  InstantBuildHeap() {
    for (let i = this._heap.length / 2; i > 0; --i) {
      let descendant = this.Left(i)
      while (descendant <= this._state.count) {
        let parent = this.Parent(descendant)
        let sibling = this.NextSibling(descendant)
        if (descendant < this._state.count && this._compare(this._heap[descendant], this._heap[sibling]) < 0) {
          descendant = sibling
        }
        if (this._compare(this._heap[descendant], this._heap[parent]) > 0) {
          let temp = this._heap[descendant]
          Vue.set(this._heap, descendant, this._heap[parent])
          Vue.set(this._heap, parent, temp)
          descendant = this.Left(descendant)
        } else {
          break
        }
      }
    }
  }

  private static DownPseudoCode(i: string, indent = '') {
    const code = `
d ← 2 * ${i}
{while} l ≤ count:
  p ← ⌊d / 2⌋
  r ← d + 1
  {if} r ≤ count {and} heap[d] < heap[r]:
    d ← s
  {if} heap[d] > heap[p]:
    {swap}(d, p)
    d ← d * 2
  {else}:
    {break}
`
    return code.split('\n').filter(c => !!c).map((c, i) => `${i > 0 ? indent : ''}${c}`).join('\n')
  }

  private async Down(start: number, pointerOffset = 0) {
    this.pointTo(pointerOffset)
    let descendant = this.Left(start)
    await Sleep(this._delay)
    while (descendant <= this._state.count) {
      this.pointTo(pointerOffset + 1)
      await Sleep(this._delay)
      this.pointTo(pointerOffset + 2)
      await Sleep(this._delay)
      let parent = this.Parent(descendant)
      this.pointTo(pointerOffset + 3)
      await Sleep(this._delay)
      let sibling = this.NextSibling(descendant)
      this.State(HeapNodeState.Accessed, descendant, sibling)
      this.pointTo(pointerOffset + 4)
      await Sleep(this._delay)
      await this._continue()
      if (descendant < this._state.count && this._compare(this._heap[descendant], this._heap[sibling]) < 0) {
        this.pointTo(pointerOffset + 5)
        this.State(HeapNodeState.None, descendant)
        descendant = sibling
      } else {
        this.State(HeapNodeState.None, sibling)
      }
      await Sleep(this._delay)
      await this._continue()
      this.State(HeapNodeState.Accessed, parent)
      this.pointTo(pointerOffset + 6)
      if (this._compare(this._heap[descendant], this._heap[parent]) > 0) {
        await Sleep(this._delay)
        this.pointTo(pointerOffset + 7)
        await this.Swap(descendant, parent)
        await this._continue()
        this.pointTo(pointerOffset + 8)
        descendant = this.Left(descendant)
      } else {
        this.pointTo(pointerOffset + 10)
        break
      }
      this.State(HeapNodeState.None, parent)
      await Sleep(this._delay)
    }
  }

  static get buildPseudoCode() {
    return `
{maxHeapify} ():
  {for} i ∈ [capacity / 2, 0]:
    ${this.DownPseudoCode('i', '    ')}
    `
  }

  async BuildHeap() {
    for (let i = this._heap.length / 2; i > 0; --i) {
      this.pointTo(0)
      await Sleep(this._delay)
      await this.Down(i, 1)
      await Sleep(this._delay)
      await this._continue()
      this.Restore()
    }
  }

  static get insertPseudoCode() {
    return `
{insert} (v):
  {ensureCapacity}(count + 1)
  d ← ++count
  heap[d] ← v
  p ← ⌊d / 2⌋
  {while} d > 1 {and} heap[d] > heap[p]:
    swap(d, p)
    d ← count
    p ← ⌊d / 2⌋
`
  }

  async Insert(value: T) {
    this.pointTo(0)
    await Sleep(this._delay)
    if (this._state.count + 1 >= this._heap.length) {
      let increase = this.CalcHeapCapacity(this._heap.length + 1) - this._heap.length
      this._heap.splice(this._heap.length, 0, ...Arrayex.Create(increase, () => CreateHeapNode(this._nullValue)))
    }
    this.pointTo(1)
    await Sleep(this._delay)
    let descendant = ++this._state.count
    this.pointTo(2)
    this._heap[descendant].value = value
    this.State(HeapNodeState.Accessed, descendant)
    await Sleep(this._delay)
    await this._continue()
    this.pointTo(3)
    await Sleep(this._delay)
    let parent = Math.floor(descendant / 2)
    this.State(HeapNodeState.Accessed, parent)
    while (descendant > 1 && this._compare(this._heap[descendant], this._heap[parent]) > 0) {
      this.pointTo(4)
      await Sleep(this._delay)
      this.pointTo(5)
      await this.Swap(descendant, parent)
      await this._continue()
      this.pointTo(6)
      await Sleep(this._delay)
      descendant = Math.floor(descendant / 2)
      this.pointTo(7)
      await Sleep(this._delay)
      parent = Math.floor(descendant / 2)
    }
    this.Restore()
  }

  static get deletePseudoCode() {
    return `
{deleteMax} ():
  maximum ← heap[1]
  {swap}(1, count)
  {delete} heap[count--]
  ${this.DownPseudoCode('1', '    ')}
  {return} maximum
    `
  }

  async Delete() {
    // cache
    this.pointTo(0)
    let retValue = this._heap[1].value
    await Sleep(this._delay)
    // swap
    this.State(HeapNodeState.Accessed, this._state.count, 1)
    this.pointTo(1)
    await this.Swap(1, this._state.count)
    this.pointTo(2)
    await Sleep(this._delay)
    await this._continue()
    this._heap[this._state.count].value = this._nullValue
    --this._state.count
    await Sleep(this._delay)
    await this._continue()
    // down
    await this.Down(1, 3)
    this.Restore()
    return retValue
  }
}
