<template>
  <div>
    <array-visualizer :array="array" :state="state"></array-visualizer>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Vue } from 'vue-property-decorator'
import { Arrayex } from 'arrayex'
import { ObservableArray, ObservableArrayItem, $olink, ObservableArrayState } from '../model'
import { ArrayVisualizer } from '../components'
import { Sleep, Move, CreateNumericData, WrapData } from './utils'
import { NumericArrayAlgorithmMixin } from './NumericArrayAlgorithm'

@Component({
  components: { ArrayVisualizer },
})
export default class Insertionsort extends Mixins(NumericArrayAlgorithmMixin) {
  array: Array<ObservableArrayItem<number>> = []
  state: ObservableArrayState = { pointers: [0], seperation: [0, 0] }

  async RunInsertionsort(array: ObservableArray<number>) {
    for (let i = 1; i < array.length; ++i) {
      array.ResetMark()
      array.Mark(i - 1)
      await Sleep(this.delay)
      let current = array.Get(i) as number
      Vue.set(this.state.pointers!, 0, i - 1)
      await Sleep(this.delay)
      for (; this.state.pointers![0] >= 0; Vue.set(this.state.pointers!, 0, this.state.pointers![0] - 1)) {
        if (current >= (array.Get(this.state.pointers![0]) as number)) {
          break
        }
      }
      if (this.state.pointers![0] !== i - 1) {
        await Sleep(this.delay)
        await Move(array, i, this.state.pointers![0] + 1, this.delay)
      }
    }
  }

  Run() {
    let observer = $olink.Get<ObservableArray<any>>(this.array.id)!
    this.RunInsertionsort(observer)
  }

  mounted() {
    this.array = this.data.length > 0 ? WrapData(this.data) : CreateNumericData(30)
    this.Run()
  }
}
</script>
