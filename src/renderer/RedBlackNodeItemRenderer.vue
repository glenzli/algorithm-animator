<template>
  <div>
    <red-black-node-item-renderer v-for="(child, index) in children" :key="index" :item="child.item" :position="child.position" :parentPosition="child.parentPosition" :parent="item" :cIndex="child.index" @resize="OnChildResize" @tag="BubbleUp"></red-black-node-item-renderer>
    <p-item :element="visual"></p-item>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { CircleItem, Stroke, Color$, SolidBrush, Coordinate, PathItem, Point } from 'paper-vueify'
import { RedBlackTreeNode } from '../model'
import { ITEM_SIZES } from './Defs'
import { GenericNodeItemMixin } from './GenericNodeItem'

const RED_BRUSH = SolidBrush(Color$.ToColor('#cc1414'))
const BLACK_BRUSH = SolidBrush(Color$.ToColor('#000'))
const TAG_STROKE = Stroke({ thickness: 0 })

@Component({
  name: 'red-black-node-item-renderer',
})
export default class RedBlackNodeItemRenderer extends Mixins(GenericNodeItemMixin) {
  get tag() {
    if (this.labelContent.length > 0) {
      return CircleItem({
        radius: ITEM_SIZES.DIAMETER / 8,
        brush: (this.item as RedBlackTreeNode<any>).red ? RED_BRUSH : BLACK_BRUSH,
        stroke: TAG_STROKE,
        coordinate: Coordinate({ position: Point(ITEM_SIZES.DIAMETER / 2, 0) }),
      })
    }
    return PathItem()
  }

  get nilOpacity() {
    return 1
  }

  get nilBrush() {
    return BLACK_BRUSH
  }

  get parts() {
    return [this.link, this.box, this.tag, this.label, this.stateLabel]
  }
}
</script>
