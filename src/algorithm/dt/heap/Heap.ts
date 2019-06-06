import { Component, Prop, Mixins, Provide } from 'vue-property-decorator'
import { AlgorithmMixin } from '../../Algorithm'
import { QUANTIZERS, VALUE_GENERATORS } from '../../Defs'
import { HeapAlgorithm } from '../../../model'
import { HeapRenderer } from '../../../renderer'

@Component({
  components: { HeapRenderer },
})
export class HeapAlgorithmMixin extends Mixins(AlgorithmMixin) {
  @Prop({ default: 0 }) gid!: number
  @Prop({ default: 10 }) n!: number

  @Provide('quantizer') quantizer = QUANTIZERS[this.gid]

  InitHeap(generator: () => any): HeapAlgorithm<any> {
    return {} as  any
  }

  Init() {
    let heap = this.InitHeap(VALUE_GENERATORS[this.gid])
    heap.n = this.n
    this.abstractData = heap.data
  }
}
