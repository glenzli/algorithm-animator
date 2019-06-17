import { PseudoCode } from '../PseudoCode'
import { SortAlgorithm } from './Sort'

PseudoCode.Pseudo('InsertionSort', `
insertionSort(A):
  for i ∈ (0, A.size):
    for j ∈ [0, i):
      if A[i] ≺ A[j]:
        move(i, j)
        break
`)

export class InsertionSort<T> extends SortAlgorithm<T> {
  protected async RunCore() {
    for (let i = 1; i < this._adt.length; ++i) {
      await PseudoCode.RunThrough(0)
      this._adt.Partition(i)
      for (let j = 0; j < i; ++j) {
        await PseudoCode.RunThrough(1, 2)
        if (await this._adt.Compare(i, j) < 0) {
          PseudoCode.RunAt(3)
          await this._adt.Move(i, j)
          await PseudoCode.RunThrough(4)
          break
        }
      }
    }
    this._adt.Reset()
  }
}
