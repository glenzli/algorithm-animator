import Vue from 'vue'
import { Interact } from '../Interact'
import { AbstractData, ADT } from './ADT'
import { ActiveState, ValueItem } from './Defs'

export interface ArrayData<T> extends AbstractData {
  array: Array<ValueItem<T>>,
  partition: Array<number>,
  seperators: Array<number>,
}

export class ArrayADT<T> extends ADT<ArrayData<T>> {
  private _compare: (val1: T, val2: T) => number

  constructor(compare?: (val1: T, val2: T) => number) {
    super({ array: [], partition: [0, -1], seperators: [], id: -1 })
    this._compare = compare || ((val1: T, val2: T) => val1 > val2 ? 1 : (val1 < val2 ? -1 : 0))
  }

  get length() {
    return this._data.array.length
  }

  private State(state: ActiveState, ...indexes: Array<number>) {
    indexes.forEach(index => this._data.array[index].action = state)
  }

  private WeakState(state: ActiveState, ...indexes: Array<number>) {
    let weakIndexes = indexes.filter(index => this._data.array[index].action === ActiveState.None)
    weakIndexes.forEach(index => this._data.array[index].action = state)
    return weakIndexes
  }

  Restore() {
    this._data.array.forEach(item => item.action = ActiveState.None)
  }

  Partition(from?: number, to?: number) {
    if (from !== undefined) {
      to = to !== undefined ? to : this._data.array.length - 1
      this._data.partition = [from, to]
    } else {
      this._data.partition = [0, -1]
    }
  }

  Replace(array: Array<T>) {
    this._data.array.splice(0, this._data.array.length, ...array.map(val => ({ value: val, action: ActiveState.None })))
  }

  async Get(index: number) {
    this.State(ActiveState.Peeked, index)
    await Interact.Doze()
    return this._data.array[index]
  }

  async Set(index: number, value: T) {
    this._data.array[index].value = value
    this.State(ActiveState.Updated, index)
    await Interact.Doze()
  }

  async Select(index: number) {
    this.State(ActiveState.Selected, index)
    await Interact.Doze()
  }

  RestoreAt(index: number) {
    this.State(ActiveState.None, index)
  }

  async Swap(from: number, to: number) {
    if (from !== to) {
      let temp = this._data.array[from].value
      this.State(ActiveState.Swapping, from, to)
      await Interact.Doze()
      this._data.array[from].value = this._data.array[to].value
      this._data.array[to].value = temp
      await Interact.Doze()
      this.State(ActiveState.None, from, to)
    }
  }

  async Move(from: number, to: number) {
    if (from !== to) {
      this.State(ActiveState.Moving, from)
      this.State(ActiveState.MovingTo, to)
      await Interact.Doze()
      this._data.array.splice(to, 0, this._data.array.splice(from, 1)[0])
      await Interact.Doze()
      this.State(ActiveState.None, to, to + 1)
    }
  }

  async Compare(first: number, second: number) {
    let indexes = this.WeakState(ActiveState.Peeked, first, second)
    await Interact.Doze()
    let result = this._compare(this._data.array[first].value, this._data.array[second].value)
    this.State(ActiveState.None, ...indexes)
    return result
  }
}
