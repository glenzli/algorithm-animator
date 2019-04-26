<template>
  <p-item :element="visual"></p-item>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { ObservableArrayItem, ObservableState } from '../model'
import { Arrayex } from 'arrayex'
import { RectangleItem, PointTextItem, GroupItem, RegularPolygonItem, Point, SolidBrush, Color$, Stroke, Coordinate } from 'paper-vueify'

const RECTSZ = 36
const SPACESZ = RECTSZ + 1

function ToString(val: any) {
  if (typeof val === 'number') {
    return Number.isNaN(val) ? '' : val.toString()
  }
  return val.toString()
}

@Component
export default class ArrayItemVisualizer extends Vue {
  @Prop({ required: true }) item!: ObservableArrayItem<any>
  @Prop({ required: true }) index!: number
  @Prop({ required: true }) total!: number
  @Prop({ default: false }) seperated!: boolean
  @Prop({ default: false }) pointer!: boolean
  @Prop({ default: 0 }) yBase!: number
  @Prop({ default: () => ['#3c6387', '#ad2020', '#d8c513', '#764891'] }) colors!: Array<string>

  get offset() {
    return -Math.floor(((this.total - 1) * SPACESZ + RECTSZ) / 2)
  }

  get x() {
    return this.offset + SPACESZ * this.index
  }

  get y() {
    return (this.seperated ? -SPACESZ : 0) + ((this.item.state === ObservableState.Emphasized) ? -Math.floor(SPACESZ / 2) : 0) + this.yBase
  }

  get box() {
    return RectangleItem({
      size: Point(RECTSZ, RECTSZ),
      brush: SolidBrush(Color$.ToColor(this.colors[this.item.state])),
      stroke: Stroke({ thickness: 0 }),
      coordinate: Coordinate({ position: Point(this.x, this.y) }),
    })
  }

  get label() {
    return PointTextItem({
      fontSize: 24,
      fontFamily: 'Titillium Web',
      justification: 'center',
      content: ToString(this.item.value),
      brush: SolidBrush(Color$.ToColor('#eee')),
      coordinate: Coordinate({ position: Point(this.x, 9 + this.y) }),
    })
  }

  get pointerMark() {
    return RegularPolygonItem({
      radius: 10,
      sides: 3,
      brush: SolidBrush(Color$.ToColor(this.colors[2])),
      stroke: Stroke({ thickness: 0 }),
      coordinate: Coordinate({ position: Point(this.x, SPACESZ + this.y) }),
    })
  }

  get visual() {
    let children = Arrayex.NonNull([this.box, this.label, this.pointer ? this.pointerMark : null])
    return GroupItem({ children })
  }
}
</script>
