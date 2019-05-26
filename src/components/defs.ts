import { Point, PointObject } from 'paper-vueify'

export const NODESIZE = 28
export const NODESPACE_X = 3
export const NODESPACE_Y = 20
export const NODESIZE_X_PLUS = NODESIZE + NODESPACE_X
export const NODETEXT = 18

export function GetArrayItemOffset(length: number) {
  return -Math.floor(((length - 1) * NODESIZE_X_PLUS + NODESIZE) / 2 - NODESIZE / 2)
}

export function GetHeapNodeOffset(index: number, count: number) {
  let level = Math.floor(Math.log2(index))
  let y = level * (NODESIZE + NODESPACE_Y)
  // compute x
  let maxLevel = Math.ceil(Math.log2(count + 1))
  let maxTotal = Math.pow(2, maxLevel)
  let baseOffset = -Math.floor(((maxTotal - 1) * NODESIZE + maxTotal * NODESPACE_X) / 4)
  let total = Math.pow(2, level)
  let x = baseOffset + (index - total + 0.5) * (maxTotal / total / 2) * (NODESIZE + NODESPACE_X)
  return Point(x, y)
}

export function GetBinaryChildrenOffsets(position: PointObject, maxHeight: number, level: number) {
  let y = position.y + NODESPACE_Y + NODESIZE
  let xspace = ((NODESIZE + NODESPACE_X) / 2) * Math.pow(2, maxHeight - level - 1)
  return [Point(position.x - xspace, y), Point(position.x + xspace, y)]
}

export function ToLabel(val: any) {
  if (typeof val === 'number') {
    return (Number.isNaN(val) || !Number.isFinite(val)) ? '' : val.toString()
  }
  return val.toString()
}
