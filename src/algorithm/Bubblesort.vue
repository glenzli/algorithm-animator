<template>
  <div>
    <array-visualizer :array="array"></array-visualizer>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Arrayex } from 'arrayex'
import { ObservableArray, ObservableArrayItem, $olink, ObservableArrayState } from '../model'
import { ArrayVisualizer } from '../components'
import { Sleep, Swap, CreateNumericData, WrapData } from './utils'
import { NumericArrayAlgorithmMixin } from './NumericArrayAlgorithm'

@Component({
  components: { ArrayVisualizer },
})
export default class Bubblesort extends Mixins(NumericArrayAlgorithmMixin) {
  array: Array<ObservableArrayItem<number>> = []

  async RunBubblesort(array: ObservableArray<number>) {
    for (let j = 0; j < array.length; ++j) {
      let terminal = array.length - 1 - j
      let swapped = false
      for (let i  = 0; i < terminal; ++i) {
        if ((array.Get(i) as number) > (array.Get(i + 1) as number)) {
          swapped = true
          await Swap(array, i, i + 1, this.delay)
        } else {
          await Sleep(this.delay)
        }
        array.ResetState()
        await Sleep(this.delay)
      }
      array.Mark(terminal)
      await Sleep(this.delay)
      if (!swapped) {
        break
      }
    }
    array.ResetMark()
  }

  Run() {
    let observer = $olink.Get<ObservableArray<any>>(this.array.id)!
    this.RunBubblesort(observer)
  }

  mounted() {
    this.array = this.data.length > 0 ? WrapData(this.data) : CreateNumericData(30)
    this.Run()
  }
}
</script>
