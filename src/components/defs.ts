import { Point } from 'paper-vueify'

export const ARRAYITEM_SIZE = 36
export const ARRAYITEM_SPACE = 6
export const ARRAYITEM_TOTAL = ARRAYITEM_SIZE + ARRAYITEM_SPACE

export function ARRAYITEM_OFFSET(length: number) {
  return -Math.floor(((length - 1) * ARRAYITEM_TOTAL + ARRAYITEM_SIZE) / 2)
}

export const BINARYNODE_SIZE = 36
export const BINARYNODE_SPACE_X = 8
export const BINARYNODE_SPACE_Y = 24

export function BINARYNODE_OFFSET(index: number, count: number) {
  let level = Math.floor(Math.log2(index))
  let y = level * (BINARYNODE_SIZE + BINARYNODE_SPACE_Y)
  // compute x
  let maxLevel = Math.ceil(Math.log2(count + 1))
  let maxTotal = Math.pow(2, maxLevel)
  let baseOffset = -Math.floor(((maxTotal - 1) * BINARYNODE_SIZE + maxTotal * BINARYNODE_SPACE_X) / 4)
  let total = Math.pow(2, level)
  let x = baseOffset + (index - total + 0.5) * (maxTotal / total / 2) * (BINARYNODE_SIZE + BINARYNODE_SPACE_X)
  return Point(x, y)
}
