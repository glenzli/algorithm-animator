<template>
  <div>
    <array-renderer :array="array" :state="state"></array-renderer>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Vue } from 'vue-property-decorator'
import { Arrayex } from 'arrayex'
import { ObservableArray, ArrayItem, $olink, ObservableArrayState, Sleep, ArrayItemState } from '../model'
import { ArrayRenderer } from '../components'
import { NumericArrayAlgorithmMixin } from './NumericArrayAlgorithm'

@Component({
  components: { ArrayRenderer },
})
export default class InsertionSort extends Mixins(NumericArrayAlgorithmMixin) {
  state: ObservableArrayState = { locators: [0], partition: [0, 0], seperators: [-1] }

  async RunInsertionsort(array: ObservableArray<number>) {
    for (let i = 1; i < array.length; ++i) {
      this.PointTo(0)
      Vue.set(this.state.locators!, 0, i - 1)
      Vue.set(this.state.seperators!, 0, i - 1)
      let current = array.Get(i, ArrayItemState.Accessed)!
      await Sleep(this.delay)
      await this.Continue()
      let j = i - 1
      for (; j >= 0; --j) {
        this.PointTo(1)
        await Sleep(this.delay)
        if (current > array.Get(j, ArrayItemState.Accessed)!) {
          this.PointTo(2)
          await Sleep(this.delay)
          array.State(ArrayItemState.None, j)
          if (j !== i - 1) {
            this.PointTo(3)
            await Sleep(this.delay)
            await this.Continue()
            this.PointTo(4)
            await array.Move(i, j + 1)
            await this.Continue()
          }
          this.PointTo(5)
          await Sleep(this.delay)
          break
        }
      }
      array.PartialRestore(ArrayItemState.Accessed)
      await this.Continue()
    }
    this.state.locators = [-1]
    this.state.seperators = [-1]
  }

  async Run() {
    let observer = $olink.Get<ObservableArray<any>>(this.array.id)!
    await this.RunInsertionsort(observer)
    this.OnComplete()
  }

  mounted() {
    this.CreateArray()
    this.Run()
  }
}

export const PseudoCode = `
{insertionSort} (A):
  {for} i ∈ (0, A.{length}):
    {for} j ∈ [i - 1, 0]:
      {if} A[i] > A[j]:
        {if} j ≠ i - 1:
          {moveTo}(i, j + 1)
        {break}
`

</script>
