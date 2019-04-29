<template>
  <div>
    <binary-heap-visualizer :heap="heap" :state="state" :position="position"></binary-heap-visualizer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { Point } from 'paper-vueify'
import { NumericHeapAlgorithmMixin } from './NumericHeapAlgorithm'
import { BinaryHeapVisualizer, BINARYNODE_SPACE_Y, BINARYNODE_SIZE } from '../components'
import { $olink, ObservableBinaryHeap, Sleep } from '../model'

@Component({
  components: { BinaryHeapVisualizer },
})
export default class DeleteHeap extends Mixins(NumericHeapAlgorithmMixin) {
  get position() {
    let yOffset = -Math.floor(Math.ceil(Math.log2(this.state.count)) / 2 * (BINARYNODE_SIZE + BINARYNODE_SPACE_Y))
    return Point(0, yOffset)
  }

  async RunDelete(heap: ObservableBinaryHeap<any>) {
    heap.InstantBuildHeap()
    await Sleep(this.delay)
    for (let i = 0; i < this.n / 2; ++i) {
      await heap.Delete()
      await this.Continue()
    }
  }

  Run() {
    let observer = $olink.Get<ObservableBinaryHeap<any>>(this.heap.id)!
    this.RunDelete(observer)
  }

  mounted() {
    this.CreateHeap()
    this.Run()
  }
}
</script>