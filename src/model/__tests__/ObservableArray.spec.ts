import { Operation, Sleep } from '../utils'
import { ObservableArray } from '../ObservableArray'

describe('Array', () => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8]
  const oa1 = new ObservableArray(data)

  test('New', () => {
    expect(oa1.data.every(v => v.state === Operation.None)).toBeTruthy()
    expect(oa1.data.map(v => v.value)).toEqual(data)
  })

  test('State', () => {
    oa1.State(Operation.Selected, 0, 1)
    expect(oa1.data[0].state).toEqual(Operation.Selected)
    expect(oa1.data[1].state).toEqual(Operation.Selected)
  })

  test('PartialRestore', () => {
    oa1.State(Operation.Accessed, 2)
    expect(oa1.data.some(v => v.state === Operation.Accessed)).toBeTruthy()
    expect(oa1.data.some(v => v.state === Operation.Selected)).toBeTruthy()
    oa1.PartialRestore(Operation.Selected)
    expect(oa1.data.some(v => v.state === Operation.Accessed)).toBeTruthy()
    expect(oa1.data.some(v => v.state === Operation.Selected)).toBeFalsy()
  })

  test('Restore', () => {
    oa1.Restore()
    expect(oa1.data.every(v => v.state === Operation.None)).toBeTruthy()
  })

  test('Raw', () => {
    expect(oa1.Raw(0)).toEqual({ value: 1, state: Operation.None })
  })

  test('Get', () => {
    expect(oa1.Get(0, Operation.Accessed)).toEqual(1)
    expect(oa1.Raw(0).state).toEqual(Operation.Accessed)
  })

  test('Set', () => {
    oa1.Set(0, 2.5, Operation.Accessed)
    expect(oa1.Raw(0)).toEqual({ value: 2.5, state: Operation.Accessed })
  })

  test('Swap', async () => {
    await oa1.Swap(0, 1)
    expect(oa1.Get(0)).toEqual(2)
    expect(oa1.Raw(0).state).toEqual(Operation.Accessed)
    expect(oa1.Get(1)).toEqual(2.5)
    expect(oa1.Raw(1).state).toEqual(Operation.Accessed)
  })

  test('Move', async () => {
    await oa1.Move(7, 0)
    expect(oa1.Get(0)).toEqual(8)
    expect(oa1.Raw(0).state).toEqual(Operation.None)
    expect(oa1.Get(1)).toEqual(2)
    expect(oa1.Raw(1).state).toEqual(Operation.None)
  })

  test('Empty', () => {
    oa1.Empty()
    expect(oa1.length).toEqual(0)
  })

  test('Fill', () => {
    oa1.Fill(8, 1)
    expect(oa1.length).toEqual(8)
    expect(oa1.data.every(v => v.value === 1)).toBeTruthy()
  })

  test('From', () => {
    let data = ObservableArray.From([0, 0, 0])
    expect(data.length).toEqual(3)
    expect(data.every(v => v.value === 0)).toBeTruthy()
    expect(data.every(v => v.state === Operation.None)).toBeTruthy()
  })

  test('Numeric', () => {
    let data = ObservableArray.Numeric(20, [10, 20])
    expect(data.length).toEqual(20)
    expect(data.every(v => v.value >= 10 && v.value <= 20)).toBeTruthy()
    expect(data.every(v => v.state === Operation.None)).toBeTruthy()
  })
})
