<template>
  <div>
    <p-item :element="visual"></p-item>
    <binary-node-renderer v-if="node.left.length > 0" :node="node.left[0]" :state="state" :parentNode="node" :position="childrenPositions[0]" :parentPosition="position"></binary-node-renderer>
    <binary-node-renderer v-if="node.right.length > 0" :node="node.right[0]" :state="state" :parentNode="node" :position="childrenPositions[1]" :parentPosition="position"></binary-node-renderer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject } from 'vue-property-decorator'
import { Arrayex } from 'arrayex'
import { CircleItem, PointTextItem, GroupItem, PolylineItem, Point, PointObject, Point$, SolidBrush, Color$, Stroke, Coordinate } from 'paper-vueify'
import { BinaryNode, BinaryNodeState, BinaryTreeState } from '../model'
import { BINARY_NODE_SIZE, BINARY_NODE_TEXT, GetBinaryChildrenOffsets, ToLabel } from './defs'

@Component({
  name: 'binary-node-renderer',
})
export default class BinaryNodeRenderer extends Vue {
  @Prop({ required: true }) node!: BinaryNode<any>
  @Prop({ required: true }) state!: BinaryTreeState
  @Prop({ default: null }) parentNode!: BinaryNode<any>
  @Prop({ default: () => Point(0, 0) }) position!: PointObject
  @Prop({ default: () => Point(0, 0) }) parentPosition!: PointObject
  @Prop({ default: () => ['#3c6387', '#ad2020', '#d15a10', '#764891', '#ad2020', '#ad2020'] }) colors!: Array<string>

  @Inject({ default: null }) quantizer!: ((val: any) => number) | null

  get childrenPositions() {
    return GetBinaryChildrenOffsets(this.position, this.state.height, this.node.level)
  }

  get box() {
    return CircleItem({
      radius: BINARY_NODE_SIZE / 2,
      brush: SolidBrush(Color$.ToColor(this.colors[this.node.state])),
      stroke: Stroke({ thickness: 0 }),
      coordinate: Coordinate({ position: this.position }),
    })
  }

  get label() {
    return PointTextItem({
      fontSize: BINARY_NODE_TEXT,
      fontFamily: 'Titillium Web',
      justification: 'center',
      content: ToLabel(this.node.value),
      brush: SolidBrush(Color$.ToColor('#eee')),
      coordinate: Coordinate({ position: Point(this.position.x, Math.ceil(BINARY_NODE_TEXT / 3) + this.position.y) }),
    })
  }

  get compareLabel() {
    if (this.node.state >= BinaryNodeState.Less) {
      let content = this.node.state === BinaryNodeState.Less ? '<' : '>'
      return PointTextItem({
        fontSize: BINARY_NODE_TEXT,
        fontFamily: 'Titillium Web',
        justification: 'center',
        content,
        brush: SolidBrush(Color$.ToColor(this.colors[this.node.state])),
        coordinate: Coordinate({ position: Point(this.position.x, Math.ceil(BINARY_NODE_TEXT / 3) + this.position.y - BINARY_NODE_SIZE) }),
      })
    }
    return null
  }

  get isActiveWithParent() {
    if (this.parentNode) {
      return this.node.state > BinaryNodeState.None && this.node.state === this.parentNode.state
    }
    return false
  }

  get link() {
    if (this.node.level > 0) {
      let direction = Point$.Subtract(this.parentPosition, this.position)
      let terminal = Point$.Add(Point$.Multiply(Point$.Normalize(direction), Point$.Length(direction) - BINARY_NODE_SIZE / 2), this.position)
      let state = this.isActiveWithParent ? this.node.state : BinaryNodeState.None
      return PolylineItem({
        points: [this.position, terminal],
        stroke: Stroke({ thickness: this.isActiveWithParent ? 3 : 1, brush: SolidBrush(Color$.ToColor(this.colors[state])) }),
      })
    }
  }

  get visual() {
    let opacity = this.quantizer ? (this.quantizer(this.node.value) * 0.5 + 0.5) : 1
    return GroupItem({ children: Arrayex.NonNull([this.link, this.box, this.label, this.compareLabel]), opacity })
  }
}


</script>