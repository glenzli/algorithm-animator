<template>
  <div>
    <binary-node-visualizer v-if="extra" :node="extra" :state="state" :position="extraPosition"></binary-node-visualizer>
    <binary-node-visualizer :node="root" :state="state" :position="position"></binary-node-visualizer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { PointObject, Point } from 'paper-vueify'
import BinaryNodeVisualizer from './BinaryNodeVisualizer.vue'
import { ObservableBinaryNode, ObservableBinaryTreeState } from '../model'
import { BINARY_NODE_SPACE_Y, BINARY_NODE_SIZE } from './defs'

@Component({
  components: { BinaryNodeVisualizer },
})
export default class BinaryTreeVisualizer extends Vue {
  @Prop({ required: true }) root!: ObservableBinaryNode<any>
  @Prop({ default: null }) extra!: ObservableBinaryNode<any>
  @Prop({ required: true }) state!: ObservableBinaryTreeState
  @Prop({ default: () => Point(0, 0) }) position!: PointObject

  get extraPosition() {
    let y = this.position.y - BINARY_NODE_SPACE_Y - BINARY_NODE_SIZE
    return Point(this.position.x, y)
  }
}
</script>