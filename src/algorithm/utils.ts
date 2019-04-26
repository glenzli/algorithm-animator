import Vue from 'vue'
import { Arrayex } from 'arrayex'
import { ObservableArray, CreateObservableArrayItem } from '../model'

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

export async function Insert<T>(array: ObservableArray<T>, value: T, emptyValue: T, to: number, delay = 1000) {
  array.observables.splice(to, 0, CreateObservableArrayItem(emptyValue))
  array.Get(to) // highlight the empty value
  array.Raise(to)
  await Sleep(delay)
  array.Set(to, value)
  await Sleep(delay)
  array.ResetState()
  array.ResetRaise()
}

export async function Move<T>(array: ObservableArray<T>, from: number, to: number, delay = 1000) {
  if (from !== to) {
    array.ResetState()
    array.Get(from)
    array.Get(to)
    array.Raise(from, to)
    await Sleep(delay)
    array.observables.splice(to, 0, array.observables.splice(from, 1)[0])
    await Sleep(delay)
    array.ResetState()
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
