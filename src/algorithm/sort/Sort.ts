import { Component, Prop, Mixins, Watch } from 'vue-property-decorator'
import { AlgorithmMixin } from '../Algorithm'

@Component
export class SortAlgorithmMixin extends Mixins(AlgorithmMixin) {
  @Prop({ default: 0 }) gid!: number
  @Prop({ default: 10 }) n!: number
}
