import Vue from 'vue'
import { $olink } from './ObjectLink'
import { Arrayex } from 'arrayex'
import { Sleep } from './utils'

export interface ObservableArrayItem<T> {
  value: T,
  state: number,
}

export enum ObservableState {
  None = 0,
  Accessed,
  Selected,
  Emphasized,
}

export function CreateObservableArrayItem<T>(value: T) {
  return { value, state: 0 } as ObservableArrayItem<T>
}

declare global {
  interface Array<T> {
    id: number
  }
}

export class ObservableArray<T> {
  _array: Array<ObservableArrayItem<T>>

  constructor(array: Array<T> = []) {
    this._array = array.map(value => CreateObservableArrayItem(value))
    this._array.id = $olink.New(this)
  }

  static Numeric(n: number, range = [0, 50]) {
    let data = Arrayex.Create(n, () => Math.round((range[1] - range[0]) * Math.random() + range[0]))
    return new ObservableArray(data).data
  }

  static From<T>(data: Array<T>) {
    return new ObservableArray(data).data
  }

  get data() {
    return this._array
  }

  get length() {
    return this._array.length
  }

  private Alter(alter: (item: ObservableArrayItem<T>) => void, ...indexes: Array<number>) {
    indexes.forEach(index => {
      let item = this._array[index]
      if (item) {
        alter(item)
      }
    })
  }

  State(state: number, ...indexes: Array<number>) {
    this.Alter(item => { item.state = state }, ...indexes)
  }

  Restore() {
    this._array.forEach(item => { item.state = ObservableState.None })
  }

  PartialRestore(state: number) {
    this._array.forEach(item => {
      if (item.state === state) {
        item.state = ObservableState.None
      }
    })
  }

  Raw(index: number) {
    return this._array[index]
  }

  Get(index: number, state?: number) {
    let item = this._array[index]
    if (item) {
      if (state != null) {
        item.state = state
      }
      return item.value
    }
    return undefined
  }

  Set(index: number, value: T, state?: number) {
    let item = this._array[index]
    if (item) {
      if (state != null) {
        item.state = state
      }
      item.value = value
    }
  }

  Empty() {
    this._array.splice(0, this._array.length)
  }

  Fill(n: number, value: T) {
    this._array.splice(0, this._array.length, ...Arrayex.Create(n, () => CreateObservableArrayItem(value)))
  }

  async Swap(from: number, to: number, delay: number, restoreState = ObservableState.Accessed) {
    if (from !== to) {
      let temp = this._array[from]
      // state
      this.State(ObservableState.Emphasized, from, to)
      await Sleep(delay)
      Vue.set(this._array, from, this._array[to])
      Vue.set(this._array, to, temp)
      await Sleep(delay)
      // clear state
      this.State(restoreState, from, to)
    }
  }

  async Move(from: number, to: number, delay: number) {
    if (from !== to) {
      this.State(ObservableState.Emphasized, from, to)
      await Sleep(delay)
      this._array.splice(to, 0, this._array.splice(from, 1)[0])
      await Sleep(delay)
      this.State(ObservableState.None, to, to + 1)
    }
  }
}

export interface ObservableArrayState {
  pointers?: Array<number>,
  seperation?: Array<number>,
}
