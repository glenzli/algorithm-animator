import Vue from 'vue'
import { Interact } from '../Interact'
import { AbstractData, ADT } from './ADT'
import { UniqueAction, ValueItem, UniqueState, UniqueAttribute } from './Defs'

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

  private Act(action: UniqueAction, ...indexes: Array<number>) {
    let origins = indexes.map(index => this._data.array[index].action)
    indexes.forEach(index => this._data.array[index].action = action)
    return () => { indexes.forEach((idx, i) => this._data.array[idx].action = origins[i]) }
  }

  Restore() {
    this._data.array.forEach(item => {
      item.action = UniqueAction.None
      item.state = UniqueState.None
      item.attribute = UniqueAttribute.None
    })
  }

  Partition(from: number, to?: number) {
    to = to !== undefined ? to : this._data.array.length - 1
    this._data.partition = [from, to]
  }

  Seperate(index: number, seperatorIndex = 0) {
    Vue.set(this._data.seperators, seperatorIndex, index)
  }

  get seperators() {
    return this._data.seperators
  }

  Reset(clear = false) {
    this.Restore()
    this._data.partition = [0, -1]
    this._data.seperators = []
    if (clear) {
      this._data.array.splice(0)
    }
  }

  Replace(array: Array<T | null>) {
    this._data.array.splice(0, this._data.array.length, ...array.map(val => ({ value: val, action: UniqueAction.None, state: UniqueState.None, attribute: UniqueAttribute.None })))
  }

  Slice(start: number, end: number, erase = false) {
    let slice = this._data.array.slice(start, end).map(item => item.value)
    if (erase) {
      for (let i = start; i < end; ++i) {
        this._data.array[i].value = null
      }
    }
    return slice
  }

  async Get(index: number, erase = false) {
    this.Act(UniqueAction.Peek, index)
    await Interact.Doze()
    let result = this._data.array[index].value
    if (erase) {
      this._data.array[index].value = null
      this._data.array[index].action = UniqueAction.None
    }
    return result
  }

  async Set(index: number, value: T | null) {
    this._data.array[index].value = value
    this.Act(UniqueAction.Update, index)
    await Interact.Doze()
  }

  Select(index: number) {
    this.Act(UniqueAction.Select, index)
  }

  State(state: UniqueState, ...indexes: Array<number>) {
    indexes.forEach(index => { this._data.array[index].state = state })
  }

  Attribute(attribute: UniqueAttribute, ...indexes: Array<number>) {
    indexes.forEach(index => { this._data.array[index].attribute = attribute })
  }

  RestoreAt(index: number) {
    this.Act(UniqueAction.None, index)
  }

  async Swap(from: number, to: number) {
    if (from !== to) {
      let temp = this._data.array[from]
      this.Act(UniqueAction.Swap, from, to)
      await Interact.Doze()
      Vue.set(this._data.array, from, this._data.array[to])
      Vue.set(this._data.array, to, temp)
      await Interact.Doze()
      this.Act(UniqueAction.None, from, to)
    }
  }

  async Move(from: number, to: number) {
    if (from !== to) {
      this.Act(UniqueAction.Move, from)
      this.Act(UniqueAction.Target, to)
      await Interact.Doze()
      this._data.array.splice(to, 0, this._data.array.splice(from, 1)[0])
      await Interact.Doze()
      this.Act(UniqueAction.None, to, to + 1)
    }
  }

  async SparseMove(from: number, to: number, space: number) {
    if (from !== to) {
      this.Act(UniqueAction.Move, from)
      this.Act(UniqueAction.Target, to)
      await Interact.Doze()
      space = Math.abs(space) * Math.sign(to - from)
      let moving = this._data.array[from].value
      for (let i = from; i !== to; i += space) {
        this._data.array[i].value = this._data.array[i + space].value
      }
      this._data.array[to].value = moving
      await Interact.Doze()
      this.Act(UniqueAction.None, from, to)
    }
  }

  async Compare(first: number, second: number) {
    let restore = this.Act(UniqueAction.Peek, first, second)
    await Interact.Doze()
    let result = this._compare(this._data.array[first].value!, this._data.array[second].value!)
    restore()
    return result
  }
}
