<template>
  <div>
    <array-item-renderer v-for="(item, index) in array" :key="index" :item="item" :index="index" :length="length" :position="position"></array-item-renderer>
    <template v-if="locators">
      <p-item v-for="(locator, index) in locators" :key="`l${index}`" :element="locator"></p-item>
    </template>
    <p-item v-if="partition" :element="partition"></p-item>
    <template v-if="seperators">
      <p-item v-for="(seperator, index) in seperators" :key="`s${index}`" :element="seperator"></p-item>
    </template>
    <p-item v-if="indicator" :element="indicator"></p-item>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { Arrayex } from 'arrayex'
import { RegularPolygonItem, PolylineItem, RectangleItem, GroupItem, SolidBrush, NoneBrush, PointObject, Color$, Stroke, Coordinate, Point } from 'paper-vueify'
import ArrayItemRenderer from './ArrayItemRenderer.vue'
import { ArrayItem, ObservableArrayState, ArrayItemState } from '../model'
import { NODESIZE, NODESIZE_X_PLUS, GetArrayItemOffset, NODESPACE_X } from './defs'

const SHARE_BRUSH = SolidBrush(Color$.ToColor('#405f60'))
const SHARE_STROKE = Stroke({ thickness: 1, brush: SHARE_BRUSH, dash: [NODESPACE_X, NODESPACE_X] })
const SHARE_STROKE_SOLID = Stroke({ thickness: 1, brush: SHARE_BRUSH })

@Component({
  components: { ArrayItemRenderer },
})
export default class ArrayRenderer extends Vue {
  @Prop({ required: true }) array!: Array<ArrayItem<any>>
  @Prop({ default: () => ({}) }) state!: ObservableArrayState
  @Prop({ default: () => Point(0, 0) }) position!: PointObject

  get length() {
    return this.array.length
  }

  get offset() {
    return GetArrayItemOffset(this.length)
  }

  get locators() {
    if (this.state.locators && this.state.locators.length > 0 && this.array.length > 0) {
      return Arrayex.NonNull(this.state.locators!.map(index => {
        if (index > -1 && index < this.array.length) {
          let x = this.offset + NODESIZE_X_PLUS * index
          return RegularPolygonItem({
            radius: 10,
            sides: 3,
            brush: SolidBrush(Color$.ToColor('#405f60')),
            stroke: Stroke({ thickness: 0 }),
            coordinate: Coordinate({ position: Point(x + this.position.x, NODESIZE_X_PLUS + this.position.y) }),
          })
        }
      }))
    } else {
      return null
    }
  }

  get partition() {
    if (this.state.partition && this.state.partition[1] > this.state.partition[0]) {
      let width = (this.state.partition[1] - this.state.partition[0] + 1) * NODESIZE_X_PLUS
      let left = this.state.partition[0] * NODESIZE_X_PLUS + this.offset + width / 2 - NODESIZE_X_PLUS / 2
      return RectangleItem({
        size: Point(width, NODESIZE_X_PLUS + NODESPACE_X),
        coordinate: Coordinate({ position: Point(left, 0) }),
        brush: NoneBrush(),
        stroke: SHARE_STROKE,
      })
    }
    return null
  }

  get seperators() {
    if (this.state.seperators && this.state.seperators.length > 0) {
      return this.state.seperators!.filter(index => index > -1).map(index => {
        let x = this.offset + (index + 0.5) * NODESIZE_X_PLUS
        return PolylineItem({
          points: [Point(x, -NODESIZE_X_PLUS * 1.2), Point(x, NODESIZE_X_PLUS * 1.2)],
          stroke: SHARE_STROKE,
          coordinate: Coordinate({ position: this.position }),
        })
      })
    }
    return null
  }

  get indicator() {
    let indexes = Arrayex.Create(this.array.length, index => index)
    let dynamics = indexes.filter(index => {
      let state = this.array[index].state
      return state >= ArrayItemState.Swapping && state <= ArrayItemState.MovingTo
    })
    if (dynamics.length === 2) {
      let from = this.array[dynamics[0]].state === ArrayItemState.MovingFrom ? 0 : 1
      let isMoving = this.array[dynamics[0]].state !== ArrayItemState.Swapping
      let xFrom = this.offset + dynamics[from] * NODESIZE_X_PLUS
      let xTo = this.offset + (dynamics[1 - from]  - (isMoving ? 0.5 : 0)) * NODESIZE_X_PLUS
      if (Math.abs(xTo - xFrom) > NODESIZE_X_PLUS || !isMoving) {
        // create indicator
        let spline = PolylineItem({
          points: [Point(xFrom, -NODESIZE / 2), Point(xFrom, -NODESIZE_X_PLUS), Point(xTo, -NODESIZE_X_PLUS), Point(xTo, -NODESIZE / 2)],
          stroke: SHARE_STROKE_SOLID,
        })
        let arrowTo = RegularPolygonItem({
          radius: NODESPACE_X,
          sides: 3,
          coordinate: Coordinate({ position: Point(xTo, -NODESIZE / 2 - Math.ceil(NODESPACE_X / 2 * Math.sqrt(3))), rotation: Math.PI }),
          brush: SHARE_BRUSH,
          stroke: SHARE_STROKE_SOLID,
        })
        let arrowFrom = isMoving ? null : RegularPolygonItem({
          radius: NODESPACE_X,
          sides: 3,
          coordinate: Coordinate({ position: Point(xFrom, -NODESIZE / 2 - Math.ceil(NODESPACE_X / 2 * Math.sqrt(3))), rotation: Math.PI }),
          brush: SHARE_BRUSH,
          stroke: SHARE_STROKE_SOLID,
        })
        return GroupItem({ children: Arrayex.NonNull([spline, arrowFrom, arrowTo]), coordinate: Coordinate({ position: this.position }) })
      }
    }
    return null
  }
}
</script>
