<template>
  <div>
    <array-renderer :array="array" :state="state"></array-renderer>
    <array-renderer :array="auxArray" :state="auxState" :position="auxPosition"></array-renderer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Mixins } from 'vue-property-decorator'
import { ArrayRenderer, NODESIZE_X_PLUS } from '../../components'
import { ArrayItem, ObservableArrayState, ObservableArray, $olink, Sleep, ArrayItemState } from '../../model'
import { Point } from 'paper-vueify'
import { NumericArrayAlgorithmMixin } from './NumericArrayAlgorithm'

@Component({
  components: { ArrayRenderer },
})
export default class MergeSort extends Mixins(NumericArrayAlgorithmMixin) {
  state: ObservableArrayState = { partition: [0, 0] }
  auxArray: Array<ArrayItem<number>> = []
  auxState: ObservableArrayState = { locators: [0], partition: [0, 0], seperators: [-1] }
  auxPosition = Point(0, 100)

  async Merge(array: ObservableArray<number>, from: number, to: number, mid: number, auxArray: ObservableArray<number>) {
    this.auxPosition.x = -(this.array.length - from - to - 1) / 2 * NODESIZE_X_PLUS
    auxArray.Fill(to - from + 1, Number.NaN)
    let partition = mid - from + 1
    this.auxState.locators = [0, partition]
    Vue.set(this.auxState.seperators!, 0, mid - from)
    this.PointTo(4)
    await Sleep(this.delay)
    await this.Continue()
    for (let i = 0; i <= to - from; ++i) {
      auxArray.Set(i, array.Get(i + from)!)
      array.Set(i + from, Number.NaN)
    }
    array.Restore()
    this.PointTo(5)
    await Sleep(this.delay)
    await this.Continue()
    this.PointTo(6)
    await Sleep(this.delay)
    for (let i = 0; i <= to - from; ++i) {
      let [index1, index2] = this.auxState.locators!
      let val1 = auxArray.Get(index1 < partition ? index1 : -1)
      let val2 = auxArray.Get(index2)
      this.PointTo(7)
      await Sleep(this.delay)
      if (val2 == null || (val1 != null && val1! < val2!)) {
        this.PointTo(8)
        array.Set(i + from, val1!)
        auxArray.State(ArrayItemState.Selected, index1)
        Vue.set(this.auxState.locators!, 0, index1 + 1 < partition ? (index1 + 1) : auxArray.length)
      } else {
        this.PointTo(10)
        array.Set(i + from, val2)
        auxArray.State(ArrayItemState.Selected, index2)
        Vue.set(this.auxState.locators!, 1, index2 + 1)
      }
      await Sleep(this.delay)
      await this.Continue()
    }
    auxArray.Empty()
    this.auxState.seperators = [-1]
    await Sleep(this.delay)
    await this.Continue()
  }

  async RunMergesort(array: ObservableArray<number>, from: number, to: number, auxArray: ObservableArray<number>) {
    array.PartialRestore(ArrayItemState.Accessed)
    this.PointTo(0)
    await Sleep(this.delay)
    if (to - from > 1) {
      this.PointTo(1)
      await Sleep(this.delay)
      let mid = Math.floor((to - from) / 2 + from)
      this.state.partition = [0, 0]
      this.PointTo(2)
      await Sleep(this.delay)
      await this.RunMergesort(array, from, mid, auxArray)
      await this.Continue()
      this.PointTo(3)
      await Sleep(this.delay)
      await this.RunMergesort(array, mid + 1, to, auxArray)
      await this.Continue()
      this.state.partition = to - from < array.length - 1 ? [from, to] : [0, 0]
      await this.Merge(array, from, to, mid, auxArray)
      await this.Continue()
    } else {
      this.PointTo(12)
      await Sleep(this.delay)
      if (to > from && array.Get(from, ArrayItemState.Accessed)! > array.Get(to, ArrayItemState.Accessed)!) {
        this.PointTo(13)
        await array.Swap(from, to)
        await this.Continue()
      } else {
        array.State(ArrayItemState.Accessed, from)
        await Sleep(this.delay)
        await this.Continue()
      }
    }
  }

  async Run() {
    let observer = $olink.Get<ObservableArray<any>>(this.array.id)!
    let auxObserver = $olink.Get<ObservableArray<any>>(this.auxArray.id)!
    await this.RunMergesort(observer, 0, observer.length - 1, auxObserver)
    this.OnComplete()
  }

  mounted() {
    this.CreateArray()
    this.auxArray = ObservableArray.From([], this.Continue)
    this.Run()
  }
}

export const PseudoCode = `
{mergeSort}(A, s ← 0, e ← A.{length} - 1):
  {if} e - s > 1:
    m ← s + ⌊(e - s) / 2⌋
    {mergeSort}(A, s, m)
    {mergeSort}(A, m + 1, e)
    L ← {createQueue}(A, s, m)
    R ← {createQueue}(A, m + 1, e)
    {for} i ∈ [s, e]:
      {if} (L.{head} < R.{head}):
        A[i] ← L.{dequeue}()
      {else}:
        A[i] ← R.{dequeue}()
  {else}:
    {if} s > e {and} A[s] > A[e]:
      {swap}(s, e)
`
</script>