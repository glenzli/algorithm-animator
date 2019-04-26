<template>
  <div>
    <array-visualizer :array="array" :state="state"></array-visualizer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Mixins } from 'vue-property-decorator'
import { Arrayex } from 'arrayex'
import { ObservableArray, ObservableArrayItem, $olink, ObservableArrayState, Sleep, ObservableState } from '../model'
import { ArrayVisualizer } from '../components'
import { NumericArrayAlgorithmMixin } from './NumericArrayAlgorithm'

@Component({
  components: { ArrayVisualizer },
})
export default class Quicksort extends Mixins(NumericArrayAlgorithmMixin) {
  array: Array<ObservableArrayItem<number>> = []
  state: ObservableArrayState = { locators: [0], partition: [0, 0], seperators: [-1, -1] }

  async RunQuicksort(array: ObservableArray<number>, from: number, to: number) {
    if (from < to) {
      this.state.partition = to - from < array.length - 1 ? [from, to] : [0, 0]
      await Sleep(this.delay)
      let pivot = array.Get(from, ObservableState.Selected)!
      Vue.set(this.state.seperators!, 0, from)
      await Sleep(this.delay)
      Vue.set(this.state.locators!, 0, from + 1)
      for (let i = from + 1; i <= to; ++i) {
        if (array.Get(i, ObservableState.Accessed)! < pivot) {
          if (i !== this.state.locators![0]) {
            await Sleep(this.delay)
            await array.Swap(i, this.state.locators![0], this.delay)
            Vue.set(this.state.seperators!, 1, this.state.locators![0])
            await Sleep(this.delay)
          }
          Vue.set(this.state.locators!, 0, this.state.locators![0] + 1)
        }
      }
      if (from !== this.state.locators![0] - 1) {
        await array.Swap(from, this.state.locators![0] - 1, this.delay)
      } else {
        await Sleep(this.delay)
      }
      array.PartialRestore(ObservableState.Accessed)
      array.State(ObservableState.Selected, this.state.locators![0] - 1)
      this.state.seperators = [this.state.locators![0] - 2, this.state.locators![0] - 1]
      await Sleep(this.delay)
      array.State(ObservableState.None, this.state.locators![0] - 1)
      this.state.partition = [0, 0]
      this.state.seperators = [-1, -1]
      await this.RunQuicksort(array, from, this.state.locators![0] - 2)
      await this.RunQuicksort(array, this.state.locators![0], to)
    }
  }

  Run() {
    let observer = $olink.Get<ObservableArray<any>>(this.array.id)!
    this.RunQuicksort(observer, 0, observer.length - 1)
  }

  mounted() {
    this.array = this.data.length > 0 ? ObservableArray.From(this.data) : ObservableArray.Numeric(30)
    this.Run()
  }
}
</script>
