<template>
  <div>
    <array-renderer :array="array" :state="state"></array-renderer>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Vue } from 'vue-property-decorator'
import { Arrayex } from 'arrayex'
import { ObservableArray, ArrayItem, $olink, ObservableArrayState, Sleep, Operation } from '../model'
import { ArrayRenderer } from '../components'
import { NumericArrayAlgorithmMixin } from './NumericArrayAlgorithm'

@Component({
  components: { ArrayRenderer },
})
export default class SelectionSort extends Mixins(NumericArrayAlgorithmMixin) {
  state: ObservableArrayState = { locators: [0], partition: [0, 0], seperators: [-1] }

  async SelectMin(array: ObservableArray<number>, startIndex: number) {
    let minIndex = startIndex
    let min = array.Get(startIndex, Operation.Accessed)
    for (let i = startIndex; i < array.length; ++i) {
      if (array.Get(i, Operation.Accessed)! < array.Get(minIndex)!) {
        minIndex = i
      }
    }
    await Sleep(this.delay)
    array.Restore()
    array.State(Operation.Selected, minIndex)
    Vue.set(this.state.locators!, 0, minIndex)
    await Sleep(this.delay)
    return minIndex
  }

  async RunSelectionsort(array: ObservableArray<number>) {
    for (let i = 0; i < array.length; ++i) {
      let minIndex = await this.SelectMin(array, i)
      if (minIndex !== i) {
        await array.Swap(i, minIndex, Operation.None)
      }
      Vue.set(this.state.seperators!, 0, i)
      Vue.set(this.state.locators!, 0, i)
      await Sleep(this.delay)
      await this.Continue()
    }
    array.Restore()
  }

  Run() {
    let observer = $olink.Get<ObservableArray<any>>(this.array.id)!
    this.RunSelectionsort(observer)
  }

  mounted() {
    this.CreateArray()
    this.Run()
  }
}
</script>
