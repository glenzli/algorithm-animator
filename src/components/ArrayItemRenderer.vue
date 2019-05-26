<template>
  <p-item :element="visual"></p-item>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject } from 'vue-property-decorator'
import { ArrayItem } from '../model'
import { RectangleItem, PointTextItem, GroupItem, Point, SolidBrush, Color$, Stroke, Coordinate, PointObject } from 'paper-vueify'
import { NODESIZE, NODESIZE_X_PLUS, NODETEXT, GetArrayItemOffset, ToLabel } from './defs'

@Component
export default class ArrayItemRenderer extends Vue {
  @Prop({ required: true }) item!: ArrayItem<any>
  @Prop({ required: true }) index!: number
  @Prop({ required: true }) length!: number
  @Prop({ default: () => Point(0, 0) }) position!: PointObject
  @Prop({ default: () => ['#3c6387', '#ad2020', '#d15a10', '#764891', '#8e8d27', '#5c8742'] }) colors!: Array<string>

  @Inject({ default: null }) quantizer!: ((val: any) => number) | null

  get offset() {
    return GetArrayItemOffset(this.length)
  }

  get x() {
    return this.offset + NODESIZE_X_PLUS * this.index
  }

  get box() {
    return RectangleItem({
      size: Point(NODESIZE, NODESIZE),
      brush: SolidBrush(Color$.ToColor(this.colors[this.item.state])),
      stroke: Stroke({ thickness: 0 }),
      coordinate: Coordinate({ position: Point(this.x, 0) }),
    })
  }

  get label() {
    return PointTextItem({
      fontSize: NODETEXT,
      fontFamily: 'Titillium Web',
      justification: 'center',
      content: ToLabel(this.item.value),
      brush: SolidBrush(Color$.ToColor('#eee')),
      coordinate: Coordinate({ position: Point(this.x, Math.ceil(NODETEXT / 3)) }),
    })
  }

  get visual() {
    let opacity = this.quantizer ? (this.quantizer(this.item.value) * 0.8 + 0.2) : 1
    return GroupItem({ children: [this.box, this.label], opacity, coordinate: Coordinate({ position: this.position }) })
  }
}
</script>
