<template>
  <div>
    <array-renderer :array="array" :state="state"></array-renderer>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Vue } from 'vue-property-decorator'
import { Arrayex } from 'arrayex'
import { ObservableArray, ArrayItem, $olink, ObservableArrayState, Sleep, ArrayItemState } from '../../model'
import { ArrayRenderer } from '../../components'
import { NumericArrayAlgorithmMixin } from './NumericArrayAlgorithm'

@Component({
  components: { ArrayRenderer },
})
export default class SelectionSort extends Mixins(NumericArrayAlgorithmMixin) {
  state: ObservableArrayState = { locators: [0], partition: [0, 0], seperators: [-1] }

  async SelectMin(array: ObservableArray<number>, startIndex: number) {
    let minIndex = startIndex
    let min = array.Get(startIndex, ArrayItemState.Accessed)
    for (let i = startIndex; i < array.length; ++i) {
      if (array.Get(i, ArrayItemState.Accessed)! < array.Get(minIndex)!) {
        minIndex = i
      }
    }
    await Sleep(this.delay)
    array.Restore()
    array.State(ArrayItemState.Selected, minIndex)
    Vue.set(this.state.locators!, 0, minIndex)
    await Sleep(this.delay)
    return minIndex
  }

  async RunSelectionsort(array: ObservableArray<number>) {
    for (let i = 0; i < array.length; ++i) {
      this.PointTo(0)
      await Sleep(this.delay)
      this.PointTo(1)
      let minIndex = await this.SelectMin(array, i)
      this.PointTo(2)
      await Sleep(this.delay)
      if (minIndex !== i) {
        this.PointTo(3)
        await array.Swap(i, minIndex, ArrayItemState.None)
      }
      Vue.set(this.state.seperators!, 0, i)
      Vue.set(this.state.locators!, 0, i)
      await Sleep(this.delay)
      await this.Continue()
    }
    array.Restore()
  }

  async Run() {
    let observer = $olink.Get<ObservableArray<any>>(this.array.id)!
    await this.RunSelectionsort(observer)
    this.OnComplete()
  }

  mounted() {
    this.CreateArray()
    this.Run()
  }
}

export const PseudoCode = `
{selectionSort} (A):
  {for} i ∈ [0, A.{length}):
    minIndex ← {selecMin}(i, A.{length})
    {if} minIndex ≠ i:
      {swap}(minIndex, i)
`

</script>
