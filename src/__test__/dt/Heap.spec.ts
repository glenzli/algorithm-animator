import { Interact, HeapAlgorithm, HeapInsert, HeapDown, HeapHeapify, HeapDelete, HeapData } from '../../model'
import { VALUE_GENERATORS } from '../../algorithm/Defs'
import { TestUtil$ } from '../Util'

const GENERATOR = VALUE_GENERATORS[0]

function CheckHeapConstraint(heap: HeapData<number>) {
  for (let i = 0; i < heap.count; ++i) {
    let left = 2 * i + 1
    let right = left + 1
    if (left < heap.count && heap.heap[i].value! < heap.heap[left].value!) {
      return false
    }
    if (right < heap.count && heap.heap[i].value! < heap.heap[right].value!) {
      return false
    }
    if (left >= heap.count || right >= heap.count) {
      break
    }
  }
  return true
}

function ExtractHeapData(heap: HeapData<number>) {
  return heap.heap.map(item => item.value).slice(0, heap.count) as Array<number>
}

function TestHeap<T extends HeapAlgorithm<number>>(Heap: new (...args: Array<any>) => T, operator?: (source: Array<number>, delta: Array<number>) => Array<number>) {
  it(Heap.name, async () => {
    let heap = new Heap(GENERATOR)
    heap.Init()
    let source = ExtractHeapData(heap.data)
    let output = await Interact.ImmediateExecute(() => heap.Run())

    expect(CheckHeapConstraint(heap.data)).toBeTruthy()
    if (operator && output) {
      let expected = operator(source, output as Array<number>).sort()
      expect(expected).toEqual(ExtractHeapData(heap.data).sort())
    } else {
      expect(source.sort()).toEqual(ExtractHeapData(heap.data).sort())
    }
  })
}


describe('Heap', () => {
  TestHeap(HeapHeapify)
  TestHeap(HeapInsert, TestUtil$.Operator.Insert)
  TestHeap(HeapDown, TestUtil$.Operator.Replace)
  TestHeap(HeapDelete, TestUtil$.Operator.Delete)
})
