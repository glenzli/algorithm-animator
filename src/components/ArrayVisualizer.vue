<template>
  <div>
    <array-item-visualizer v-for="(item, index) in array" :key="index" :item="item" :index="index" :length="length" :y="y"></array-item-visualizer>
    <template v-if="locators">
      <p-item v-for="(locator, index) in locators" :key="`l${index}`" :element="locator"></p-item>
    </template>
    <p-item v-if="partition" :element="partition"></p-item>
    <template v-if="seperators">
      <p-item v-for="(seperator, index) in seperators" :key="`s${index}`" :element="seperator"></p-item>
    </template>
    <p-item v-if="swapIndicator" :element="swapIndicator"></p-item>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { Arrayex } from 'arrayex'
import { RegularPolygonItem, PolylineItem, RectangleItem, SolidBrush, NoneBrush, Color$, Stroke, Coordinate, Point } from 'paper-vueify'
import ArrayItemVisualizer from './ArrayItemVisualizer.vue'
import { ObservableArrayItem, ObservableArrayState, ObservableState } from '../model'
import { ARRAYITEM_SIZE, ARRAYITEM_TOTAL, ARRAYITEM_OFFSET, ARRAYITEM_SPACE } from './defs'

const SHARE_STROKE = Stroke({ thickness: 1, brush: SolidBrush(Color$.ToColor('#405f60')), dash: [ARRAYITEM_SPACE, ARRAYITEM_SPACE] })
const SHARE_STROKE_SOLID = Stroke({ thickness: 1, brush: SolidBrush(Color$.ToColor('#405f60')) })

@Component({
  components: { ArrayItemVisualizer },
})
export default class ArrayVisualizer extends Vue {
  @Prop({ required: true }) array!: Array<ObservableArrayItem<any>>
  @Prop({ default: () => ({}) }) state!: ObservableArrayState
  @Prop({ default: 0 }) y!: number

  get length() {
    return this.array.length
  }

  get offset() {
    return ARRAYITEM_OFFSET(this.length)
  }

  get locators() {
    if (this.state.locators && this.state.locators.length > 0 && this.array.length > 0) {
      return Arrayex.NonNull(this.state.locators!.map(index => {
        if (index > -1 && index < this.array.length) {
          let x = this.offset + ARRAYITEM_TOTAL * index
          return RegularPolygonItem({
            radius: 10,
            sides: 3,
            brush: SolidBrush(Color$.ToColor('#405f60')),
            stroke: Stroke({ thickness: 0 }),
            coordinate: Coordinate({ position: Point(x, ARRAYITEM_TOTAL + this.y) }),
          })
        }
      }))
    } else {
      return null
    }
  }

  get partition() {
    if (this.state.partition && this.state.partition[1] > this.state.partition[0]) {
      let width = (this.state.partition[1] - this.state.partition[0] + 1) * ARRAYITEM_TOTAL
      let left = this.state.partition[0] * ARRAYITEM_TOTAL + this.offset + width / 2 - ARRAYITEM_TOTAL / 2
      return RectangleItem({
        size: Point(width, ARRAYITEM_TOTAL + ARRAYITEM_SPACE),
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
        let x = this.offset + (index + 0.5) * ARRAYITEM_TOTAL
        return PolylineItem({
          points: [Point(x, -ARRAYITEM_TOTAL * 2), Point(x, ARRAYITEM_TOTAL * 2)],
          stroke: SHARE_STROKE,
        })
      })
    }
    return null
  }

  get swapIndicator() {
    let swapping = Arrayex.Create(this.array.length, index => index).filter(index => this.array[index].state === ObservableState.Moving)
    if (swapping.length === 2) {
      let xFrom = this.offset + swapping[0] * ARRAYITEM_TOTAL
      let xTo = this.offset + swapping[1] * ARRAYITEM_TOTAL
      return PolylineItem({
        points: [Point(xFrom, -ARRAYITEM_SIZE / 2), Point(xFrom, -ARRAYITEM_TOTAL), Point(xTo, -ARRAYITEM_TOTAL), Point(xTo, -ARRAYITEM_SIZE / 2)],
        stroke: SHARE_STROKE_SOLID,
      })
    }
    return null
  }
}
</script>
