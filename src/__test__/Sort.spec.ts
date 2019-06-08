import { Interact, BubbleSort, HeapSort, InsertionSort, MergeSort, QuickSort, SelectionSort, ShellSort, SortAlgorithm } from '../model'
import { VALUE_GENERATORS } from '../algorithm/Defs'

const GENERATOR = VALUE_GENERATORS[0]

function TestSort<T extends SortAlgorithm<number>>(Sort: new (...args: Array<any>) => T) {
  it(Sort.name, async () => {
    let sort = new Sort(GENERATOR)
    sort.Init()
    await Interact.ImmediateExecute(() => sort.Run())
    let sorted = sort.adt.Slice(0, sort.adt.length) as Array<number>
    expect(sorted).toEqual(sorted.sort())
  })
}

describe('Sort', () => {
  TestSort(BubbleSort)
  TestSort(HeapSort)
  TestSort(InsertionSort)
  TestSort(MergeSort)
  TestSort(QuickSort)
  TestSort(SelectionSort)
  TestSort(ShellSort)
})
