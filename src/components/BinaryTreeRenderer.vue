<template>
  <div>
    <binary-node-renderer v-if="extra" :node="extra" :state="state" :position="extraPosition"></binary-node-renderer>
    <binary-node-renderer :node="root" :state="state" :position="position"></binary-node-renderer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { PointObject, Point } from 'paper-vueify'
import BinaryNodeRenderer from './BinaryNodeRenderer.vue'
import { BinaryNode, BinaryTreeState } from '../model'
import { BINARY_NODE_SPACE_Y, BINARY_NODE_SIZE } from './defs'

@Component({
  components: { BinaryNodeRenderer },
})
export default class BinaryTreeRenderer extends Vue {
  @Prop({ required: true }) root!: BinaryNode<any>
  @Prop({ default: null }) extra!: BinaryNode<any>
  @Prop({ required: true }) state!: BinaryTreeState
  @Prop({ default: () => Point(0, 0) }) position!: PointObject

  get extraPosition() {
    let y = this.position.y - BINARY_NODE_SPACE_Y - BINARY_NODE_SIZE * 2
    return Point(this.position.x, y)
  }
}
</script>