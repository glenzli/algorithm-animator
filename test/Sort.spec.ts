import { Interact, BubbleSort, HeapSort, InsertionSort, MergeSort, QuickSort, SelectionSort, ShellSort, SortAlgorithm } from '../src/model'
import { VALUE_GENERATORS } from '../src/algorithm/Defs'

const GENERATOR = VALUE_GENERATORS[0]

function TestSort<T extends SortAlgorithm<number>>(Sort: new (...args: Array<any>) => T) {
  it(Sort.name, async () => {
    let sort = new Sort(GENERATOR)
    sort.Init()
    await Interact.ImmediateExecute(() => sort.Run())
    let sorted = sort.adt.Slice(0, sort.adt.length) as Array<number>
    expect(sorted).toEqual(sorted.sort((m, n) => m - n))
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
