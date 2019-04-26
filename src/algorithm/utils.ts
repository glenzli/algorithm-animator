import Vue from 'vue'
import { Arrayex } from 'arrayex'
import { ObservableArray } from '../model'

export function Sleep(time: number) {
  return new Promise(resolve => setTimeout(resolve, time))
}

export async function Swap<T>(array: ObservableArray<T>, from: number, to: number, delay = 1000) {
  if (from !== to) {
    let fromTemp = array.Get(from, true)
    let toTemp = array.Get(to, true)
    array.Raise(from, to)
    await Sleep(delay)
    Vue.set(array.observables, to, fromTemp)
    Vue.set(array.observables, from, toTemp)
    await Sleep(delay)
    array.ResetRaise()
  }
}

export function CreateNumericData(n: number) {
  let data = Arrayex.Create(n, () => Math.round(50 * Math.random()))
  return new ObservableArray(data).observables
}

export function WrapData<T>(data: Array<T>) {
  return new ObservableArray(data).observables
}
