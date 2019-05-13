import { Component, Prop, Mixins, Provide, Watch } from 'vue-property-decorator'
import { Point } from 'paper-vueify'
import { BinaryNode, BinaryTree, $olink, Operation, BinaryTreeState } from '../model'
import { AlgorithmMixin } from './Algorithm'
import { BINARY_NODE_SIZE, BINARY_NODE_SPACE_Y } from '../components'

@Component
export class NumericBSTAlgorithmMixin extends Mixins(AlgorithmMixin) {
  @Prop({ default: () => [0, 50] }) range!: Array<number>
  @Prop({ default: 30 }) n!: number

  @Provide('quantizer') quantizer = (value: number) => Number.isFinite(value) ? (value - this.range[0]) / (this.range[1] - this.range[0]) : 0

  roots: Array<BinaryNode<number>> = [{ value: Number.NaN, left: [], right: [], level: 0, state: Operation.None }]
  state: BinaryTreeState = { height: 0 }
  id = -1

  get root() {
    return this.roots[0]
  }

  get position() {
    let offsetY = -this.state.height * (BINARY_NODE_SIZE + BINARY_NODE_SPACE_Y) / 2
    return Point(0, offsetY)
  }

  CreateBST(n = 0) {
    let { id, root } = BinaryTree.Numeric(n || this.n, this.range, this.state)
    this.roots = root
    this.id = id
    this.OnDelayChanged()
  }

  @Watch('delay')
  OnDelayChanged() {
    $olink.Get<BinaryTree<number>>(this.id)!.delay = this.delay
  }
}
