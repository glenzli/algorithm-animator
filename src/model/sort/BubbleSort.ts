import { PseudoCode } from '../PseudoCode'
import { SortAlgorithm } from './Sort'

PseudoCode.Pseudo('BubbleSort', `
bubbleSort(A):
  for i ∈ [0, A.size):
    noSwap ← true
    for j ∈ [0, A.size - i - 1):
      if A[j] ≻ A[j + 1]:
        swap(j, j + 1)
        noSwap ← false
    if noSwap:
      break
`)

export class BubbleSort<T> extends SortAlgorithm<T> {
  protected async RunCore() {
    for (let i = 0; i < this._adt.length; ++i) {
      await PseudoCode.RunThrough(0, 1)
      let noSwap = true
      let terminal = this._adt.length - i - 1
      this._adt.Partition(0, terminal)
      for (let j = 0; j < terminal; ++j) {
        await PseudoCode.RunThrough(2, 3)
        if (await this._adt.Compare(j, j + 1) > 0) {
          PseudoCode.RunAt(4)
          await this._adt.Swap(j, j + 1)
          await PseudoCode.RunThrough(5)
          noSwap = false
        }
      }
      await PseudoCode.RunThrough(6)
      if (noSwap) {
        await PseudoCode.RunThrough(7)
        break
      }
    }
    this._adt.Reset()
  }
}
