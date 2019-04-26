<template>
  <div>
    <array-visualizer :array="array" :state="state"></array-visualizer>
    <array-visualizer :array="auxArray" :state="auxState" :yBase="100"></array-visualizer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Mixins } from 'vue-property-decorator'
import { ArrayVisualizer } from '../components'
import { ObservableArrayItem, ObservableArrayState, ObservableArray, $olink } from '../model'
import { Sleep, Swap, CreateNumericData, WrapData } from './utils'
import { NumericArrayAlgorithmMixin } from './NumericArrayAlgorithm'

@Component({
  components: { ArrayVisualizer },
})
export default class Quicksort extends Mixins(NumericArrayAlgorithmMixin) {
  array: Array<ObservableArrayItem<number>> = []
  state: ObservableArrayState = { seperation: [0, 0] }
  auxArray: Array<ObservableArrayItem<number>> = []
  auxState: ObservableArrayState = { pointers: [0], seperation: [0, 0] }

  async Merge(array: ObservableArray<number>, from: number, to: number, mid: number, auxArray: ObservableArray<number>) {
    auxArray.Fill(to - from + 1, Number.NaN)
    await Sleep(this.delay)
    for (let i = 0; i <= to - from; ++i) {
      auxArray.Set(i, array.Get(i + from)! as number)
      array.Set(i + from, Number.NaN)
    }
    array.ResetState()
    await Sleep(this.delay)
    let seperation = mid - from + 1
    this.auxState.pointers = [0, seperation]
    for (let i = 0; i <= to - from; ++i) {
      let index1 = this.auxState.pointers![0]
      let val1 = auxArray.Get(index1 < seperation ? index1 : -1) as number
      let val2 = auxArray.Get(this.auxState.pointers![1]) as number
      if ((val1 != null && val1 < val2) || val2 == null) {
        array.Set(i + from, val1)
        auxArray.Mark(index1)
        Vue.set(this.auxState.pointers!, 0, index1 + 1)
      } else {
        array.Set(i + from, val2)
        auxArray.Mark(this.auxState.pointers![1])
        Vue.set(this.auxState.pointers!, 1, this.auxState.pointers![1] + 1)
      }
      await Sleep(this.delay)
    }
    auxArray.Clear()
    await Sleep(this.delay)
  }

  async RunMergesort(array: ObservableArray<number>, from: number, to: number, auxArray: ObservableArray<number>) {
    array.ResetState()
    if (to - from > 1) {
      let mid = Math.floor((to - from) / 2 + from)
      this.state.seperation = [0, 0]
      await this.RunMergesort(array, from, mid, auxArray)
      await this.RunMergesort(array, mid + 1, to, auxArray)
      this.state.seperation = to - from < array.length - 1 ? [from, to] : [0, 0]
      await this.Merge(array, from, to, mid, auxArray)
    } else {
      if (to > from && (array.Get(from) as number) > (array.Get(to) as number)) {
        await Swap(array, from, to, this.delay)
      } else {
        array.Get(from)
        await Sleep(this.delay)
      }
    }
  }

  Run() {
    let observer = $olink.Get<ObservableArray<any>>(this.array.id)!
    let auxObserver = $olink.Get<ObservableArray<any>>(this.auxArray.id)!
    this.RunMergesort(observer, 0, observer.length - 1, auxObserver)
  }

  mounted() {
    this.array = this.data.length > 0 ? WrapData(this.data) : CreateNumericData(30)
    this.auxArray = WrapData([])
    this.Run()
  }
}
</script>