import { PseudoCode } from '../PseudoCode'
import { SortAlgorithm } from './Sort'
import { Interact } from '../Interact'
import { UniqueState } from '../adt'

PseudoCode.Pseudo('QuickSort', `
quickSort(A):
  if A.size > 0:
    pivot ← 0
    for i ∈ (0, A.size):
      if A[i] ≺ A[0]:
        swap(i, ↑pivot)
    if pivot ≠ 0:
      swap(0, pivot)
    quickSort(A[0, ⋯, pivot - 1])
    quickSort(A[pivot + 1, ⋯])
`)

export class QuickSort<T> extends SortAlgorithm<T> {
  protected async RunCore(from = 0, to = this._adt.length - 1) {
    await PseudoCode.RunThrough(0)
    if (from < to) {
      this._adt.Partition(from, to)
      await PseudoCode.RunThrough(1)
      let pivot = from
      this._adt.Select(pivot)
      this._adt.Seperate(pivot)
      for (let i = from + 1; i <= to; ++i) {
        await PseudoCode.RunThrough(2, 3)
        if (await this._adt.Compare(from, i) > 0) {
          PseudoCode.RunAt(4)
          await this._adt.Swap(i, ++pivot)
          this._adt.State(UniqueState.Less, pivot)
          this._adt.Seperate(pivot, 1)
        } else {
          this._adt.State(UniqueState.GreaterOrEqual, i)
        }
      }
      await PseudoCode.RunThrough(5)
      if (from !== pivot) {
        PseudoCode.RunAt(6)
        await this._adt.Swap(from, pivot)
        this._adt.Seperate(pivot - 1, 0)
        await Interact.Doze()
      }
      this._adt.Reset()
      await PseudoCode.RunThrough(7)
      await this.RunCore(from, pivot - 1)
      await PseudoCode.RunThrough(8)
      await this.RunCore(pivot + 1, to)
    }
  }
}
