<template>
  <p-node :element="visual"></p-node>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { ObservableBinaryHeapNode, ObservableState } from '../model'
import { CircleItem, PointTextItem, GroupItem, RegularPolygonItem, Point, PointObject, Point$, SolidBrush, Color$, Stroke, Coordinate } from 'paper-vueify'
import { BINARYNODE_OFFSET, BINARYNODE_SIZE } from './defs'

function ToString(val: any) {
  if (typeof val === 'number') {
    return Number.isNaN(val) ? '' : val.toString()
  }
  return val.toString()
}

@Component
export default class BinaryHeapNodeVisualizer extends Vue {
  @Prop({ required: true }) node!: ObservableBinaryHeapNode<any>
  @Prop({ required: true }) index!: number
  @Prop({ default: () => Point(0, 0) }) position!: PointObject
  @Prop({ default: () => ['#3c6387', '#ad2020', '#d8c513', '#764891', '#764891', '#764891'] }) colors!: Array<string>

  get offset() {
    return Point$.Add(BINARYNODE_OFFSET(this.index), this.position)
  }

  get box() {
    return CircleItem({
      radius: BINARYNODE_SIZE / 2,
      brush: SolidBrush(Color$.ToColor(this.colors[this.node.state])),
      stroke: Stroke({ thickness: 0 }),
      coordinate: Coordinate({ position: this.offset }),
    })
  }

  get label() {
    return PointTextItem({
      fontSize: 24,
      fontFamily: 'Titillium Web',
      justification: 'center',
      content: ToString(this.node.value),
      brush: SolidBrush(Color$.ToColor('#eee')),
      coordinate: Coordinate({ position: Point(this.offset.x, 9 + this.offset.y) }),
    })
  }

  get visual() {
    return GroupItem({ children: [this.box, this.label] })
  }
}
</script>
