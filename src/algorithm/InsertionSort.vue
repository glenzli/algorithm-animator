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
export default class InsertionSort extends Mixins(NumericArrayAlgorithmMixin) {
  state: ObservableArrayState = { locators: [0], partition: [0, 0], seperators: [-1] }

  async RunInsertionsort(array: ObservableArray<number>) {
    for (let i = 1; i < array.length; ++i) {
      Vue.set(this.state.locators!, 0, i - 1)
      Vue.set(this.state.seperators!, 0, i - 1)
      let current = array.Get(i, Operation.Accessed)!
      await Sleep(this.delay)
      await this.Continue()
      let j = i - 1
      for (; j >= 0; --j) {
        if (current > array.Get(j, Operation.Accessed)!) {
          array.State(Operation.None, j)
          break
        }
      }
      if (j !== i - 1) {
        await Sleep(this.delay)
        await this.Continue()
        await array.Move(i, j + 1)
        await this.Continue()
      }
      array.PartialRestore(Operation.Accessed)
      await this.Continue()
    }
    this.state.locators = [-1]
    this.state.seperators = [-1]
  }

  Run() {
    let observer = $olink.Get<ObservableArray<any>>(this.array.id)!
    this.RunInsertionsort(observer)
  }

  mounted() {
    this.CreateArray()
    this.Run()
  }
}
</script>
