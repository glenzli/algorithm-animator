import { PseudoCode } from '../PseudoCode'
import { SortAlgorithm } from './Sort'
import { ArrayADT } from '../adt'

PseudoCode.Pseudo('MergeSort', `
mergeSort(A):
  if A.size > 2:
    mid ← ⌊A.size / 2⌋
    mergeSort(A[0, ⋯, mid])
    mergeSort(A[mid + 1, ⋯])
    Aux ← copy(A)
    for k ∈ [0, A.size), i ← 0, j ← mid + 1:
      if (i > mid ⋁ (j < A.size ⋀ Aux[j] < Aux[i])):
        A[k] ← Aux[j↑]
      else:
        A[k] ← Aux[i↑]
  else if A.size > 1:
    if A[0] > A[1]:
      swap(0, 1)
`)

export class MergeSort<T> extends SortAlgorithm<T> {
  private _aux: ArrayADT<T>

  get auxData() {
    return this._aux.data
  }

  constructor(generator: () => T, compare?: (val1: T, val2: T) => number) {
    super(generator, compare)
    this._aux = new ArrayADT(compare)
  }

  protected async RunCore(from = 0, to = this._adt.length - 1) {
    this._adt.Partition(from, to)
    await PseudoCode.RunAt(0)
    if (to - from > 1) {
      await PseudoCode.RunAt(1)
      let mid = Math.floor((to - from) / 2) + from
      await PseudoCode.RunAt(2)
      await this.RunCore(from, mid)
      await PseudoCode.RunAt(3)
      await this.RunCore(mid + 1, to)
      await PseudoCode.RunAt(4)
      this._aux.Replace(this._adt.Slice(from, to + 1, true))
      this._adt.Partition(from, to)
      this._aux.Seperate(mid - from)
      let i = from
      let j = mid + 1
      for (let k = from; k <= to; ++k) {
        PseudoCode.RunAt(6)
        if (i > mid || (j <= to && await this._aux.Compare(j - from, i - from) < 0)) {
          this._aux.Select(j - from)
          await PseudoCode.RunAt(7)
          await this._adt.Set(k, await this._aux.Get(j++ - from, true))
        } else {
          this._aux.Select(i - from)
          await PseudoCode.RunAt(9)
          await this._adt.Set(k, await this._aux.Get(i++ - from, true))
        }
      }
      this._aux.Reset(true)
    } else {
      PseudoCode.RunAt(11)
      if (to > from && await this._adt.Compare(from, to) > 0) {
        PseudoCode.RunAt(12)
        await this._adt.Swap(from, to)
      }
    }
    this._adt.Reset()
  }
}
