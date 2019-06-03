import { Component, Prop, Mixins, Provide, Watch } from 'vue-property-decorator'
import { ArrayItem, ObservableArray, $olink } from '../../model'
import { AlgorithmMixin } from './Algorithm'

@Component
export class NumericArrayAlgorithmMixin extends Mixins(AlgorithmMixin) {
  @Prop({ default: () => [0, 50] }) range!: Array<number>
  @Prop({ default: 30 }) n!: number

  @Provide('quantizer') quantizer = (value: number) => Number.isFinite(value) ? (value - this.range[0]) / (this.range[1] - this.range[0]) : 0

  array: Array<ArrayItem<number>> = []

  CreateArray() {
    this.array = ObservableArray.Numeric(this.n, this.range, this.Continue)
    this.OnDelayChanged()
  }

  @Watch('delay')
  OnDelayChanged() {
    $olink.Get<ObservableArray<number>>(this.array.id)!.delay = this.delay
  }
}
