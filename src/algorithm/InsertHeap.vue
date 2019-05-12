<template>
  <div>
    <binary-heap-visualizer :heap="heap" :state="state" :position="position"></binary-heap-visualizer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { Point } from 'paper-vueify'
import { NumericHeapAlgorithmMixin } from './NumericHeapAlgorithm'
import { BinaryHeapVisualizer, HEAP_NODE_SPACE_Y, HEAP_NODE_SIZE } from '../components'
import { $olink, ObservableBinaryHeap, Sleep } from '../model'

@Component({
  components: { BinaryHeapVisualizer },
})
export default class InsertHeap extends Mixins(NumericHeapAlgorithmMixin) {
  get position() {
    let yOffset = -Math.floor(Math.ceil(Math.log2(this.state.count)) / 2 * (HEAP_NODE_SIZE + HEAP_NODE_SPACE_Y))
    return Point(0, yOffset)
  }

  async RunInsert(heap: ObservableBinaryHeap<any>) {
    heap.InstantBuildHeap()
    await Sleep(this.delay)
    for (let i = 0; i < this.n / 2; ++i) {
      let range = this.range[1] - this.range[0]
      let value = Math.floor(range / 4 * Math.random() + this.range[0] + range / 4 * 3)
      await heap.Insert(value)
      await this.Continue()
    }
  }

  Run() {
    let observer = $olink.Get<ObservableBinaryHeap<any>>(this.heap.id)!
    this.RunInsert(observer)
  }

  mounted() {
    this.CreateHeap()
    this.Run()
  }
}
</script>