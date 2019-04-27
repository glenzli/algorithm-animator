import Vue from 'vue'
import { $olink } from './ObjectLink'
import { Arrayex } from 'arrayex'
import { Sleep, ObservableState } from './utils'

export interface ObservableBinaryHeapNode<T> {
  value: T,
  state: number,
}

function CreateHeapNode<T>(value: T) {
  return { value, state: ObservableState.None } as ObservableBinaryHeapNode<T>
}

export interface ObservableBinaryHeapState {
  count: number,
}

export class ObservableBinaryHeap<T> {
  private _heap: Array<ObservableBinaryHeapNode<T>>
  private _state: ObservableBinaryHeapState
  private _compare: (n1: ObservableBinaryHeapNode<T>, n2: ObservableBinaryHeapNode<T>) => number
  private _isNull: (val: T) => boolean
  private _continue: () => Promise<any>
  private _nullValue: T

  private CalcHeapCapacity(n: number) {
    let level = Math.ceil(Math.log2(n + 1))
    return Math.pow(2, level)
  }

  constructor(array: Array<T> = [], state: ObservableBinaryHeapState, nullValue: T, compare: (val1: T, val2: T) => number, isNull?: (val: T) => boolean, continuing?: () => Promise<any>) {
    this._nullValue = nullValue
    this._heap = Arrayex.Create(this.CalcHeapCapacity(array.length), index => {
      return CreateHeapNode((index > 0 && index <= array.length) ? array[index - 1] : nullValue)
    })
    this._heap.id = $olink.New(this)
    this._state = state
    this._state.count = array.length
    this._compare = (n1: ObservableBinaryHeapNode<T>, n2: ObservableBinaryHeapNode<T>) => compare(n1.value, n2.value)
    this._isNull = isNull || ((val: T) => val === nullValue)
    this._continue = continuing || (() => new Promise(resolve => resolve()))
  }

  static Numeric(n: number, range = [0, 50], state: ObservableBinaryHeapState, continuing?: () => Promise<any>) {
    let data = Arrayex.Create(n, () => Math.round((range[1] - range[0]) * Math.random() + range[0]))
    return new ObservableBinaryHeap(data, state, Number.NaN, (n1, n2) => n1 - n2, Number.isNaN, continuing).data
  }

  static FromNumeric(data: Array<number>, state: ObservableBinaryHeapState, continuing?: () => Promise<any>) {
    return new ObservableBinaryHeap(data, state, Number.NaN, (n1, n2) => n1 - n2, Number.isNaN, continuing).data
  }

  get data() {
    return this._heap
  }

  private Left(index: number) {
    return 2 * index
  }

  private Right(index: number) {
    return 2 * index + 1
  }

  private NextSibling(index: number) {
    return index + 1
  }

  private Parent(index: number) {
    return Math.floor(index / 2)
  }

  private Alter(alter: (item: ObservableBinaryHeapNode<T>) => void, ...indexes: Array<number>) {
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

  Get(index: number, state?: ObservableState) {
    let node = this._heap[index + 1]
    if (node) {
      if (state != null) {
        node.state = state
      }
      return node.value
    }
    return undefined
  }

  Set(index: number, value: T, state?: ObservableState) {
    let node = this._heap[index + 1]
    if (node) {
      node.value = value
      if (state != null) {
        node.state = state
      }
    }
  }

  Raw(index: number) {
    return this._heap[index]
  }

  State(state: number, ...indexes: Array<number>) {
    this.Alter(item => { item.state = state }, ...indexes)
  }

  Restore() {
    for (let i = 1; i <= this._state.count; ++i) {
      this._heap[i].state = ObservableState.None
    }
  }

  PartialRestore(state: number) {
    for (let i = 1; i <= this._state.count; ++i) {
      if (this._heap[i].state === state) {
        this._heap[i].state = ObservableState.None
      }
    }
  }

  async Swap(from: number, to: number, delay: number, restoreState = ObservableState.Accessed) {
    if (from !== to) {
      let temp = this._heap[from]
      // state
      this.State(ObservableState.Swapping, from, to)
      await Sleep(delay)
      await this._continue()
      Vue.set(this._heap, from, this._heap[to])
      Vue.set(this._heap, to, temp)
      await Sleep(delay)
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

  private async Down(start: number, delay: number) {
    let descendant = this.Left(start)
    while (descendant <= this._state.count) {
      let parent = this.Parent(descendant)
      let sibling = this.NextSibling(descendant)
      this.State(ObservableState.Accessed, descendant, sibling)
      await Sleep(delay)
      await this._continue()
      if (descendant < this._state.count && this._compare(this._heap[descendant], this._heap[sibling]) < 0) {
        this.State(ObservableState.None, descendant)
        descendant = sibling
      } else {
        this.State(ObservableState.None, sibling)
      }
      await Sleep(delay)
      await this._continue()
      this.State(ObservableState.Accessed, parent)
      if (this._compare(this._heap[descendant], this._heap[parent]) > 0) {
        await this.Swap(descendant, parent, delay)
        await this._continue()
        descendant = this.Left(descendant)
      } else {
        break
      }
      this.State(ObservableState.None, parent)
    }
  }

  async BuildHeap(delay: number) {
    for (let i = this._heap.length / 2; i > 0; --i) {
      await this.Down(i, delay)
      await Sleep(delay)
      await this._continue()
      this.Restore()
    }
  }

  async Insert(value: T, delay: number) {
    if (this._state.count + 1 >= this._heap.length) {
      let increase = this.CalcHeapCapacity(this._heap.length + 1) - this._heap.length
      this._heap.splice(this._heap.length, 0, ...Arrayex.Create(increase, () => CreateHeapNode(this._nullValue)))
    }
    let descendant = ++this._state.count
    this._heap[descendant].value = value
    this.State(ObservableState.Accessed, descendant)
    await Sleep(delay)
    await this._continue()
    let parent = Math.floor(descendant / 2)
    this.State(ObservableState.Accessed, parent)
    while (descendant > 1 && this._compare(this._heap[descendant], this._heap[parent]) > 0) {
      await this.Swap(descendant, parent, delay)
      await this._continue()
      descendant = Math.floor(descendant / 2)
      parent = Math.floor(descendant / 2)
    }
    this.Restore()
  }

  async Delete(delay: number) {
    // cache
    let retValue = this._heap[1].value
    // swap
    this.State(ObservableState.Accessed, this._state.count, 1)
    await this.Swap(1, this._state.count, delay)
    await Sleep(delay)
    await this._continue()
    this._heap[this._state.count].value = this._nullValue
    --this._state.count
    await Sleep(delay)
    await this._continue()
    // down
    await this.Down(1, delay)
    this.Restore()
    return retValue
  }
}
