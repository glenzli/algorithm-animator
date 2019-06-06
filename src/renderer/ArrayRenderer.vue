<template>
  <div>
    <value-item-renderer v-for="(item, index) in items" :key="index" :item="item.value" :position="item.position"></value-item-renderer>
    <p-item v-if="partition" :element="partition"></p-item>
    <p-item v-if="indicator" :element="indicator"></p-item>
    <template v-if="seperators">
      <p-item v-for="(seperator, index) in seperators" :key="`s${index}`" :element="seperator"></p-item>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { Point, PointObject, Point$, PolylineItem, RegularPolygonItem, RectangleItem, GroupItem, Coordinate, SolidBrush, NoneBrush, Color$, Stroke } from 'paper-vueify'
import { ValueItem, UniqueAction, ArrayData } from '../model'
import { ItemHelpers, ITEM_SIZES, ACTION_BRUSHES } from './Defs'
import ValueItemRenderer from './ValueItemRenderer.vue'

const INDICATOR_BRUSH = ACTION_BRUSHES[UniqueAction.Swap]
const INDICATOR_STROKE = Stroke({ thickness: 1, brush: INDICATOR_BRUSH })
const PARTITION_BRUSH = NoneBrush()
const PARTITION_STROKE = Stroke({ thickness: 1, brush: ACTION_BRUSHES[UniqueAction.Select], dash: [ITEM_SIZES.SPACE.x, ITEM_SIZES.SPACE.x] })

@Component({
  components: { ValueItemRenderer },
})
export default class ArrayRenderer extends Vue {
  @Prop({ required: true }) abstractData!: ArrayData<any>
  @Prop({ default: () => Point(0, 0) }) position!: PointObject

  get offset() {
    return ItemHelpers.GetOffsetX((this.abstractData.array || []).length)
  }

  PositionOf(index: number) {
    return Point$.Add(Point(this.offset + ITEM_SIZES.DIAMETER_SPACED * index, 0), this.position)
  }

  get items() {
    let array = this.abstractData.array || []
    return array.map((item, index) => ({ value: item, position: this.PositionOf(index) }))
  }

  get partition() {
    if (this.abstractData.partition && this.abstractData.partition[1] > this.abstractData.partition[0]) {
      let width = (this.abstractData.partition[1] - this.abstractData.partition[0] + 1) * ITEM_SIZES.DIAMETER_SPACED
      let left = this.abstractData.partition[0] * ITEM_SIZES.DIAMETER_SPACED + this.offset + width / 2 - ITEM_SIZES.DIAMETER_SPACED / 2
      return RectangleItem({
        size: Point(width, ITEM_SIZES.DIAMETER + 2 * ITEM_SIZES.SPACE.x),
        coordinate: Coordinate({ position: Point$.Add(Point(left, 0), this.position) }),
        brush: PARTITION_BRUSH,
        stroke: PARTITION_STROKE,
      })
    }
    return null
  }

  get seperators() {
    if (this.abstractData.seperators && this.abstractData.seperators.length > 0) {
      return this.abstractData.seperators.filter(index => index > -1).map(index => {
        let position = this.PositionOf(index + 0.5)
        return PolylineItem({
          points: [Point(position.x, position.y - ITEM_SIZES.DIAMETER / 2 - ITEM_SIZES.SPACE.x), Point(position.x, position.y + ITEM_SIZES.DIAMETER / 2 + ITEM_SIZES.SPACE.x)],
          stroke: PARTITION_STROKE,
        })
      })
    }
    return []
  }

  get indicator() {
    if (this.abstractData.array) {
      let indexes = this.abstractData.array.map((_, index) => index)
      let dynamics = indexes.filter(index => {
        let action = this.abstractData.array[index].action
        return action >= UniqueAction.Swap && action <= UniqueAction.Target
      })
      if (dynamics.length === 2) {
        let from = this.abstractData.array[dynamics[0]].action === UniqueAction.Move ? 0 : 1
        let isMoving = this.abstractData.array[dynamics[0]].action !== UniqueAction.Swap
        let xFrom = this.PositionOf(dynamics[from]).x
        let xTo = this.PositionOf(dynamics[1 - from]).x - (isMoving ? 0.5 : 0) * ITEM_SIZES.DIAMETER_SPACED
        if (Math.abs(xTo - xFrom) > ITEM_SIZES.DIAMETER_SPACED || !isMoving) {
          // create indicator
          let spline = PolylineItem({
            points: [Point(xFrom, -ITEM_SIZES.DIAMETER / 2), Point(xFrom, -ITEM_SIZES.DIAMETER_SPACED), Point(xTo, -ITEM_SIZES.DIAMETER_SPACED), Point(xTo, -ITEM_SIZES.DIAMETER / 2)],
            stroke: INDICATOR_STROKE,
          })
          let arrowTo = RegularPolygonItem({
            radius: ITEM_SIZES.SPACE.x,
            sides: 3,
            coordinate: Coordinate({ position: Point(xTo, -ITEM_SIZES.DIAMETER / 2 - Math.ceil(ITEM_SIZES.SPACE.x / 2 * Math.sqrt(3))), rotation: Math.PI }),
            brush: INDICATOR_BRUSH,
            stroke: INDICATOR_STROKE,
          })
          let arrowFrom = isMoving ? null : RegularPolygonItem({
            radius: ITEM_SIZES.SPACE.x,
            sides: 3,
            coordinate: Coordinate({ position: Point(xFrom, -ITEM_SIZES.DIAMETER / 2 - Math.ceil(ITEM_SIZES.SPACE.x / 2 * Math.sqrt(3))), rotation: Math.PI }),
            brush: INDICATOR_BRUSH,
            stroke: INDICATOR_STROKE,
          })
          let children = [spline, arrowFrom, arrowTo].filter(c => c != null) as Array<any>
          return GroupItem({ children, coordinate: Coordinate({ position: Point(this.position.x, this.position.y - ITEM_SIZES.SPACE.x) }) })
        }
      }
    }
    return null
  }
}
</script>
