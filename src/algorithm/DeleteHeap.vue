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
import { $olink, Heap, Sleep } from '../model'

@Component({
  components: { HeapRenderer },
})
export default class DeleteHeap extends Mixins(NumericHeapAlgorithmMixin) {
  get position() {
    let yOffset = -Math.floor(Math.ceil(Math.log2(this.state.count)) / 2 * (NODESIZE + NODESPACE_Y))
    return Point(0, yOffset)
  }

  async RunDelete(heap: Heap<any>) {
    heap.InstantBuildHeap()
    await Sleep(this.delay)
    for (let i = 0; i < this.n / 2; ++i) {
      await heap.Delete()
      await this.Continue()
    }
  }

  async Run() {
    let observer = $olink.Get<Heap<any>>(this.heap.id)!
    await this.RunDelete(observer)
    this.OnComplete()
  }

  mounted() {
    this.CreateHeap()
    this.Run()
  }
}
</script>