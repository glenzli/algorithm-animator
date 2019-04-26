import { $olink } from './ObjectLink'
import { Arrayex } from 'arrayex'

export interface ObservableArrayItem<T> {
  value: T,
  highlight: boolean,
  marked: boolean,
  raised: boolean,
}

export function CreateObservableArrayItem<T>(value: T) {
  return { value, highlight: false, marked: false, raised: false } as ObservableArrayItem<T>
}

export interface ObservableArrayState {
  pointers?: Array<number>,
  seperation?: Array<number>,
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

  get observables() {
    return this._array
  }

  get length() {
    return this._array.length
  }

  Get(index: number, raw = false) {
    let observable = this._array[index]
    if (observable) {
      observable.highlight = true
      return raw ? observable : observable.value
    }
    return undefined
  }

  Mark(index: number) {
    let observable = this._array[index]
    if (observable) {
      observable.marked = true
      return observable.value
    }
    return undefined
  }

  Raise(...indexes: Array<number>) {
    indexes.forEach(index => {
      let observable = this._array[index]
      if (observable) {
        observable.raised = true
      }
    })
  }

  Set(index: number, value: T) {
    let observable = this._array[index]
    if (observable) {
      observable.value = value
    }
  }

  ResetState() {
    this._array.forEach(observable => {
      observable.highlight = false
      observable.raised = false
    })
  }

  ResetMark() {
    this._array.forEach(observable => {
      observable.marked = false
    })
  }

  ResetRaise() {
    this._array.forEach(observable => {
      observable.raised = false
    })
  }

  Clear() {
    this._array.splice(0, this._array.length)
  }

  Fill(n: number, value: T) {
    this._array.splice(0, this._array.length, ...Arrayex.Create(n, () => CreateObservableArrayItem(value)))
  }
}
