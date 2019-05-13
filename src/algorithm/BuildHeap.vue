<template>
  <div>
    <heap-renderer :heap="heap" :state="state" :position="position"></heap-renderer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { Point } from 'paper-vueify'
import { NumericHeapAlgorithmMixin } from './NumericHeapAlgorithm'
import { HeapRenderer, HEAP_NODE_SPACE_Y, HEAP_NODE_SIZE } from '../components'
import { $olink, Heap } from '../model'

@Component({
  components: { HeapRenderer },
})
export default class BuildHeap extends Mixins(NumericHeapAlgorithmMixin) {
  get position() {
    let yOffset = -Math.floor(Math.ceil(Math.log2(this.heap.length)) / 2 * (HEAP_NODE_SIZE + HEAP_NODE_SPACE_Y))
    return Point(0, yOffset)
  }

  async RunBuild(heap: Heap<any>) {
    await heap.BuildHeap()
  }

  Run() {
    let observer = $olink.Get<Heap<any>>(this.heap.id)!
    this.RunBuild(observer)
  }

  mounted() {
    this.CreateHeap()
    this.Run()
  }
}
</script>