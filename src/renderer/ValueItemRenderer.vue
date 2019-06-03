<template>
  <p-item :element="visual"></p-item>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Inject } from 'vue-property-decorator'
import { PointObject, Point, Coordinate, RectangleItem, PointTextItem, GroupItem } from 'paper-vueify'
import { ValueItem } from '../model'
import { ItemHelpers, ITEM_SIZES, STATE_BRUSHES, TEXT_BRUSH, EMPTY_STROKE } from './Defs'

@Component
export default class ValueItemRenderer extends Vue {
  @Prop({ required: true }) item!: ValueItem<any>
  @Prop({ required: true }) position!: PointObject

  @Inject({ default: null }) quantizer!: ((val: any) => number) | null

  get box() {
    return RectangleItem({
      size: Point(ITEM_SIZES.DIAMETER, ITEM_SIZES.DIAMETER),
      brush: STATE_BRUSHES[this.item.action],
      stroke: EMPTY_STROKE,
    })
  }

  get label() {
    return PointTextItem({
      fontSize: ITEM_SIZES.TEXT,
      fontFamily: 'Titillium Web',
      justification: 'center',
      content: ItemHelpers.ToLabel(this.item.value),
      brush: TEXT_BRUSH,
      coordinate: ITEM_SIZES.TEXT_BIAS,
    })
  }

  get visual() {
    let opacity = this.quantizer ? (this.quantizer(this.item.value) * 0.8 + 0.2) : 1
    return GroupItem({ children: [this.box, this.label], opacity, coordinate: Coordinate({ position: this.position }) })
  }
}
</script>

