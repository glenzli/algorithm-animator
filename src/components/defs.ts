import { Point, PointObject } from 'paper-vueify'

export const ARRAY_ITEM_SIZE = 36
export const ARRAY_ITEM_SPACE = 6
export const ARRAY_ITEM_TOTAL = ARRAY_ITEM_SIZE + ARRAY_ITEM_SPACE
export const ARRAY_ITEM_TEXT = 24

export function GetArrayItemOffset(length: number) {
  return -Math.floor(((length - 1) * ARRAY_ITEM_TOTAL + ARRAY_ITEM_SIZE) / 2)
}

export const HEAP_NODE_SIZE = 36
export const HEAP_NODE_SPACE_X = 8
export const HEAP_NODE_SPACE_Y = 24
export const HEAP_NODE_TEXT = 24

export function GetHeapNodeOffset(index: number, count: number) {
  let level = Math.floor(Math.log2(index))
  let y = level * (HEAP_NODE_SIZE + HEAP_NODE_SPACE_Y)
  // compute x
  let maxLevel = Math.ceil(Math.log2(count + 1))
  let maxTotal = Math.pow(2, maxLevel)
  let baseOffset = -Math.floor(((maxTotal - 1) * HEAP_NODE_SIZE + maxTotal * HEAP_NODE_SPACE_X) / 4)
  let total = Math.pow(2, level)
  let x = baseOffset + (index - total + 0.5) * (maxTotal / total / 2) * (HEAP_NODE_SIZE + HEAP_NODE_SPACE_X)
  return Point(x, y)
}

export const BINARY_NODE_SIZE = 30
export const BINARY_NODE_SPACE_X = 2
export const BINARY_NODE_SPACE_Y = 6
export const BINARY_NODE_TEXT = 21

export function GetBinaryChildrenOffsets(position: PointObject, maxHeight: number, level: number) {
  let y = position.y + BINARY_NODE_SPACE_Y + BINARY_NODE_SIZE
  let xspace = ((BINARY_NODE_SIZE + BINARY_NODE_SPACE_X) / 2) * Math.pow(2, maxHeight - level - 1)
  return [Point(position.x - xspace, y), Point(position.x + xspace, y)]
}

export function ToLabel(val: any) {
  if (typeof val === 'number') {
    return (Number.isNaN(val) || !Number.isFinite(val)) ? '' : val.toString()
  }
  return val.toString()
}
