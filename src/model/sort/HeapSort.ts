import { PseudoCode } from '../PseudoCode'
import { SortAlgorithm } from './Sort'
import { HeapADT } from '../adt'
import { HeapAlgorithm } from '../dt'

PseudoCode.Pseudo('HeapSort', `
heapSort(A):
  H ← MinHeap(A)
  for i ∈ [0, A.size):
    A[i] ← delete(H)
`)

export class HeapSort<T> extends SortAlgorithm<T> {
  private _heap: HeapADT<T>

  get heap() {
    return this._heap.data
  }

  constructor(generator: () => T, compare?: (val1: T, val2: T) => number) {
    super(generator, compare)
    this._heap = new HeapAlgorithm(generator, false, compare ? (val1: T, val2: T) => -compare(val1, val2) : ((val1: T, val2: T) => val1 > val2 ? -1 : (val1 < val2 ? 1 : 0))).adt
  }

  protected async RunCore() {
    PseudoCode.RunAt(0)
    this._heap.Replace(this._adt.Slice(0, this._adt.length, true), false)
    await PseudoCode.SilentExecute(() => this._heap.Heapify())
    for (let i = 0; i < this._adt.length; ++i) {
      PseudoCode.RunAt(2)
      await this._adt.Set(i, await PseudoCode.SilentExecute(() => this._heap.Delete()))
    }
    this._adt.Reset()
    this._heap.Replace([], false)
  }
}
