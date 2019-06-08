<template>
  <div v-if="abstractData.root">
    <p-item v-if="link" :element="link"></p-item>
    <node-item-renderer :item="abstractData.root" :position="rootPosition" @replace="OnReplace"></node-item-renderer>
    <value-item-renderer v-for="(active, index) in actives" :key="index" :item="active.item" :position="active.position"></value-item-renderer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { Point, PointObject, Point$, PolylineItem, RegularPolygonItem, Stroke, Coordinate, GroupItem } from 'paper-vueify'
import { TreeData, UniqueAction } from '../model'
import { ItemHelpers, ITEM_SIZES, ACTION_BRUSHES, ACTION_STROKES } from './Defs'
import NodeItemRenderer from './NodeItemRenderer.vue'
import ValueItemRenderer from './ValueItemRenderer.vue'

const REPLACE_STROKE = Stroke({ brush: ACTION_BRUSHES[UniqueAction.Swap], thickness: 2, dash: [ITEM_SIZES.SPACE.x, ITEM_SIZES.SPACE.x] })

@Component({
  components: { NodeItemRenderer, ValueItemRenderer },
})
export default class BinaryTreeRenderer extends Vue {
  @Prop({ required: true }) abstractData!: TreeData<any>
  @Prop({ default: () => Point(0, 0) }) position!: PointObject

  replaceState = false
  replacePosition = Point(0, 0)

  get rootPosition() {
    let y = ItemHelpers.GetOffsetY(this.abstractData.height)
    return Point$.Add(this.position, Point(0, y))
  }

  get actives() {
    return (this.abstractData.actives || []).map((item, index) => ({
      item,
      position: Point$.Add(this.rootPosition, Point(ITEM_SIZES.DIAMETER_SPACED * index, -ITEM_SIZES.DIAMETER - ITEM_SIZES.SPACE.y)),
    }))
  }

  get link() {
    if (this.abstractData.actives && this.replaceState) {
      let from = this.abstractData.actives.findIndex(active => active.action === UniqueAction.Move)
      if (from > -1) {
        let terminal = Point$.Subtract(this.replacePosition, this.actives[from].position)
        let xFrom = Point$.Length(terminal) - ITEM_SIZES.DIAMETER / 2
        let xTo = ITEM_SIZES.DIAMETER / 2
        let children = [PolylineItem({
          points: [Point(xFrom, 0), Point(xTo, 0)],
          stroke: REPLACE_STROKE,
        }), RegularPolygonItem({
          radius: ITEM_SIZES.SPACE.x,
          sides: 3,
          coordinate: Coordinate({ position: Point(xFrom - ITEM_SIZES.SPACE.x, 0), rotation: Math.PI / 2 }),
          brush: ACTION_BRUSHES[UniqueAction.Swap],
          stroke: ACTION_STROKES[UniqueAction.Swap],
        })]
        return GroupItem({ children, opacity: 0.4, coordinate: Coordinate({ position: this.actives[from].position, rotation: Point$.Angle(terminal) }) })
      }
    }
    return null
  }

  OnReplace(state: boolean, position: PointObject) {
    this.replaceState = state
    this.replacePosition = position
  }
}
</script>
