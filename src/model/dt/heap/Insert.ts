import { HeapADT } from '../../adt'
import { PseudoCode } from '../../PseudoCode'
import { HeapAlgorithm } from './Heap'

PseudoCode.Pseudo('Heap.Insert', HeapADT.insertPseudoCode)

export class HeapInsert<T> extends HeapAlgorithm<T> {
  constructor(generator: () => T, compare?: (val1: T, val2: T) => number) {
    super(generator, true, compare)
  }

  protected async RunCore() {
    let inserted = []
    let count = Math.floor(this.n / 5)
    for (let i = 0; i < count; ++i) {
      inserted.push(this._adt.root)
      await this._adt.Insert(this._adt.root)
    }
    return inserted
  }
}
