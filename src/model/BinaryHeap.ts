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

export class ObservableBinaryHeap<T> {
  _heap: Array<ObservableBinaryHeapNode<T>>
  _count: number
  _compare: (n1: ObservableBinaryHeapNode<T>, n2: ObservableBinaryHeapNode<T>) => number
  _isNull: (val: T) => boolean

  private CalcHeapCapacity(n: number) {
    let level = Math.ceil(Math.log2(n + 1))
    return Math.pow(2, level)
  }

  constructor(array: Array<T> = [], nullValue: T, compare: (val1: T, val2: T) => number, isNull?: (val: T) => boolean) {
    this._heap = Arrayex.Create(this.CalcHeapCapacity(array.length), index => {
      return CreateHeapNode((index > 0 && index <= array.length) ? array[index - 1] : nullValue)
    })
    this._count = array.length
    this._compare = (n1: ObservableBinaryHeapNode<T>, n2: ObservableBinaryHeapNode<T>) => compare(n1.value, n2.value)
    this._isNull = isNull || ((val: T) => val === nullValue)
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

  State(state: number, ...indexes: Array<number>) {
    this.Alter(item => { item.state = state }, ...indexes)
  }

  Restore() {
    for (let i = 1; i < this._count; ++i) {
      this._heap[i].state = ObservableState.None
    }
  }

  PartialRestore(state: number) {
    for (let i = 1; i < this._count; ++i) {
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
      Vue.set(this._heap, from, this._heap[to])
      Vue.set(this._heap, to, temp)
      await Sleep(delay)
      // clear state
      this.State(restoreState, from, to)
    }
  }

  async BuildHeap(delay: number) {
    for (let i = this._heap.length / 2; i > 0; --i) {
      let descendant = this.Left(i)
      while (descendant <= this._count) {
        let parent = this.Parent(descendant)
        let sibling = this.NextSibling(descendant)
        this.State(ObservableState.Accessed, descendant, sibling, parent)
        await Sleep(delay)
        if (descendant < this._count && this._compare(this._heap[descendant], this._heap[sibling]) < 0) {
          this.State(ObservableState.None, descendant)
          descendant = sibling
        }
        if (this._compare(this._heap[descendant], this._heap[parent]) > 0) {
          await this.Swap(descendant, parent, delay)
          descendant = this.Left(descendant)
        } else {
          break
        }
      }
      await Sleep(delay)
      this.Restore()
    }
  }
}
