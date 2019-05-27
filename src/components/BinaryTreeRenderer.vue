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
import { NODESPACE_Y, NODESIZE } from './defs'

@Component({
  components: { BinaryNodeRenderer },
})
export default class BinaryTreeRenderer extends Vue {
  @Prop({ required: true }) root!: BinaryNode<any>
  @Prop({ default: null }) extra!: BinaryNode<any>
  @Prop({ required: true }) state!: BinaryTreeState
  @Prop({ default: () => Point(0, 0) }) position!: PointObject

  get extraPosition() {
    let y = this.position.y - NODESPACE_Y * 2 - NODESIZE
    return Point(this.position.x, y)
  }
}
</script>