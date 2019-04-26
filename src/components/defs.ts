export const ARRAYITEM_SIZE = 36
export const ARRAYITEM_SPACE = 6
export const ARRAYITEM_TOTAL = ARRAYITEM_SIZE + ARRAYITEM_SPACE

export function ARRAYITEM_OFFSET(length: number) {
  return -Math.floor(((length - 1) * ARRAYITEM_TOTAL + ARRAYITEM_SIZE) / 2)
}
