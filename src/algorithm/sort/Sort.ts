import { Component, Prop, Mixins, Provide } from 'vue-property-decorator'
import { AlgorithmMixin } from '../Algorithm'
import { QUANTIZERS, VALUE_GENERATORS } from '../Defs'
import { SortAlgorithm } from '../../model'
import { ArrayRenderer } from '../../renderer'

@Component({
  components: { ArrayRenderer },
})
export class SortAlgorithmMixin extends Mixins(AlgorithmMixin) {
  @Prop({ default: 0 }) gid!: number
  @Prop({ default: 10 }) n!: number

  @Provide('quantizer') quantizer = QUANTIZERS[this.gid]

  InitSort(generator: () => any): SortAlgorithm<any> {
    return {} as any
  }

  Init() {
    let sort = this.InitSort(VALUE_GENERATORS[this.gid])
    sort.n = this.n
    this.abstractData = sort.data
  }
}
