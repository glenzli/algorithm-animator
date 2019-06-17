<template>
  <div>
    <node-item-renderer v-for="(child, index) in children" :key="index" :item="child.item" :position="child.position" :parentPosition="child.parentPosition" :cIndex="child.index" @resize="OnChildResize" @tag="BubbleUp"></node-item-renderer>
    <p-item :element="visual"></p-item>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { GenericNodeItemMixin } from './GenericNodeItem'

@Component({
  name: 'node-item-renderer',
})
export default class NodeItemRenderer extends Mixins(GenericNodeItemMixin) {
  get parts() {
    return [this.link, this.box, this.label, this.stateLabel]
  }
}
</script>
