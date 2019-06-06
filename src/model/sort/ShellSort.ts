import { PseudoCode } from '../PseudoCode'
import { SortAlgorithm } from './Sort'
import { UniqueAttribute } from '../adt'

PseudoCode.Pseudo('ShellSort', `
shellSort(A):
  d ← A.size
  while d > 1:
    d = ⌈d / 2⌉
    for i ∈ [0, d):
      insertionSort(A[i + λd | λ = 0, 1, ⋯])
`)

export class ShellSort<T> extends SortAlgorithm<T> {
  private async RunSparseInsertionSort(start: number, space: number) {
    if (space > 1) {
      for (let i = 0; i < this._adt.length; ++i) {
        if ((i - start) % space) {
          this._adt.Attribute(UniqueAttribute.Ignore, i)
        }
      }
    }
    for (let i = start + space; i < this._adt.length; i += space) {
      let inserted = false
      for (let j = i - space; j >= start; j -= space) {
        if (await this._adt.Compare(i, j) > 0) {
          await this._adt.SparseMove(i, j + space, space)
          inserted = true
          break
        }
      }
      if (!inserted) {
        await this._adt.SparseMove(i, start, space)
      }
    }
    this._adt.Restore()
  }

  protected async RunCore() {
    await PseudoCode.RunAt(0)
    let space = this._adt.length
    while (space > 1) {
      await PseudoCode.RunAt(2)
      space = Math.floor(space / 2)
      for (let i = 0; i < space; ++i) {
        await PseudoCode.RunAt(3)
        PseudoCode.RunAt(4)
        await this.RunSparseInsertionSort(i, space)
      }
    }
    this._adt.Reset()
  }
}
