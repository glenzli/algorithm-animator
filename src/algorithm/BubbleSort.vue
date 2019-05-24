<template>
  <div>
    <array-renderer :array="array"></array-renderer>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Arrayex } from 'arrayex'
import { ObservableArray, ArrayItem, $olink, ObservableArrayState, ArrayItemState, Sleep } from '../model'
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
        if (array.Get(j, ArrayItemState.Accessed)! > array.Get(j + 1, ArrayItemState.Accessed)!) {
          this.OnNotify(`[${terminal}, ${array.length - 1}] is sorted; Loop [0, ${terminal}), comparing [${j}]=${array.Get(j)} to [${j + 1}]=${array.Get(j + 1)}; [${j}]=${array.Get(j)} is larger; Swap.`)
          await array.Swap(j, j + 1)
          await this.Continue()
          noSwap = false
        }
      }
      array.PartialRestore(ArrayItemState.Accessed)
      array.State(ArrayItemState.Selected, terminal)
      await Sleep(this.delay)
      await this.Continue()
      if (noSwap) {
        this.OnNotify(`Everything get sorted when sorting [0, ${terminal}], break`)
        await Sleep(this.delay)
        break
      }
      await this.Continue()
    }
    array.Restore()
  }

  async Run() {
    let observer = $olink.Get<ObservableArray<any>>(this.array.id)!
    await this.RunBubblesort(observer)
    this.OnComplete()
  }

  mounted() {
    this.CreateArray()
    this.Run()
  }
}
</script>
