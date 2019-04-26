<template>
  <div>
    <array-visualizer :array="array" :state="state"></array-visualizer>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Vue } from 'vue-property-decorator'
import { Arrayex } from 'arrayex'
import { ObservableArray, ObservableArrayItem, $olink, ObservableArrayState, Sleep, ObservableState } from '../model'
import { ArrayVisualizer } from '../components'
import { NumericArrayAlgorithmMixin } from './NumericArrayAlgorithm'

@Component({
  components: { ArrayVisualizer },
})
export default class Insertionsort extends Mixins(NumericArrayAlgorithmMixin) {
  array: Array<ObservableArrayItem<number>> = []
  state: ObservableArrayState = { locators: [0], partition: [0, 0], seperators: [-1] }

  async RunInsertionsort(array: ObservableArray<number>) {
    for (let i = 1; i < array.length; ++i) {
      Vue.set(this.state.locators!, 0, i - 1)
      Vue.set(this.state.seperators!, 0, i - 1)
      let current = array.Get(i, ObservableState.Accessed)!
      await Sleep(this.delay)
      let j = i - 1
      for (; j >= 0; --j) {
        if (current > array.Get(j, ObservableState.Accessed)!) {
          array.State(ObservableState.None, j)
          break
        }
      }
      if (j !== i - 1) {
        await Sleep(this.delay)
        await array.Move(i, j + 1, this.delay)
      }
      array.PartialRestore(ObservableState.Accessed)
    }
  }

  Run() {
    let observer = $olink.Get<ObservableArray<any>>(this.array.id)!
    this.RunInsertionsort(observer)
  }

  mounted() {
    this.array = this.data.length > 0 ? ObservableArray.From(this.data) : ObservableArray.Numeric(30)
    this.Run()
  }
}
</script>
