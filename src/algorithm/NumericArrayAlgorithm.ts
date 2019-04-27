import { Component, Prop, Mixins, Provide } from 'vue-property-decorator'
import { ObservableArrayItem, ObservableArray } from '../model'
import { AlgorithmMixin } from './Algorithm'

@Component
export class NumericArrayAlgorithmMixin extends Mixins(AlgorithmMixin) {
  @Prop({ default: () => [0, 50] }) range!: Array<number>
  @Prop({ default: 30 }) n!: number

  @Provide('quantizer') quantizer = (value: number) => (value - this.range[0]) / (this.range[1] - this.range[0])

  array: Array<ObservableArrayItem<number>> = []

  CreateArray() {
    this.array = ObservableArray.Numeric(this.n, this.range, this.Continue)
  }
}
