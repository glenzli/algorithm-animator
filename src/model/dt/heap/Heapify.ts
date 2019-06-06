import { HeapADT } from '../../adt'
import { PseudoCode } from '../../PseudoCode'
import { HeapAlgorithm } from './Heap'

PseudoCode.Pseudo('Heap.Heapify', HeapADT.heapifyPseudoCode)

export class HeapHeapify<T> extends HeapAlgorithm<T> {
  constructor(generator: () => T, compare?: (val1: T, val2: T) => number) {
    super(generator, false, compare)
  }

  protected async RunCore() {
    await this._adt.Heapify()
  }
}
