import { SolidBrush, Color$, Stroke, Point, Coordinate } from 'paper-vueify'

const ACTION_COLORS = [
  '#4f4f4f',
  '#3e6691',
  '#a03021',
  '#413aa3',
  '#6e3b9b',
  '#6c1c89',
  '#2c0b38',
]

const STATE_COLORS = [
  'rgba(0, 0, 0, 0)',
  '#7d8c35',
  '#7d8c35',
  '#b73631',
  '#b73631',
  'rgba(0, 0, 0, 0)',
  'rgba(0, 0, 0, 0)',
]

export const ACTION_BRUSHES = ACTION_COLORS.map(color => SolidBrush(Color$.ToColor(color)))
export const ACTION_STROKES = ACTION_BRUSHES.map(brush => Stroke({ brush, thickness: 2 }))
export const STATE_STROKES = STATE_COLORS.map(color => Stroke({ brush: SolidBrush(Color$.ToColor(color)), thickness: 2 }))
export const TEXT_BRUSH = SolidBrush(Color$.ToColor('#eee'))
export const STATE_NORMAL_STROKES = ACTION_BRUSHES.map(brush => Stroke({ thickness: 1, brush }))
export const STATE_ACTIVE_STROKES = ACTION_BRUSHES.map(brush => Stroke({ thickness: 3, brush }))
export const EMPTY_STROKE = Stroke({ thickness: 0 })

export const ITEM_SIZES = {
  DIAMETER: 28,
  SPACE: Point(5, 20),
  DIAMETER_SPACED: 33,
  TEXT: 18,
  TEXT_BIAS: Coordinate({ position: Point(0, 6) }),
}

export namespace ItemHelpers {
  export function ToLabel(val: any): string {
    if (typeof val === 'number') {
      if (Number.isNaN(val)) {
        return ''
      } else if (!Number.isFinite(val)) {
        return val > 0 ? '∞' : '-∞'
      }
    }
    return val != null ? val.toString() : ''
  }

  export function GetWidth(count: number) {
    return ITEM_SIZES.DIAMETER * count + ITEM_SIZES.SPACE.x * (count - 1)
  }

  export function GetOffsetX(count: number) {
    let width = GetWidth(count)
    return (-width + ITEM_SIZES.DIAMETER) / 2
  }

  export function GetHeight(treeHeight: number) {
    return ITEM_SIZES.DIAMETER * treeHeight + ITEM_SIZES.SPACE.y * (treeHeight - 1)
  }

  export function GetOffsetY(treeHeight: number) {
    let height = GetHeight(treeHeight)
    return (-height + ITEM_SIZES.DIAMETER) / 2
  }
}

