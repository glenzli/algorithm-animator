<template>
  <div>
    <node-item-renderer v-for="(child, index) in children" :key="index" :item="child.item" :position="child.position" :parentPosition="child.parentPosition" :parent="item" :cIndex="child.index" @resize="OnChildResize" @tag="BubbleUp"></node-item-renderer>
    <p-item :element="visual"></p-item>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator'
import { Point, Point$, PointObject, Coordinate, CircleItem, PointTextItem, PolylineItem, RegularPolygonItem, GroupItem, PaperItemObject, Stroke } from 'paper-vueify'
import { ITEM_SIZES, ACTION_STROKES, ACTION_BRUSHES } from './Defs'
import { GenericItemMixin } from './GenericItem'
import { Algorithm, TreeNode, AbstractData, UniqueAction, UniqueState, UniqueAttribute } from '../model'

@Component({
  name: 'node-item-renderer',
})
export default class NodeItemRenderer extends Mixins(GenericItemMixin) {
  @Prop({ default: -1 }) cIndex!: number
  @Prop({ default: null }) parent!: TreeNode<any>
  @Prop({ default: null }) parentPosition!: PointObject
  @Prop({ default: 2 }) branch!: number

  childWidths = {} as { [index: number]: number }

  get box() {
    return CircleItem({
      radius: this.diameter / 2,
      ...this.boxStyle,
    })
  }

  get stateLabel() {
    if (this.stateLabelProps) {
      let xOffset = this.cIndex > 0 ? (this.cIndex < this.branch / 2 ? ITEM_SIZES.SPACE.x : -ITEM_SIZES.SPACE.x) : 0
      return PointTextItem({
        ...this.stateLabelProps,
        coordinate: Coordinate({ position: Point$.Subtract(ITEM_SIZES.TEXT_BIAS.position, Point(xOffset, ITEM_SIZES.DIAMETER / 2 + 2 * ITEM_SIZES.SPACE.x)) }),
      })
    }
    return null
  }

  get parts() {
    return [this.link, this.box, this.label, this.stateLabel]
  }

  get activeIndexes() {
    let children = (this.item as TreeNode<any>).children
    return children.map((_, index) => index).filter(index => !!children[index])
  }

  get actualWidths() {
    let children = (this.item as TreeNode<any>).children
    return children.map((child, index) => child ? (this.childWidths[index] || ITEM_SIZES.DIAMETER) : 2 * ITEM_SIZES.SPACE.x)
  }

  get isLeaf() {
    return this.activeIndexes.length === 0
  }

  get width() {
    if (this.isLeaf) {
      return ITEM_SIZES.DIAMETER
    } else {
      let width = this.actualWidths.reduce((w1, w2) => w1 + w2, 0) + (this.actualWidths.length - 1) * ITEM_SIZES.SPACE.x
      return this.actualWidths.reduce((w1, w2) => w1 + w2, 0) + (this.actualWidths.length - 1) * ITEM_SIZES.SPACE.x
    }
  }

  get children() {
    let xs = [-this.width / 2 + this.actualWidths[0] / 2]
    for (let i = 1; i < this.actualWidths.length; ++i) {
      xs.push(xs[i - 1] + (this.actualWidths[i - 1] + this.actualWidths[i]) / 2 + ITEM_SIZES.SPACE.x)
    }
    return this.activeIndexes.map(index => ({
      index,
      item: (this.item as TreeNode<any>).children[index],
      position: Point$.Add(this.position, Point(xs[index], ITEM_SIZES.DIAMETER + ITEM_SIZES.SPACE.y)),
      parentPosition: this.position,
    }))
  }

  get link() {
    if (this.parentPosition) {
      let terminal = Point$.Subtract(this.parentPosition, this.position)
      let xFrom = ITEM_SIZES.DIAMETER / 2
      let xTo = Point$.Length(terminal) - ITEM_SIZES.DIAMETER / 2
      let isParentRotating = this.parent && this.parent.action === UniqueAction.Rotate
      let isRotating = isParentRotating && this.item.action === UniqueAction.Rotate
      let children = [PolylineItem({
        points: [Point(xTo, 0), Point(xFrom, 0)],
        stroke: ACTION_STROKES[(this.item.action === UniqueAction.Move || isRotating) ? this.item.action : UniqueAction.None],
        opacity: this.item.action === UniqueAction.Isolate ? 0.1 : 1,
      })] as Array<PaperItemObject>
      if (this.item.action === UniqueAction.Move || isRotating) {
        let arrowTo = RegularPolygonItem({
          radius: ITEM_SIZES.SPACE.x,
          sides: 3,
          coordinate: Coordinate({ position: Point(xTo - ITEM_SIZES.SPACE.x, 0), rotation: Math.PI / 2 }),
          brush: ACTION_BRUSHES[this.item.action],
          stroke: ACTION_STROKES[this.item.action],
        })
        children.push(arrowTo)
      }
      if (!isRotating && isParentRotating && this.parent.children.some(c => !!c && c.action === UniqueAction.Rotate)) {
        let arrowFrom = RegularPolygonItem({
          radius: ITEM_SIZES.SPACE.x,
          sides: 3,
          coordinate: Coordinate({ position: Point((xTo + xFrom) / 2, 0), rotation: -Math.PI / 2 }),
          brush: ACTION_BRUSHES[UniqueAction.Rotate],
          stroke: ACTION_STROKES[UniqueAction.Rotate],
        })
        children.push(arrowFrom)
      }
      return GroupItem({ children, coordinate: Coordinate({ rotation: Point$.Angle(terminal) }) })
    }
    return null
  }

  OnChildResize(cIndex: number, width: number) {
    Vue.set(this.childWidths, cIndex, width)
  }

  @Watch('width')
  OnResize(width: number) {
    this.$emit('resize', this.cIndex, width)
  }

  @Watch('item.tag')
  OnExternal(tag: number, lastTag: number) {
    if (tag > -1) {
      this.$emit('tag', tag, this.position)
    } else {
      this.$emit('tag', lastTag)
    }
  }

  BubbleUp(tag: number, position: PointObject) {
    this.$emit('tag', tag, position)
  }

  mounted() {
    this.OnResize(this.width)
  }
}
</script>
