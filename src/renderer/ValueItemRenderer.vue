<template>
  <p-item :element="visual"></p-item>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Point, Point$, Coordinate, RectangleItem, PointTextItem } from 'paper-vueify'
import { ITEM_SIZES } from './Defs'
import { GenericItemMixin } from './GenericItem'

@Component
export default class ValueItemRenderer extends Mixins(GenericItemMixin) {
  get box() {
    return RectangleItem({
      size: Point(this.diameter, this.diameter),
      ...this.boxStyle,
    })
  }

  get stateLabel() {
    if (this.stateLabelProps) {
      return PointTextItem({
        ...this.stateLabelProps,
        coordinate: Coordinate({ position: Point$.Add(ITEM_SIZES.TEXT_BIAS.position, Point(0, ITEM_SIZES.DIAMETER + ITEM_SIZES.SPACE.x)) }),
      })
    }
    return null
  }

  get parts() {
    return [this.box, this.label, this.stateLabel]
  }
}
</script>

