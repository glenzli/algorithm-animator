import { ObservableState } from '../utils'
import { ObservableBinaryHeap, ObservableBinaryHeapState } from '../BinaryHeap'

describe('BinaryHeap', () => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8]
  const state = { count: 0 } as ObservableBinaryHeapState
  const oh1 = new ObservableBinaryHeap(data, state, Number.NaN, (n1, n2) => n1 - n2, Number.isNaN)

  test('New', () => {
    expect(oh1.data.map(v => v.value)).toEqual([Number.NaN, 1, 2, 3, 4, 5, 6, 7, 8, ...new Array(7).fill(Number.NaN)])
  })

  test('Peek', () => {
    expect(oh1.Peek()).toEqual(1)
  })

  test('Raw', () => {
    expect(oh1.Raw(0)).toEqual({ value: 1, state: ObservableState.None })
  })

  test('Get', () => {
    expect(oh1.Get(0, ObservableState.Accessed)).toEqual(1)
    expect(oh1.Raw(0).state).toEqual(ObservableState.Accessed)
  })

  test('Set', () => {
    oh1.Set(1, 2.5, ObservableState.Accessed)
    expect(oh1.Raw(1)).toEqual({ value: 2.5, state: ObservableState.Accessed })
  })

  test('State', () => {
    oh1.State(ObservableState.Selected, 3)
    expect(oh1.Raw(2).state).toEqual(ObservableState.Selected)
  })

  test('PartialRestore', () => {
    expect(oh1.data.some(v => v.state === ObservableState.Accessed)).toBeTruthy()
    expect(oh1.data.some(v => v.state === ObservableState.Selected)).toBeTruthy()
    oh1.PartialRestore(ObservableState.Accessed)
    expect(oh1.data.some(v => v.state === ObservableState.Accessed)).toBeFalsy()
    expect(oh1.data.some(v => v.state === ObservableState.Selected)).toBeTruthy()
  })

  test('Restore', () => {
    oh1.Restore()
    expect(oh1.data.every(v => v.state === ObservableState.None)).toBeTruthy()
  })

  test('InstantBuildHeap', () => {
    oh1.InstantBuildHeap()
    expect(oh1.data.map(v => v.value).slice(1, 9)).toEqual([8, 5, 7, 4, 1, 6, 3, 2.5])
  })

  test('Swap', async () => {
    await oh1.Swap(1, 2)
    expect(oh1.Raw(0)).toEqual({ value: 5, state: ObservableState.Accessed })
    expect(oh1.Raw(1)).toEqual({ value: 8, state: ObservableState.Accessed })
  })

  test('BuildHeap', async () => {
    await oh1.BuildHeap()
    expect(oh1.data.map(v => v.value).slice(1, 9)).toEqual([8, 5, 7, 4, 1, 6, 3, 2.5])
  })

  test('Insert', async () => {
    await oh1.Insert(12)
    expect(oh1.data.map(v => v.value).slice(1, 10)).toEqual([12, 8, 7, 5, 1, 6, 3, 2.5, 4])
  })

  test('Delete', async () => {
    await oh1.Delete()
    expect(oh1.data.map(v => v.value).slice(1, 9)).toEqual([8, 5, 7, 4, 1, 6, 3, 2.5])
  })
})
