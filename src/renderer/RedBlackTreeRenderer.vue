<template>
  <div v-if="abstractData.root">
    <p-item v-for="(link, index) in links" :key="`l${index}`" :element="link"></p-item>
    <red-black-node-item-renderer :item="abstractData.root" :position="rootPosition" @tag="Tagging"></red-black-node-item-renderer>
    <value-item-renderer v-for="(active, index) in actives" :key="index" :item="active.item" :position="active.position"></value-item-renderer>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BinaryTreeRenderer from './BinaryTreeRenderer.vue'
import RedBlackNodeItemRenderer from './RedBlackNodeItemRenderer.vue'

@Component({
  components: { RedBlackNodeItemRenderer },
})
export default class RedBlackTreeRenderer extends Mixins(BinaryTreeRenderer) {
}
</script>