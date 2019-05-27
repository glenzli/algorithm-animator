<template>
  <div>
    <array-renderer :array="array" :position="rendererOffset"></array-renderer>
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
      this.PointTo(0)
      await Sleep(this.delay)
      let terminal = array.length - 1 - i
      let noSwap = true
      this.PointTo(1)
      await Sleep(this.delay)
      for (let j = 0; j < terminal; ++j) {
        this.PointTo(2)
        await Sleep(this.delay)
        this.PointTo(3)
        if (array.Get(j, ArrayItemState.Accessed)! > array.Get(j + 1, ArrayItemState.Accessed)!) {
          await Sleep(this.delay)
          this.PointTo(4)
          await array.Swap(j, j + 1)
          this.PointTo(5)
          await this.Continue()
          await Sleep(this.delay)
          noSwap = false
        }
      }
      array.PartialRestore(ArrayItemState.Accessed)
      array.State(ArrayItemState.Selected, terminal)
      this.PointTo(6)
      await Sleep(this.delay)
      await this.Continue()
      if (noSwap) {
        this.PointTo(7)
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

export const PseudoCode = `
{bubbleSort} (A):
  {for} i ∈ [0, A.{length}):
    noSwap ← {true}
    {for} j ∈ [0, A.{length} - 1 - i):
      {if} A[j] > A[j + 1]:
        {swap}(j, j + 1)
        noSwap ← {false}
    {if} noSwap = {true}:
      {break}
`

</script>
