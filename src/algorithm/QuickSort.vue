<template>
  <div>
    <array-renderer :array="array" :state="state"></array-renderer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Mixins } from 'vue-property-decorator'
import { Arrayex } from 'arrayex'
import { ObservableArray, ArrayItem, $olink, ObservableArrayState, Sleep, Operation } from '../model'
import { ArrayRenderer } from '../components'
import { NumericArrayAlgorithmMixin } from './NumericArrayAlgorithm'

@Component({
  components: { ArrayRenderer },
})
export default class QuickSort extends Mixins(NumericArrayAlgorithmMixin) {
  state: ObservableArrayState = { locators: [0], partition: [0, 0], seperators: [-1, -1] }

  async RunQuicksort(array: ObservableArray<number>, from: number, to: number) {
    if (from < to) {
      this.state.partition = to - from < array.length - 1 ? [from, to] : [0, 0]
      await Sleep(this.delay)
      await this.Continue()
      let pivot = array.Get(from, Operation.Selected)!
      Vue.set(this.state.seperators!, 0, from)
      await Sleep(this.delay)
      await this.Continue()
      Vue.set(this.state.locators!, 0, from + 1)
      for (let i = from + 1; i <= to; ++i) {
        if (array.Get(i, Operation.Accessed)! < pivot) {
          if (i !== this.state.locators![0]) {
            await Sleep(this.delay)
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
      if (from !== this.state.locators![0] - 1) {
        await array.Swap(from, this.state.locators![0] - 1)
        await this.Continue()
      } else {
        await Sleep(this.delay)
        await this.Continue()
      }
      array.PartialRestore(Operation.Accessed)
      array.State(Operation.Selected, this.state.locators![0] - 1)
      this.state.seperators = [this.state.locators![0] - 2, this.state.locators![0] - 1]
      await Sleep(this.delay)
      await this.Continue()
      array.State(Operation.None, this.state.locators![0] - 1)
      this.state.partition = [0, 0]
      this.state.seperators = [-1, -1]
      await this.RunQuicksort(array, from, this.state.locators![0] - 2)
      await this.Continue()
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
</script>
