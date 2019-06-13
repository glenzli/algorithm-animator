<template>
  <div v-if="items.length > 0">
    <heap-node-item-renderer v-for="(item, index) in items" :key="index" :item="item.item" :parent="item.parent" :position="item.position" :parentPosition="item.parentPosition"></heap-node-item-renderer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { Array$ } from 'js-corelib'
import { Point, PointObject, Point$ } from 'paper-vueify'
import { HeapData, HeapAlgorithm, HeapADT } from '../model'
import { ItemHelpers, ITEM_SIZES } from './Defs'
import HeapNodeItemRenderer from './HeapNodeItemRenderer.vue'

@Component({
  components: { HeapNodeItemRenderer },
})
export default class HeapRenderer extends Vue {
  @Prop({ required: true }) abstractData!: HeapData<any>
  @Prop({ default: () => Point(0, 0) }) position!: PointObject

  get positions() {
    if (this.abstractData.height > 0) {
      let leafCount = Math.pow(2, this.abstractData.height - 1)
      let leafWidth = ItemHelpers.GetWidth(leafCount)
      let offset = Point$.Add(Point(-leafWidth / 2, ItemHelpers.GetOffsetY(this.abstractData.height)), this.position)
      let positions = Array$.Flat(Array$.Create(this.abstractData.height, level => {
        let count = Math.pow(2, level)
        let y = (ITEM_SIZES.DIAMETER + ITEM_SIZES.SPACE.y) * level
        return Array$.Create(count, index => Point$.Add(offset, Point((index + 0.5) * (leafCount / count) * ITEM_SIZES.DIAMETER_SPACED, y)))
      }))
      return positions
    }
    return null
  }

  get items() {
    if (this.abstractData.heap) {
      let adt = HeapAlgorithm.From(this.abstractData.id).adt as HeapADT<any>
      return this.abstractData.heap.map((item, index) => {
        let parent = adt.Parent(index)
        return { item, parent: this.abstractData.heap[parent], position: this.positions![index], parentPosition: this.positions![parent] }
      }).reverse()
    }
    return []
  }
}
</script>
