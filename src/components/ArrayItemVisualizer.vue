<template>
  <p-item :element="visual"></p-item>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject } from 'vue-property-decorator'
import { ObservableArrayItem, ObservableState } from '../model'
import { RectangleItem, PointTextItem, GroupItem, Point, SolidBrush, Color$, Stroke, Coordinate, PointObject } from 'paper-vueify'
import { ARRAYITEM_SIZE, ARRAYITEM_TOTAL, ARRAYITEM_OFFSET } from './defs'

function ToLabel(val: any) {
  if (typeof val === 'number') {
    return Number.isNaN(val) ? '' : val.toString()
  }
  return val.toString()
}

@Component
export default class ArrayItemVisualizer extends Vue {
  @Prop({ required: true }) item!: ObservableArrayItem<any>
  @Prop({ required: true }) index!: number
  @Prop({ required: true }) length!: number
  @Prop({ default: () => Point(0, 0) }) position!: PointObject
  @Prop({ default: () => ['#3c6387', '#ad2020', '#d8c513', '#764891', '#764891', '#764891'] }) colors!: Array<string>

  @Inject({ default: null }) quantizer!: ((val: any) => number) | null

  get offset() {
    return ARRAYITEM_OFFSET(this.length)
  }

  get x() {
    return this.offset + ARRAYITEM_TOTAL * this.index
  }

  get box() {
    return RectangleItem({
      size: Point(ARRAYITEM_SIZE, ARRAYITEM_SIZE),
      brush: SolidBrush(Color$.ToColor(this.colors[this.item.state])),
      stroke: Stroke({ thickness: 0 }),
      coordinate: Coordinate({ position: Point(this.x, 0) }),
    })
  }

  get label() {
    return PointTextItem({
      fontSize: 24,
      fontFamily: 'Titillium Web',
      justification: 'center',
      content: ToLabel(this.item.value),
      brush: SolidBrush(Color$.ToColor('#eee')),
      coordinate: Coordinate({ position: Point(this.x, 9) }),
    })
  }

  get visual() {
    let opacity = this.quantizer ? (this.quantizer(this.item.value) * 0.5 + 0.5) : 1
    return GroupItem({ children: [this.box, this.label], opacity, coordinate: Coordinate({ position: this.position }) })
  }
}
</script>
