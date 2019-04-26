<template>
  <p-item :element="visual"></p-item>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { ObservableArrayItem, ObservableState } from '../model'
import { RectangleItem, PointTextItem, GroupItem, RegularPolygonItem, Point, SolidBrush, Color$, Stroke, Coordinate } from 'paper-vueify'
import { ARRAYITEM_SIZE, ARRAYITEM_TOTAL, ARRAYITEM_OFFSET } from './defs'

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
  @Prop({ required: true }) length!: number
  @Prop({ default: 0 }) y!: number
  @Prop({ default: () => ['#3c6387', '#ad2020', '#d8c513', '#764891'] }) colors!: Array<string>

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
      coordinate: Coordinate({ position: Point(this.x, ARRAYITEM_TOTAL + this.y) }),
    })
  }

  get visual() {
    return GroupItem({ children: [this.box, this.label] })
  }
}
</script>
