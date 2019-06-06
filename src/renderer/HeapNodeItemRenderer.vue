<template>
  <p-item :element="visual"></p-item>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { Point, PointObject, Point$, Coordinate, CircleItem, PolylineItem, PointTextItem, RegularPolygonItem, PaperItemObject, GroupItem, Stroke } from 'paper-vueify'
import { UniqueAction, ValueItem, UniqueState, UniqueAttribute } from '../model'
import { ITEM_SIZES, ACTION_BRUSHES, ACTION_STROKES } from './Defs'
import { GenericItemMixin } from './GenericItem'

const INDICATOR_BRUSH = ACTION_BRUSHES[UniqueAction.Swap]
const INDICATOR_STROKE = Stroke({ thickness: 0 })

@Component
export default class HeapNodeItemRenderer extends Mixins(GenericItemMixin) {
  @Prop({ default: null }) parent!: ValueItem<any>
  @Prop({ default: null }) parentPosition!: PointObject | null

  get box() {
    return CircleItem({
      radius: this.diameter / 2,
      ...this.boxStyle,
    })
  }

  get stateLabel() {
    if (this.stateLabelProps) {
      return PointTextItem({
        ...this.stateLabelProps,
        coordinate: Coordinate({ position: Point$.Subtract(ITEM_SIZES.TEXT_BIAS.position, Point(0, ITEM_SIZES.DIAMETER + ITEM_SIZES.SPACE.x)) }),
      })
    }
    return null
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

  get parts() {
    return [this.link, this.box, this.label, this.stateLabel]
  }
}
</script>