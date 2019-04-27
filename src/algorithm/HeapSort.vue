<template>
  <div>
    <array-visualizer :array="array" :position="arrayPosition"></array-visualizer>
    <binary-heap-visualizer :heap="heap" :state="heapState" :position="position"></binary-heap-visualizer>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Arrayex } from 'arrayex'
import { Point, Point$ } from 'paper-vueify'
import { ObservableArray, ObservableArrayItem, $olink, ObservableArrayState, ObservableState, ObservableBinaryHeapNode, ObservableBinaryHeapState, Sleep, ObservableBinaryHeap } from '../model'
import { ArrayVisualizer, BinaryHeapVisualizer, BINARYNODE_SIZE, BINARYNODE_SPACE_Y, ARRAYITEM_TOTAL } from '../components'
import { NumericArrayAlgorithmMixin } from './NumericArrayAlgorithm'

@Component({
  components: { ArrayVisualizer, BinaryHeapVisualizer },
})
export default class HeapSort extends Mixins(NumericArrayAlgorithmMixin) {
  heap: Array<ObservableBinaryHeapNode<number>> = []
  heapState: ObservableBinaryHeapState = { count: 0 }

  get position() {
    let yOffset = this.heap.length > 0 ? -Math.floor(Math.ceil(Math.log2(this.heap.length)) / 2 * (BINARYNODE_SIZE + BINARYNODE_SPACE_Y)) : 0
    return Point(0, yOffset)
  }

  get arrayPosition() {
    return Point$.Add(this.position, Point(0, -3 * ARRAYITEM_TOTAL))
  }

  async RunHeapsort(array: ObservableArray<number>) {
    await Sleep(this.delay * 2)
    await this.Continue()
    this.heap = ObservableBinaryHeap.FromNumeric(array.data.map(item => item.value), this.heapState, this.Continue)
    array.Fill(array.length, Number.NaN)
    await Sleep(this.delay)
    await this.Continue()
    // build
    let heapObserver = $olink.Get<ObservableBinaryHeap<number>>(this.heap.id)!
    await heapObserver.BuildHeap(this.delay)
    // begin to remove
    while (this.heapState.count > 0) {
      await Sleep(this.delay)
      let maximum = heapObserver.Peek()!
      array.Set(this.heapState.count - 1, maximum, ObservableState.Selected)
      await Sleep(this.delay)
      await this.Continue()
      await heapObserver.Delete(this.delay)
      heapObserver.State(ObservableState.Selected, 1)
      await Sleep(this.delay)
      await this.Continue()
    }
  }

  Run() {
    let observer = $olink.Get<ObservableArray<any>>(this.array.id)!
    this.RunHeapsort(observer)
  }

  mounted() {
    this.CreateArray()
    this.Run()
  }
}
</script>
