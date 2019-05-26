<template>
  <div>
    <heap-renderer :heap="heap" :state="state" :position="position"></heap-renderer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { Point } from 'paper-vueify'
import { NumericHeapAlgorithmMixin } from './NumericHeapAlgorithm'
import { HeapRenderer, NODESPACE_Y, NODESIZE } from '../components'
import { $olink, Heap } from '../model'

@Component({
  components: { HeapRenderer },
})
export default class BuildHeap extends Mixins(NumericHeapAlgorithmMixin) {
  get position() {
    let yOffset = -Math.floor(Math.ceil(Math.log2(this.heap.length)) / 2 * (NODESIZE + NODESPACE_Y))
    return Point(0, yOffset)
  }

  async RunBuild(heap: Heap<any>) {
    await heap.BuildHeap()
  }

  async Run() {
    let observer = $olink.Get<Heap<any>>(this.heap.id)!
    await this.RunBuild(observer)
    this.OnComplete()
  }

  mounted() {
    this.CreateHeap()
    this.Run()
  }
}
</script>