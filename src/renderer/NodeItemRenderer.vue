<template>
  <div>
    <node-item-renderer v-for="(child, index) in children" :key="index" :item="child.item" :position="child.position" :parent="item" :parentPosition="child.parentPosition" :cIndex="child.index" @resize="OnChildResize"></node-item-renderer>
    <p-item :element="visual"></p-item>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator'
import { Point, Point$, PointObject, Coordinate, CircleItem, PointTextItem, PolylineItem, RegularPolygonItem, GroupItem, PaperItemObject, Stroke } from 'paper-vueify'
import { ITEM_SIZES, ACTION_STROKES, ACTION_BRUSHES } from './Defs'
import { GenericItemMixin } from './GenericItem'
import { Algorithm, TreeNodeItem, AbstractData, UniqueAction } from '../model'

const INDICATOR_BRUSH = ACTION_BRUSHES[UniqueAction.Swap]
const INDICATOR_STROKE = Stroke({ thickness: 0 })

@Component({
  name: 'node-item-renderer',
})
export default class NodeItemRenderer extends Mixins(GenericItemMixin) {
  @Prop({ default: 0 }) cIndex!: number
  @Prop({ default: null }) parent!: TreeNodeItem<any> | null
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
      let xOffset = this.cIndex < this.branch / 2 ? ITEM_SIZES.SPACE.x : -ITEM_SIZES.SPACE.x
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
    let children = (this.item as TreeNodeItem<any>).children
    return children.map((_, index) => index).filter(index => !!children[index])
  }

  get actualWidths() {
    let children = (this.item as TreeNodeItem<any>).children
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
      item: (this.item as TreeNodeItem<any>).children[index],
      position: Point$.Add(this.position, Point(xs[index], ITEM_SIZES.DIAMETER + ITEM_SIZES.SPACE.y)),
      parentPosition: this.position,
    }))
  }

  get link() {
    if (this.parentPosition && this.parent) {
      let terminal = Point$.Subtract(this.parentPosition, this.position)
      let angle = Point$.Angle(terminal)
      let xFrom = Point$.Length(terminal) - ITEM_SIZES.DIAMETER / 2
      let xTo = ITEM_SIZES.DIAMETER / 2
      let children = [PolylineItem({
        points: [Point(xFrom, 0), Point(xTo, 0)],
        stroke: this.item.action === this.parent.action ? ACTION_STROKES[this.item.action] : ACTION_STROKES[UniqueAction.None],
      })] as Array<PaperItemObject>
      if (this.item.action === UniqueAction.Swap && this.parent.action === UniqueAction.Swap) {
        let arrowFrom = RegularPolygonItem({
          radius: ITEM_SIZES.SPACE.x,
          sides: 3,
          coordinate: Coordinate({ position: Point(xFrom - ITEM_SIZES.SPACE.x, 0), rotation: Math.PI / 2 }),
          brush: INDICATOR_BRUSH,
          stroke: INDICATOR_STROKE,
        })
        let arrowTo = RegularPolygonItem({
          radius: ITEM_SIZES.SPACE.x,
          sides: 3,
          coordinate: Coordinate({ position: Point(xTo + ITEM_SIZES.SPACE.x, 0), rotation: -Math.PI / 2 }),
          brush: INDICATOR_BRUSH,
          stroke: INDICATOR_STROKE,
        })
        children.push(arrowFrom, arrowTo)
      }
      return GroupItem({ children, coordinate: Coordinate({ rotation: angle }) })
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

  mounted() {
    this.OnResize(this.width)
  }
}
</script>
