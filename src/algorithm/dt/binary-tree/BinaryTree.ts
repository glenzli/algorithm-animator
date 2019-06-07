import { Component, Prop, Mixins, Provide } from 'vue-property-decorator'
import { AlgorithmMixin } from '../../Algorithm'
import { QUANTIZERS, VALUE_GENERATORS } from '../../Defs'
import { BinaryTreeAlgorithm } from '../../../model'
import { BinaryTreeRenderer } from '../../../renderer'

@Component({
  components: { BinaryTreeRenderer },
})
export class BinaryTreeAlgorithmMixin extends Mixins(AlgorithmMixin) {
  @Prop({ default: 0 }) gid!: number
  @Prop({ default: 10 }) n!: number

  @Provide('quantizer') quantizer = QUANTIZERS[this.gid]

  InitTree(generator: () => any): BinaryTreeAlgorithm<any> {
    return {} as  any
  }

  Init() {
    let tree = this.InitTree(VALUE_GENERATORS[this.gid])
    tree.n = this.n
    this.abstractData = tree.data
  }
}
