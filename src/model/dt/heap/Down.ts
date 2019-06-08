import { HeapADT } from '../../adt'
import { PseudoCode } from '../../PseudoCode'
import { HeapAlgorithm } from './Heap'

PseudoCode.Pseudo('Heap.Down', HeapADT.downPseudoCode)

export class HeapDown<T> extends HeapAlgorithm<T> {
  constructor(generator: () => T, compare?: (val1: T, val2: T) => number) {
    super(generator, true, compare)
  }

  protected async RunCore() {
    let deleted = []
    let inserted = []
    let count = Math.floor(this.n / 5)
    for (let i = 0; i < count; ++i) {
      deleted.push(this._adt.root)
      inserted.push(this._adt.last)
      await this._adt.Set(0, this._adt.last)
      await this._adt.Down(0)
    }
    return deleted.concat(inserted)
  }
}
