import { HeapADT } from '../../adt'
import { PseudoCode } from '../../PseudoCode'
import { HeapAlgorithm } from './Heap'

PseudoCode.Pseudo('Heap.Insert', HeapADT.insertPseudoCode)

export class HeapInsert<T> extends HeapAlgorithm<T> {
  constructor(generator: () => T, compare?: (val1: T, val2: T) => number) {
    super(generator, true, compare)
  }

  protected async RunCore() {
    let count = Math.floor(this.n / 5)
    for (let i = 0; i < count; ++i) {
      await this._adt.Insert(this._adt.root)
    }
  }
}
