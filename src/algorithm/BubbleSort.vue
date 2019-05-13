<template>
  <div>
    <array-renderer :array="array"></array-renderer>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Arrayex } from 'arrayex'
import { ObservableArray, ArrayItem, $olink, ObservableArrayState, Operation, Sleep } from '../model'
import { ArrayRenderer } from '../components'
import { NumericArrayAlgorithmMixin } from './NumericArrayAlgorithm'

@Component({
  components: { ArrayRenderer },
})
export default class BubbleSort extends Mixins(NumericArrayAlgorithmMixin) {
  async RunBubblesort(array: ObservableArray<number>) {
    for (let i = 0; i < array.length; ++i) {
      let terminal = array.length - 1 - i
      let noSwap = true
      for (let j = 0; j < terminal; ++j) {
        if (array.Get(j, Operation.Accessed)! > array.Get(j + 1, Operation.Accessed)!) {
          await array.Swap(j, j + 1)
          await this.Continue()
          noSwap = false
        }
      }
      array.PartialRestore(Operation.Accessed)
      array.State(Operation.Selected, terminal)
      await Sleep(this.delay)
      await this.Continue()
      if (noSwap) {
        break
      }
      await this.Continue()
    }
    array.Restore()
  }

  Run() {
    let observer = $olink.Get<ObservableArray<any>>(this.array.id)!
    this.RunBubblesort(observer)
  }

  mounted() {
    this.CreateArray()
    this.Run()
  }
}
</script>
