import Vue from 'vue'
import { $olink } from './ObjectLink'
import { Arrayex } from 'arrayex'
import { Sleep } from './utils'

export enum ArrayItemState {
  None = 0,
  Accessed,
  Selected,
  Swapping,
  MovingFrom,
  MovingTo,
}

export interface ArrayItem<T> {
  value: T,
  state: number,
}

function CreateArrayItem<T>(value: T) {
  return { value, state: ArrayItemState.None } as ArrayItem<T>
}

declare global {
  interface Array<T> {
    id: number
  }
}

export class ObservableArray<T> {
  _array: Array<ArrayItem<T>>
  _continue: () => Promise<any>
  _delay: number

  constructor(array: Array<T> = [], continuing?: () => Promise<any>) {
    this._array = array.map(value => CreateArrayItem(value))
    this._array.id = $olink.New(this)
    this._continue = continuing || (() => new Promise(resolve => resolve()))
    this._delay = 0
  }

  static Numeric(n: number, range = [0, 50], continuing?: () => Promise<any>) {
    let data = Arrayex.Create(n, () => Math.round((range[1] - range[0]) * Math.random() + range[0]))
    return new ObservableArray(data, continuing).data
  }

  static From<T>(data: Array<T>, continuing?: () => Promise<any>) {
    return new ObservableArray(data, continuing).data
  }

  get delay() {
    return this._delay
  }

  set delay(value: number) {
    this._delay = value
  }

  get data() {
    return this._array
  }

  get length() {
    return this._array.length
  }

  private Alter(alter: (item: ArrayItem<T>) => void, ...indexes: Array<number>) {
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
    this._array.forEach(item => { item.state = ArrayItemState.None })
  }

  PartialRestore(state: number) {
    this._array.forEach(item => {
      if (item.state === state) {
        item.state = ArrayItemState.None
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
    this._array.splice(0, this._array.length, ...Arrayex.Create(n, () => CreateArrayItem(value)))
  }

  async Swap(from: number, to: number, restoreState = ArrayItemState.Accessed) {
    if (from !== to) {
      let temp = this._array[from]
      // state
      this.State(ArrayItemState.Swapping, from, to)
      await Sleep(this._delay)
      await this._continue()
      Vue.set(this._array, from, this._array[to])
      Vue.set(this._array, to, temp)
      await Sleep(this._delay)
      await this._continue()
      // clear state
      this.State(restoreState, from, to)
    }
  }

  async Move(from: number, to: number, restoreState = ArrayItemState.None) {
    if (from !== to) {
      this.State(ArrayItemState.MovingFrom, from)
      this.State(ArrayItemState.MovingTo, to)
      await Sleep(this._delay)
      await this._continue()
      this._array.splice(to, 0, this._array.splice(from, 1)[0])
      await Sleep(this._delay)
      await this._continue()
      this.State(restoreState, to, to + 1)
    }
  }
}

export interface ObservableArrayState {
  locators?: Array<number>,
  partition?: Array<number>,
  seperators?: Array<number>,
}
