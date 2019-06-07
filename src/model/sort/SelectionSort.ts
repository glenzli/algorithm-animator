import { PseudoCode } from '../PseudoCode'
import { SortAlgorithm } from './Sort'

PseudoCode.Pseudo('SelectionSort', `
selectionSort(A):
  for i ∈ [0, A.size):
    min ← i
    for j ∈ (i, A.size):
      if (A[min] ≺ A[j]):
        min = j
    if min ≠ i:
      swap(min, i)
`)

export class SelectionSort<T> extends SortAlgorithm<T> {
  private async SelectMin(startIndex: number) {
    let minIndex = startIndex
    this._adt.Select(minIndex)
    for (let i = startIndex + 1; i < this._adt.length; ++i) {
      PseudoCode.RunAt(3)
      if (await this._adt.Compare(minIndex, i) > 0) {
        await PseudoCode.RunAt(4)
        this._adt.RestoreAt(minIndex)
        minIndex = i
        this._adt.Select(minIndex)
      }
    }
    return minIndex
  }

  protected async RunCore() {
    PseudoCode.RunAt(0)
    for (let i = 0; i < this._adt.length; ++i) {
      this._adt.Partition(i)
      PseudoCode.RunAt(1)
      let min = await this.SelectMin(i)
      await PseudoCode.RunAt(5)
      if (min !== i) {
        PseudoCode.RunAt(6)
        await this._adt.Swap(i, min)
      }
      this._adt.Restore()
    }
    this._adt.Reset()
  }
}
