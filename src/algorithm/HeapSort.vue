<template>
  <div>
    <array-renderer :array="array" :position="arrayPosition"></array-renderer>
    <heap-renderer :heap="heap" :state="heapState" :position="position"></heap-renderer>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Arrayex } from 'arrayex'
import { Point, Point$ } from 'paper-vueify'
import { ObservableArray, ArrayItem, $olink, ObservableArrayState, HeapNodeState, HeapNode, HeapState, Sleep, Heap } from '../model'
import { ArrayRenderer, HeapRenderer, NODESIZE, NODESPACE_Y, NODESIZE_X_PLUS } from '../components'
import { NumericArrayAlgorithmMixin } from './NumericArrayAlgorithm'

@Component({
  components: { ArrayRenderer, HeapRenderer },
})
export default class HeapSort extends Mixins(NumericArrayAlgorithmMixin) {
  heap: Array<HeapNode<number>> = []
  heapState: HeapState = { count: 0 }

  get position() {
    let yOffset = this.heap.length > 0 ? -Math.floor(Math.ceil(Math.log2(this.heap.length)) / 2 * (NODESIZE + NODESPACE_Y)) : 0
    return Point(0, yOffset)
  }

  get arrayPosition() {
    return Point$.Add(this.position, Point(0, -3 * NODESIZE_X_PLUS))
  }

  async RunHeapsort(array: ObservableArray<number>) {
    this.heap = Heap.FromNumeric(array.data.map(() => Number.NEGATIVE_INFINITY), this.heapState, this.Continue)
    this.OnDelayChanged()
    let heapObserver = $olink.Get<Heap<number>>(this.heap.id)!
    // fill
    for (let i = 0; i < array.length; ++i) {
      await Sleep(this.delay)
      await this.Continue()
      heapObserver.Set(i, array.Get(i)!)
      array.Set(i, Number.NaN)
    }
    await Sleep(this.delay)
    await this.Continue()
    // build
    await heapObserver.BuildHeap()
    // begin to remove
    while (this.heapState.count > 0) {
      await Sleep(this.delay)
      let maximum = heapObserver.Peek()!
      array.Set(this.heapState.count - 1, maximum)
      await Sleep(this.delay)
      await this.Continue()
      await heapObserver.Delete()
      heapObserver.State(HeapNodeState.Selected, 1)
      await Sleep(this.delay)
      await this.Continue()
    }
  }

  async Run() {
    let observer = $olink.Get<ObservableArray<any>>(this.array.id)!
    await this.RunHeapsort(observer)
    this.OnComplete()
  }

  mounted() {
    this.CreateArray()
    this.Run()
  }

  @Watch('delay')
  OnDelayChangedForHeap() {
    $olink.Get<Heap<number>>(this.heap.id)!.delay = this.delay
  }
}
</script>
