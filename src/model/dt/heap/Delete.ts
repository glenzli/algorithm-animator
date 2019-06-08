import { HeapADT } from '../../adt'
import { PseudoCode } from '../../PseudoCode'
import { HeapAlgorithm } from './Heap'

PseudoCode.Pseudo('Heap.Delete', HeapADT.deletePseudoCode)

export class HeapDelete<T> extends HeapAlgorithm<T> {
  constructor(generator: () => T, compare?: (val1: T, val2: T) => number) {
    super(generator, true, compare)
  }

  protected async RunCore() {
    let deleted = []
    let count = Math.floor(this.n / 5)
    for (let i = 0; i < count; ++i) {
      deleted.push(this._adt.root)
      await this._adt.Delete()
    }
    return deleted
  }
}
