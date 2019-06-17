<template>
  <div>
    <avl-node-item-renderer v-for="(child, index) in children" :key="index" :item="child.item" :position="child.position" :parentPosition="child.parentPosition" :parent="item" :cIndex="child.index" @resize="OnChildResize" @tag="BubbleUp"></avl-node-item-renderer>
    <p-item :element="visual"></p-item>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { RectangleItem, Stroke, GroupItem, PointTextItem, Coordinate, Point } from 'paper-vueify'
import { AVLTreeNode, UniqueAction } from '../model'
import { ITEM_SIZES, ACTION_BRUSHES, TEXT_BRUSH } from './Defs'
import { GenericNodeItemMixin } from './GenericNodeItem'

const SENTINEL = { height: 0 }

const TAG_BRUSH = ACTION_BRUSHES[UniqueAction.None]
const TAG_VIOLATE_BRUSH = ACTION_BRUSHES[UniqueAction.Select]
const TAG_STROKE = Stroke({ thickness: 0 })

@Component({
  name: 'avl-node-item-renderer',
})
export default class AVLNodeItemRenderer extends Mixins(GenericNodeItemMixin) {
  get bf() {
    let node = this.item as AVLTreeNode<any>
    let left = node.children[0] as AVLTreeNode<any> || SENTINEL
    let right = node.children[1] as AVLTreeNode<any> || SENTINEL
    return left.height - right.height
  }

  get tag() {
    const RADIUS = ITEM_SIZES.DIAMETER / 4
    let box = RectangleItem({
      size: Point(1.5 * RADIUS, 2 * RADIUS),
      brush: Math.abs(this.bf) > 1 ? TAG_VIOLATE_BRUSH : TAG_BRUSH,
      stroke: TAG_STROKE,
    })
    let label = PointTextItem({
      fontSize: ITEM_SIZES.TEXT / 2,
      fontFamily: 'Titillium Web',
      justification: 'center',
      content: this.bf.toString(),
      brush: TEXT_BRUSH,
      coordinate: Coordinate({ position: Point(0, ITEM_SIZES.TEXT / 4) }),
    })
    return GroupItem({ children: [box, label], coordinate: Coordinate({ position: Point(ITEM_SIZES.DIAMETER / 2, 0) }) })
  }

  get parts() {
    return [this.link, this.box, this.tag, this.label, this.stateLabel]
  }
}
</script>
