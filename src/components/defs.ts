import { Point } from 'paper-vueify'

export const ARRAYITEM_SIZE = 36
export const ARRAYITEM_SPACE = 6
export const ARRAYITEM_TOTAL = ARRAYITEM_SIZE + ARRAYITEM_SPACE

export function ARRAYITEM_OFFSET(length: number) {
  return -Math.floor(((length - 1) * ARRAYITEM_TOTAL + ARRAYITEM_SIZE) / 2)
}

export const BINARYNODE_SIZE = 36
export const BINARYNODE_SPACE = 18
export const BINARYNODE_TOTAL = BINARYNODE_SIZE + BINARYNODE_SPACE

export function BINARYNODE_OFFSET(index: number) {
  let level = Math.floor(Math.log2(index))
  let y = level * BINARYNODE_TOTAL
  let total = Math.pow(2, level)
  let x = -Math.floor(((total - 1) * BINARYNODE_SIZE + BINARYNODE_SPACE) / 2) + (index - total) * BINARYNODE_TOTAL
  return Point(x, y)
}
