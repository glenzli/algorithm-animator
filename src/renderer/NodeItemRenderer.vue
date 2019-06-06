<template>
  <div>
    <node-item-renderer v-for="(child, index) in children" :key="index" :tid="tid" :node="child.node" :item="child.item" :position="child.position" :cIndex="index" @resize="OnChildResize"></node-item-renderer>
    <p-item :element="visual"></p-item>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { Point, Point$, Coordinate, CircleItem, PointTextItem } from 'paper-vueify'
import { ITEM_SIZES } from './Defs'
import { GenericItemMixin } from './GenericItem'
import { Algorithm, TreeFormADT, AbstractData } from '../model'

@Component({
  name: 'node-item-renderer',
})
export default class NodeItemRenderer extends Mixins(GenericItemMixin) {
  @Prop({ required: true }) tid!: number
  @Prop({ required: true }) node!: any
  @Prop({ default: -1 }) cIndex!: number

  width = 0
  childWidths = {} as { [index: number]: number }

  get box() {
    return CircleItem({
      radius: this.diameter / 2,
      ...this.boxStyle,
    })
  }

  get stateLabel() {
    if (this.stateLabelProps) {
      return PointTextItem({
        ...this.stateLabelProps,
        coordinate: Coordinate({ position: Point$.Subtract(ITEM_SIZES.TEXT_BIAS.position, Point(0, ITEM_SIZES.DIAMETER + ITEM_SIZES.SPACE.x)) }),
      })
    }
    return null
  }

  get parts() {
    return [this.box, this.label, this.stateLabel]
  }

  get isLeaf() {
    return (Algorithm.From(this.tid).adt as TreeFormADT<AbstractData, any, any>).IsLeaf(this.node)
  }

  get children() {
    let tree = Algorithm.From(this.tid).adt as TreeFormADT<any, any, any>
    let nodes = tree.Children(this.node)
    let widths = nodes.map(node => this.NodeWidth(node))
    let xs = [-this.CombineWidth(widths) / 2 + widths[0] / 2]
    for (let i = 1; i < widths.length; ++i) {
      xs.push(xs[i - 1] + (widths[i - 1] + widths[i]) / 2 + ITEM_SIZES.SPACE.x)
    }
    let nonEmpty = nodes.map((node, index) => ({ node, x: xs[index] })).filter(n => n.node != null)
    return nonEmpty.map(n => ({ node: n.node, item: tree.ValueOf(n.node), position: Point$.Add(this.position, Point(n.x, ITEM_SIZES.DIAMETER + ITEM_SIZES.SPACE.y)) }))
  }

  OnChildResize(cIndex: number, width: number) {
    Vue.set(this.childWidths, cIndex, width)
  }

  mounted() {
    if (this.isLeaf) {
      this.width = ITEM_SIZES.DIAMETER
    }
    this.$emit('resize', this.cIndex, this.width)
  }

  CombineWidth(widths: Array<number>) {
    return Math.max(1, widths.length - 1) * ITEM_SIZES.SPACE.x + widths.reduce((w1, w2) => w1 + w2)
  }

  NodeWidth(node: any): number {
    if (node != null) {
      let tree = Algorithm.From(this.tid).adt as TreeFormADT<any, any, any>
      if (tree.IsLeaf(node)) {
        return ITEM_SIZES.DIAMETER
      } else {
        let children = tree.Children(node)
        return this.CombineWidth(children.map(c => this.NodeWidth(c)))
      }
    }
    return 0
  }
}
</script>
