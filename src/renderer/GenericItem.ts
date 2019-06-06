import Vue from 'vue'
import { Component, Prop, Inject } from 'vue-property-decorator'
import { PointObject, Coordinate, PointTextItem, GroupItem, PaperItemObject } from 'paper-vueify'
import { ValueItem, UniqueAttribute } from '../model'
import { ItemHelpers, ITEM_SIZES, ACTION_BRUSHES, TEXT_BRUSH, STATE_STROKES } from './Defs'

const STATE_CONTENTS = ['', '≺', '≼', '≻', '≽', '=', '≈']

@Component
export class GenericItemMixin extends Vue {
  @Prop({ required: true }) item!: ValueItem<any>
  @Prop({ required: true }) position!: PointObject

  @Inject({ default: null }) quantizer!: ((val: any) => number) | null

  get diameter() {
    return (this.item.attribute === UniqueAttribute.Emphasize ? ITEM_SIZES.SPACE.x * 2 : 0) + ITEM_SIZES.DIAMETER
  }

  get labelContent() {
    return ItemHelpers.ToLabel(this.item.value)
  }

  get opacity() {
    let factor = (this.item.attribute === UniqueAttribute.Ignore || !this.labelContent) ? 0.1 : 1
    return (this.quantizer ? (this.quantizer(this.item.value) * 0.6 + 0.4) : 1) * factor
  }

  get boxStyle() {
    return {
      brush: ACTION_BRUSHES[this.item.action],
      stroke: STATE_STROKES[this.item.state],
    }
  }

  get label() {
    return PointTextItem({
      fontSize: ITEM_SIZES.TEXT,
      fontFamily: 'Titillium Web',
      justification: 'center',
      content: this.labelContent,
      brush: TEXT_BRUSH,
      coordinate: ITEM_SIZES.TEXT_BIAS,
    })
  }

  get stateLabelProps() {
    let content = STATE_CONTENTS[this.item.state] || ''
    if (content) {
      return {
        fontSize: ITEM_SIZES.TEXT,
        fontFamily: 'Titillium Web',
        justification: 'center' as 'center',
        content,
        brush: STATE_STROKES[this.item.state].brush,
      }
    }
    return null
  }

  get parts() {
    return [] as Array<PaperItemObject | null>
  }

  get visual() {
    return GroupItem({ children: this.parts.filter(c => !!c) as Array<PaperItemObject>, opacity: this.opacity, coordinate: Coordinate({ position: this.position }) })
  }
}
