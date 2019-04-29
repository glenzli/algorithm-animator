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
import { $olink, ObservableBinaryHeap } from '../model'

@Component({
  components: { BinaryHeapVisualizer },
})
export default class BuildHeap extends Mixins(NumericHeapAlgorithmMixin) {
  get position() {
    let yOffset = -Math.floor(Math.ceil(Math.log2(this.heap.length)) / 2 * (BINARYNODE_SIZE + BINARYNODE_SPACE_Y))
    return Point(0, yOffset)
  }

  async RunBuild(heap: ObservableBinaryHeap<any>) {
    await heap.BuildHeap()
  }

  Run() {
    let observer = $olink.Get<ObservableBinaryHeap<any>>(this.heap.id)!
    this.RunBuild(observer)
  }

  mounted() {
    this.CreateHeap()
    this.Run()
  }
}
</script>