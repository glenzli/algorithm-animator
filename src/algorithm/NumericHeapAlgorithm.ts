import { Component, Prop, Mixins, Provide, Watch } from 'vue-property-decorator'
import { HeapNode, Heap, HeapState, $olink } from '../model'
import { AlgorithmMixin } from './Algorithm'

@Component
export class NumericHeapAlgorithmMixin extends Mixins(AlgorithmMixin) {
  @Prop({ default: () => [0, 50] }) range!: Array<number>
  @Prop({ default: 30 }) n!: number

  @Provide('quantizer') quantizer = (value: number) => Number.isFinite(value) ? (value - this.range[0]) / (this.range[1] - this.range[0]) : 0

  heap: Array<HeapNode<number>> = []
  state: HeapState = { count: 0 }

  CreateHeap() {
    this.heap = Heap.Numeric(this.n, this.range, this.state, this.Continue)
    this.OnDelayChanged()
  }

  @Watch('delay')
  OnDelayChanged() {
    $olink.Get<Heap<number>>(this.heap.id)!.delay = this.delay
  }
}
