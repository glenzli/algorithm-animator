<template>
  <div>
    <array-visualizer :array="array" :state="state"></array-visualizer>
    <array-visualizer :array="auxArray" :state="auxState" :y="100"></array-visualizer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Mixins } from 'vue-property-decorator'
import { ArrayVisualizer } from '../components'
import { ObservableArrayItem, ObservableArrayState, ObservableArray, $olink, Sleep, ObservableState } from '../model'
import { NumericArrayAlgorithmMixin } from './NumericArrayAlgorithm'

@Component({
  components: { ArrayVisualizer },
})
export default class Quicksort extends Mixins(NumericArrayAlgorithmMixin) {
  array: Array<ObservableArrayItem<number>> = []
  state: ObservableArrayState = { partition: [0, 0] }
  auxArray: Array<ObservableArrayItem<number>> = []
  auxState: ObservableArrayState = { locators: [0], partition: [0, 0] }

  async Merge(array: ObservableArray<number>, from: number, to: number, mid: number, auxArray: ObservableArray<number>) {
    auxArray.Fill(to - from + 1, Number.NaN)
    let partition = mid - from + 1
    this.auxState.locators = [0, partition]
    await Sleep(this.delay)
    for (let i = 0; i <= to - from; ++i) {
      auxArray.Set(i, array.Get(i + from)!)
      array.Set(i + from, Number.NaN)
    }
    array.Restore()
    await Sleep(this.delay)
    for (let i = 0; i <= to - from; ++i) {
      let [index1, index2] = this.auxState.locators!
      let val1 = auxArray.Get(index1 < partition ? index1 : -1)
      let val2 = auxArray.Get(index2)
      if (val2 == null || (val1 != null && val1! < val2!)) {
        array.Set(i + from, val1!)
        auxArray.State(ObservableState.Selected, index1)
        Vue.set(this.auxState.locators!, 0, index1 + 1 < partition ? (index1 + 1) : auxArray.length)
      } else {
        array.Set(i + from, val2)
        auxArray.State(ObservableState.Selected, index2)
        Vue.set(this.auxState.locators!, 1, index2 + 1)
      }
      await Sleep(this.delay)
    }
    auxArray.Empty()
    await Sleep(this.delay)
  }

  async RunMergesort(array: ObservableArray<number>, from: number, to: number, auxArray: ObservableArray<number>) {
    array.PartialRestore(ObservableState.Accessed)
    if (to - from > 1) {
      let mid = Math.floor((to - from) / 2 + from)
      this.state.partition = [0, 0]
      await this.RunMergesort(array, from, mid, auxArray)
      await this.RunMergesort(array, mid + 1, to, auxArray)
      this.state.partition = to - from < array.length - 1 ? [from, to] : [0, 0]
      await this.Merge(array, from, to, mid, auxArray)
    } else {
      if (to > from && array.Get(from, ObservableState.Accessed)! > array.Get(to, ObservableState.Accessed)!) {
        await array.Swap(from, to, this.delay)
      } else {
        array.State(ObservableState.Accessed, from)
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
    this.array = this.data.length > 0 ? ObservableArray.From(this.data) : ObservableArray.Numeric(30)
    this.auxArray = ObservableArray.From([])
    this.Run()
  }
}
</script>