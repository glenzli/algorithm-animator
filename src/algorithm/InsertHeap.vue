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
export default class InsertHeap extends Mixins(NumericHeapAlgorithmMixin) {
  get position() {
    let yOffset = -Math.floor(Math.ceil(Math.log2(this.state.count)) / 2 * (NODESIZE + NODESPACE_Y))
    return Point(0, yOffset)
  }

  async RunInsert(heap: Heap<any>) {
    heap.InstantBuildHeap()
    await Sleep(this.delay)
    for (let i = 0; i < this.n / 2; ++i) {
      let range = this.range[1] - this.range[0]
      let value = Math.floor(range / 4 * Math.random() + this.range[0] + range / 4 * 3)
      await heap.Insert(value)
      await this.Continue()
    }
  }

  async Run() {
    let observer = $olink.Get<Heap<any>>(this.heap.id)!
    await this.RunInsert(observer)
    this.OnComplete()
  }

  mounted() {
    this.CreateHeap()
    this.Run()
  }
}
</script>