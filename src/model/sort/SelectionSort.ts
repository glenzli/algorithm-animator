import { PseudoCode } from '../PseudoCode'
import { SortAlgorithm } from './Sort'

PseudoCode.Pseudo('SelectionSort', `
selectionSort(A):
  for i ∈ [0, A.length):
    minIndex ← selectMin(A[i...])
    if minIndex ≠ i:
      swap(minIndex, i)
`)

export class SelectionSort<T> extends SortAlgorithm<T> {
  private async SelectMin(startIndex: number) {
    let minIndex = startIndex
    this._adt.Select(minIndex)
    for (let i = startIndex + 1; i < this._adt.length; ++i) {
      if (await this._adt.Compare(minIndex, i) > 0) {
        this._adt.RestoreAt(minIndex)
        minIndex = i
        this._adt.Select(minIndex)
      }
    }
    return minIndex
  }

  protected async RunCore() {
    for (let i = 0; i < this._adt.length; ++i) {
      this._adt.Partition(i, this._adt.length - 1)
      PseudoCode.RunAt(1)
      let min = await this.SelectMin(i)
      if (min !== i) {
        PseudoCode.RunAt(3)
        await this._adt.Swap(i, min)
      }
      this._adt.Restore()
    }
    this._adt.Partition()
  }
}
