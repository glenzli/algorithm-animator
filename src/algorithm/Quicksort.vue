<template>
  <div>
    <array-visualizer :array="array" :state="state"></array-visualizer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Mixins } from 'vue-property-decorator'
import { Arrayex } from 'arrayex'
import { ObservableArray, ObservableArrayItem, $olink, ObservableArrayState } from '../model'
import { ArrayVisualizer } from '../components'
import { Sleep, Swap, CreateNumericData, WrapData } from './utils'
import { NumericArrayAlgorithmMixin } from './NumericArrayAlgorithm'

async function RunQuicksort(array: ObservableArray<number>, state: ObservableArrayState, from: number, to: number, delay = 1000) {
  if (from < to) {
    state.seperation = to - from < array.length - 1 ? [from, to] : [0, 0]
    await Sleep(delay)
    let pivot = array.Mark(from)!
    await Sleep(delay)
    Vue.set(state.pointers!, 0, from + 1)
    for (let i = from + 1; i <= to; ++i) {
      if (array.Get(i)! < pivot) {
        await Swap(array, i, state.pointers![0], delay)
        Vue.set(state.pointers!, 0, state.pointers![0] + 1)
      }
      await Sleep(delay)
      array.ResetState()
      await Sleep(delay)
    }
    await Swap(array, from, state.pointers![0] - 1, delay)
    array.ResetMark()
    state.seperation = [0, 0]
    await Sleep(delay)
    await RunQuicksort(array, state, from, state.pointers![0] - 2, delay)
    await RunQuicksort(array, state, state.pointers![0], to, delay)
  }
}

@Component({
  components: { ArrayVisualizer },
})
export default class Quicksort extends Mixins(NumericArrayAlgorithmMixin) {
  array: Array<ObservableArrayItem<number>> = []
  state: ObservableArrayState = { pointers: [0], seperation: [0, 0] }

  Run() {
    let observer = $olink.Get<ObservableArray<any>>(this.array.id)!
    RunQuicksort(observer, this.state, 0, observer.length - 1, this.delay)
  }

  mounted() {
    this.array = this.data.length > 0 ? WrapData(this.data) : CreateNumericData(30)
    this.Run()
  }
}
</script>
