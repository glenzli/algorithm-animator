<template>
  <p-item :element="visual"></p-item>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject } from 'vue-property-decorator'
import { Arrayex } from 'arrayex'
import { ObservableBinaryHeapNode, ObservableState, ObservableBinaryHeap } from '../model'
import { CircleItem, PointTextItem, GroupItem, PolylineItem, Point, PointObject, Point$, SolidBrush, Color$, Stroke, Coordinate } from 'paper-vueify'
import { BINARYNODE_OFFSET, BINARYNODE_SIZE, ToLabel } from './defs'

@Component
export default class BinaryHeapNodeVisualizer extends Vue {
  @Prop({ required: true }) node!: ObservableBinaryHeapNode<any>
  @Prop({ required: true }) heap!: Array<ObservableBinaryHeapNode<any>>
  @Prop({ required: true }) index!: number
  @Prop({ required: true }) count!: number
  @Prop({ default: () => Point(0, 0) }) position!: PointObject
  @Prop({ default: () => ['#3c6387', '#ad2020', '#d8c513', '#764891', '#764891', '#764891'] }) colors!: Array<string>

  @Inject({ default: null }) quantizer!: ((val: any) => number) | null

  get offset() {
    return Point$.Add(BINARYNODE_OFFSET(this.index, this.count), this.position)
  }

  get parentOffset() {
    return this.index > 1 ? Point$.Add(BINARYNODE_OFFSET(Math.floor(this.index / 2), this.count), this.position) : null
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
      content: ToLabel(this.node.value),
      brush: SolidBrush(Color$.ToColor('#eee')),
      coordinate: Coordinate({ position: Point(this.offset.x, 9 + this.offset.y) }),
    })
  }

  get isActiveWithParent() {
    if (this.index > 1) {
      return this.node.state > ObservableState.None && this.node.state === this.heap[Math.floor(this.index / 2)].state
    }
    return false
  }

  get link() {
    if (this.index > 1) {
      let direction = Point$.Subtract(this.parentOffset!, this.offset)
      let terminal = Point$.Add(Point$.Multiply(Point$.Normalize(direction), Point$.Length(direction) - BINARYNODE_SIZE / 2), this.offset)
      let state = this.isActiveWithParent ? this.node.state : ObservableState.None
      return PolylineItem({
        points: [this.offset, terminal],
        stroke: Stroke({ thickness: this.isActiveWithParent ? 3 : 1, brush: SolidBrush(Color$.ToColor(this.colors[state])) }),
      })
    }
    return null
  }

  get visual() {
    let opacity = this.quantizer ? (this.quantizer(this.node.value) * 0.5 + 0.5) : 1
    return GroupItem({ children: Arrayex.NonNull([this.link, this.box, this.label]), opacity })
  }
}
</script>
