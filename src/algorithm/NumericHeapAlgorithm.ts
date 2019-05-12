import { Component, Prop, Mixins, Provide, Watch } from 'vue-property-decorator'
import { ObservableBinaryHeapNode, ObservableBinaryHeap, ObservableBinaryHeapState, $olink } from '../model'
import { AlgorithmMixin } from './Algorithm'

@Component
export class NumericHeapAlgorithmMixin extends Mixins(AlgorithmMixin) {
  @Prop({ default: () => [0, 50] }) range!: Array<number>
  @Prop({ default: 30 }) n!: number

  @Provide('quantizer') quantizer = (value: number) => Number.isFinite(value) ? (value - this.range[0]) / (this.range[1] - this.range[0]) : 0

  heap: Array<ObservableBinaryHeapNode<number>> = []
  state: ObservableBinaryHeapState = { count: 0 }

  CreateHeap() {
    this.heap = ObservableBinaryHeap.Numeric(this.n, this.range, this.state, this.Continue)
    this.OnDelayChanged()
  }

  @Watch('delay')
  OnDelayChanged() {
    $olink.Get<ObservableBinaryHeap<number>>(this.heap.id)!.delay = this.delay
  }
}
