<template>
  <div>
    <array-visualizer :array="array"></array-visualizer>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Arrayex } from 'arrayex'
import { ObservableArray, ObservableArrayItem, $olink, ObservableArrayState, ObservableState, Sleep } from '../model'
import { ArrayVisualizer } from '../components'
import { NumericArrayAlgorithmMixin } from './NumericArrayAlgorithm'

@Component({
  components: { ArrayVisualizer },
})
export default class Bubblesort extends Mixins(NumericArrayAlgorithmMixin) {
  array: Array<ObservableArrayItem<number>> = []

  async RunBubblesort(array: ObservableArray<number>) {
    for (let i = 0; i < array.length; ++i) {
      let terminal = array.length - 1 - i
      let noSwap = true
      for (let j = 0; j < terminal; ++j) {
        if (array.Get(j, ObservableState.Accessed)! > array.Get(j + 1, ObservableState.Accessed)!) {
          await array.Swap(j, j + 1, this.delay)
          noSwap = false
        }
      }
      array.PartialRestore(ObservableState.Accessed)
      array.State(ObservableState.Selected, terminal)
      await Sleep(this.delay)
      if (noSwap) {
        break
      }
    }
    array.Restore()
  }

  Run() {
    let observer = $olink.Get<ObservableArray<any>>(this.array.id)!
    this.RunBubblesort(observer)
  }

  mounted() {
    this.array = this.data.length > 0 ? ObservableArray.From(this.data) : ObservableArray.Numeric(30)
    this.Run()
  }
}
</script>
