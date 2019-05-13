<template>
  <p-item :element="visual"></p-item>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject } from 'vue-property-decorator'
import { ArrayItem, Operation } from '../model'
import { RectangleItem, PointTextItem, GroupItem, Point, SolidBrush, Color$, Stroke, Coordinate, PointObject } from 'paper-vueify'
import { ARRAY_ITEM_SIZE, ARRAY_ITEM_TOTAL, ARRAY_ITEM_TEXT, GetArrayItemOffset, ToLabel } from './defs'

@Component
export default class ArrayItemRenderer extends Vue {
  @Prop({ required: true }) item!: ArrayItem<any>
  @Prop({ required: true }) index!: number
  @Prop({ required: true }) length!: number
  @Prop({ default: () => Point(0, 0) }) position!: PointObject
  @Prop({ default: () => ['#3c6387', '#ad2020', '#d15a10', '#764891', '#764891', '#764891'] }) colors!: Array<string>

  @Inject({ default: null }) quantizer!: ((val: any) => number) | null

  get offset() {
    return GetArrayItemOffset(this.length)
  }

  get x() {
    return this.offset + ARRAY_ITEM_TOTAL * this.index
  }

  get box() {
    return RectangleItem({
      size: Point(ARRAY_ITEM_SIZE, ARRAY_ITEM_SIZE),
      brush: SolidBrush(Color$.ToColor(this.colors[this.item.state])),
      stroke: Stroke({ thickness: 0 }),
      coordinate: Coordinate({ position: Point(this.x, 0) }),
    })
  }

  get label() {
    return PointTextItem({
      fontSize: ARRAY_ITEM_TEXT,
      fontFamily: 'Titillium Web',
      justification: 'center',
      content: ToLabel(this.item.value),
      brush: SolidBrush(Color$.ToColor('#eee')),
      coordinate: Coordinate({ position: Point(this.x, Math.ceil(ARRAY_ITEM_TEXT / 3)) }),
    })
  }

  get visual() {
    let opacity = this.quantizer ? (this.quantizer(this.item.value) * 0.5 + 0.5) : 1
    return GroupItem({ children: [this.box, this.label], opacity, coordinate: Coordinate({ position: this.position }) })
  }
}
</script>
