<template>
  <node-item-renderer v-if="abstractData.root" :item="abstractData.root" :position="rootPosition"></node-item-renderer>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { Point, PointObject, Point$ } from 'paper-vueify'
import { BinaryTreeData } from '../model'
import { ItemHelpers } from './Defs'
import NodeItemRenderer from './NodeItemRenderer.vue'

@Component({
  components: { NodeItemRenderer },
})
export default class BinaryTreeRenderer extends Vue {
  @Prop({ required: true }) abstractData!: BinaryTreeData<any>
  @Prop({ default: () => Point(0, 0) }) position!: PointObject

  get rootPosition() {
    let y = ItemHelpers.GetOffsetY(this.abstractData.height)
    return Point$.Add(this.position, Point(0, y))
  }
}
</script>
