import { ObservableBinaryHeap, ObservableBinaryHeapState } from '../BinaryHeap'

describe('BinaryHeap', () => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8]
  const state = { count: 0 } as ObservableBinaryHeapState
  const oh1 = new ObservableBinaryHeap(data, state, Number.NaN, (n1, n2) => n1 - n2, Number.isNaN)

  test('New', () => {
    expect(oh1.data.map(v => v.value)).toEqual([Number.NaN, 1, 2, 3, 4, 5, 6, 7, 8, ...new Array(7).fill(Number.NaN)])
  })
})
