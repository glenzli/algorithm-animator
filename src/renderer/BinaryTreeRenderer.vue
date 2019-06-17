<template>
  <div v-if="abstractData.root">
    <p-item v-for="(link, index) in links" :key="`l${index}`" :element="link"></p-item>
    <node-item-renderer :item="abstractData.root" :position="rootPosition" @tag="Tagging"></node-item-renderer>
    <value-item-renderer v-for="(active, index) in actives" :key="index" :item="active.item" :position="active.position"></value-item-renderer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { ObjectArray } from 'js-corelib'
import { Point, PointObject, Point$, PolylineItem, RegularPolygonItem, Stroke, Coordinate, GroupItem, PaperItemObject } from 'paper-vueify'
import { TreeData, UniqueAction, TreeNode } from '../model'
import { ItemHelpers, ITEM_SIZES, ACTION_BRUSHES, ACTION_STROKES } from './Defs'
import NodeItemRenderer from './NodeItemRenderer.vue'
import ValueItemRenderer from './ValueItemRenderer.vue'

const REPLACE_STROKE = Stroke({ brush: ACTION_BRUSHES[UniqueAction.Move], thickness: 2, dash: [ITEM_SIZES.SPACE.x, ITEM_SIZES.SPACE.x] })

@Component({
  components: { NodeItemRenderer, ValueItemRenderer },
})
export default class BinaryTreeRenderer extends Vue {
  @Prop({ required: true }) abstractData!: TreeData<any>
  @Prop({ default: () => Point(0, 0) }) position!: PointObject

  tags: ObjectArray<{ from: PointObject, to: PointObject, directional: boolean }> = {}

  get rootPosition() {
    let y = ItemHelpers.GetOffsetY(this.abstractData.height) + (ITEM_SIZES.DIAMETER - ITEM_SIZES.SPACE.y) / 2
    return Point$.Add(this.position, Point(0, y))
  }

  get actives() {
    let xOffset = ItemHelpers.GetOffsetX((this.abstractData.actives || []).length)
    return (this.abstractData.actives || []).map((item, index) => ({
      item,
      position: Point$.Add(this.rootPosition, Point(ITEM_SIZES.DIAMETER_SPACED * index + xOffset, -ITEM_SIZES.DIAMETER - ITEM_SIZES.SPACE.y)),
    }))
  }

  get links() {
    return Object.values(this.tags).map(tag => {
      let terminal = Point$.Subtract(tag.to, tag.from)
      if (Point$.Length(terminal) > 0) {
        let xFrom = Point$.Length(terminal) - ITEM_SIZES.DIAMETER / 2
        let xTo = ITEM_SIZES.DIAMETER / 2
        let children = [PolylineItem({
          points: [Point(xFrom, 0), Point(xTo, 0)],
          stroke: REPLACE_STROKE,
        })] as Array<PaperItemObject>
        if (tag.directional) {
          children.push(RegularPolygonItem({
            radius: ITEM_SIZES.SPACE.x,
            sides: 3,
            coordinate: Coordinate({ position: Point(xFrom - ITEM_SIZES.SPACE.x, 0), rotation: Math.PI / 2 }),
            brush: ACTION_BRUSHES[UniqueAction.Move],
            stroke: ACTION_STROKES[UniqueAction.Move],
          }))
        }
        return GroupItem({ children, opacity: 0.8, coordinate: Coordinate({ position: tag.from, rotation: Point$.Angle(terminal) }) })
      } else {
        return GroupItem()
      }
    })
  }

  Tagging(tag: number, position: PointObject) {
    let index = Math.round(tag)
    if (position) {
      if (this.tags[index]) {
        Vue.set(this.tags[index], tag !== index ? 'to' : 'from', position)
      } else {
        Vue.set(this.tags, index, { from: position, to: position, directional: true })
      }
      if (tag !== index) {
        this.tags[index].directional = tag > index
      }
    } else {
      Vue.delete(this.tags, index)
    }
  }
}
</script>
