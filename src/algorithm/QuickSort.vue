<template>
  <div>
    <array-renderer :array="array" :state="state"></array-renderer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Mixins } from 'vue-property-decorator'
import { Arrayex } from 'arrayex'
import { ObservableArray, ArrayItem, $olink, ObservableArrayState, Sleep, ArrayItemState } from '../model'
import { ArrayRenderer } from '../components'
import { NumericArrayAlgorithmMixin } from './NumericArrayAlgorithm'

@Component({
  components: { ArrayRenderer },
})
export default class QuickSort extends Mixins(NumericArrayAlgorithmMixin) {
  state: ObservableArrayState = { locators: [0], partition: [0, 0], seperators: [-1, -1] }

  async RunQuicksort(array: ObservableArray<number>, from: number, to: number) {
    this.PointTo(0)
    if (from < to) {
      this.state.partition = to - from < array.length - 1 ? [from, to] : [0, 0]
      await Sleep(this.delay)
      await this.Continue()
      this.PointTo(1)
      let pivot = array.Get(from, ArrayItemState.Selected)!
      Vue.set(this.state.seperators!, 0, from)
      await Sleep(this.delay)
      await this.Continue()
      Vue.set(this.state.locators!, 0, from + 1)
      for (let i = from + 1; i <= to; ++i) {
        this.PointTo(2)
        await Sleep(this.delay)
        if (array.Get(i, ArrayItemState.Accessed)! < pivot) {
          this.PointTo(3)
          if (i !== this.state.locators![0]) {
            await Sleep(this.delay)
            this.PointTo(4)
            await this.Continue()
            await array.Swap(i, this.state.locators![0])
            await this.Continue()
            Vue.set(this.state.seperators!, 1, this.state.locators![0])
            await Sleep(this.delay)
            await this.Continue()
          }
          Vue.set(this.state.locators!, 0, this.state.locators![0] + 1)
        }
      }
      this.PointTo(5)
      await Sleep(this.delay)
      if (from !== this.state.locators![0] - 1) {
        this.PointTo(6)
        await array.Swap(from, this.state.locators![0] - 1)
        await this.Continue()
      } else {
        await Sleep(this.delay)
        await this.Continue()
      }
      array.PartialRestore(ArrayItemState.Accessed)
      array.State(ArrayItemState.Selected, this.state.locators![0] - 1)
      this.state.seperators = [this.state.locators![0] - 2, this.state.locators![0] - 1]
      await Sleep(this.delay)
      await this.Continue()
      array.State(ArrayItemState.None, this.state.locators![0] - 1)
      this.state.partition = [0, 0]
      this.state.seperators = [-1, -1]
      this.PointTo(7)
      await Sleep(this.delay)
      await this.RunQuicksort(array, from, this.state.locators![0] - 2)
      await this.Continue()
      this.PointTo(8)
      await Sleep(this.delay)
      await this.RunQuicksort(array, this.state.locators![0], to)
      await this.Continue()
    }
  }

  async Run() {
    let observer = $olink.Get<ObservableArray<any>>(this.array.id)!
    await this.RunQuicksort(observer, 0, observer.length - 1)
    this.OnComplete()
  }

  mounted() {
    this.CreateArray()
    this.Run()
  }
}

export const PseudoCode = `
{quickSort} (A, s ← 0, e ← A.{length} - 1):
  {if} s < e:
    p ← s
    {for} i ∈ (s, e]:
      {if} A[i] < A[s]:
        {swap}(i, ++p)
    {if} s ≠ p:
      {swap}(s, p)
    {quickSort}(A, s, p - 1)
    {quickSort}(A, p + 1, e)
`

</script>
