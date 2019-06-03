import { PseudoCode } from '../PseudoCode'
import { SortAlgorithm } from './Sort'

PseudoCode.Pseudo('BubbleSort', `
bubbleSort(A):
  for i ∈ [0, A.length):
    noSwap ← true
    for j ∈ [0, A.length - 1 - i):
      if A[j] > A[j + 1]:
        swap(j, j + 1)
        noSwap ← false
    if noSwap = true:
      break
`)

export class BubbleSort<T> extends SortAlgorithm<T> {
  protected async RunCore() {
    for (let i = 0; i < this._adt.length; ++i) {
      await PseudoCode.RunAt(1)
      let noSwap = true
      let terminal = this._adt.length - i - 1
      this._adt.Partition(0, terminal)
      await PseudoCode.RunAt(2)
      for (let j = 0; j < terminal; ++j) {
        PseudoCode.RunAt(3)
        if (await this._adt.Compare(j, j + 1) > 0) {
          PseudoCode.RunAt(4)
          await this._adt.Swap(j, j + 1)
          await PseudoCode.RunAt(5)
          noSwap = false
        }
      }
      await PseudoCode.RunAt(6)
      if (noSwap) {
        await PseudoCode.RunAt(7)
        break
      }
    }
    this._adt.Partition()
    this._adt.Restore()
  }
}
