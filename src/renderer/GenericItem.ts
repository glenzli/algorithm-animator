import Vue from 'vue'
import { Array$ } from 'js-corelib'
import { Component, Prop, Inject } from 'vue-property-decorator'
import { PointObject, Coordinate, PointTextItem, GroupItem, PaperItemObject } from 'paper-vueify'
import { ValueItem, UniqueAttribute, UniqueAction } from '../model'
import { ItemHelpers, ITEM_SIZES, ACTION_BRUSHES, TEXT_BRUSH, STATE_STROKES } from './Defs'

const STATE_CONTENTS = ['', '≺', '≼', '≻', '≽', '=', '≈', '!']

@Component
export class GenericItemMixin extends Vue {
  @Prop({ required: true }) item!: ValueItem<any>
  @Prop({ required: true }) position!: PointObject

  @Inject({ default: null }) quantizer!: ((val: any) => number) | null

  GetDiameter(value: any, attribute: UniqueAttribute) {
    if (value != null) {
      return (attribute === UniqueAttribute.Emphasize ? ITEM_SIZES.SPACE.x * 2 : 0) + ITEM_SIZES.DIAMETER
    } else {
      return ITEM_SIZES.DIAMETER / 2
    }
  }

  get diameter() {
    return this.GetDiameter(this.item.value, this.item.attribute)
  }

  get labelContent() {
    return ItemHelpers.ToLabel(this.item.value)
  }

  get nilOpacity() {
    return 0.4
  }

  get nilBrush() {
    return ACTION_BRUSHES[UniqueAction.None]
  }

  get opacity() {
    if (this.item.value != null) {
      let factor = this.item.attribute === UniqueAttribute.Ignore ? 0.4 : 1
      return (this.quantizer ? (this.quantizer(this.item.value) * 0.6 + 0.4) : 1) * factor
    }
    return this.nilOpacity
  }

  get boxStyle() {
    return {
      brush: this.item.value != null ? ACTION_BRUSHES[this.item.action] : this.nilBrush,
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
    return GroupItem({ children: Array$.NonNull(this.parts), opacity: this.opacity, coordinate: Coordinate({ position: this.position }) })
  }
}
