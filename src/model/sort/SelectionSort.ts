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
    await PseudoCode.RunAt(1)
    let minIndex = startIndex
    this._adt.Select(minIndex)
    for (let i = startIndex + 1; i < this._adt.length; ++i) {
      await PseudoCode.RunThrough(2, 3)
      if (await this._adt.Compare(minIndex, i) > 0) {
        await PseudoCode.RunThrough(4)
        this._adt.RestoreAt(minIndex)
        minIndex = i
        this._adt.Select(minIndex)
      }
    }
    return minIndex
  }

  protected async RunCore() {
    for (let i = 0; i < this._adt.length; ++i) {
      await PseudoCode.RunThrough(0)
      this._adt.Partition(i)
      let min = await this.SelectMin(i)
      await PseudoCode.RunThrough(5)
      if (min !== i) {
        PseudoCode.RunAt(6)
        await this._adt.Swap(i, min)
      }
      this._adt.Restore()
    }
    this._adt.Reset()
  }
}
