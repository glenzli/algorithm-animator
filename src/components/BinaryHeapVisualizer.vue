<template>
  <div>
    <array-item-visualizer v-for="(item, index) in heap" :key="index" :item="item" :index="index" :length="length" :position="position"></array-item-visualizer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { Arrayex } from 'arrayex'
import { RegularPolygonItem, PolylineItem, RectangleItem, GroupItem, SolidBrush, NoneBrush, PointObject, Color$, Stroke, Coordinate, Point } from 'paper-vueify'
import BinaryHeapItemVisualizer from './BinaryHeapItemVisualizer.vue'
import { ObservableBinaryHeapNode, ObservableState } from '../model'
import { BINARYNODE_SPACE } from './defs'

const SHARE_BRUSH = SolidBrush(Color$.ToColor('#405f60'))
const SHARE_STROKE = Stroke({ thickness: 1, brush: SHARE_BRUSH, dash: [BINARYNODE_SPACE, BINARYNODE_SPACE] })
const SHARE_STROKE_SOLID = Stroke({ thickness: 1, brush: SHARE_BRUSH })

@Component({
  components: { BinaryHeapItemVisualizer },
})
export default class BinaryHeapVisualizer extends Vue {
  @Prop({ required: true }) heap!: Array<ObservableBinaryHeapNode<any>>
  @Prop({ default: () => Point(0, 0) }) position!: PointObject

}
</script>
