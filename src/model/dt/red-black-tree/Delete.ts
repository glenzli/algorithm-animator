import { RedBlackTreeADT } from '../../adt'
import { PseudoCode } from '../../PseudoCode'
import { RedBlackTreeAlgorithm } from './RedBlackTree'

PseudoCode.Pseudo('RedBlackTree.Delete', RedBlackTreeADT.deletePseudoCode)

export class RedBlackTreeDelete<T> extends RedBlackTreeAlgorithm<T> {
  constructor(generator: () => T, compare?: (val1: T, val2: T) => number) {
    super(generator, compare)
  }

  protected async RunCore() {
    let deleted = [] as Array<any>
    let count = Math.floor(this._n / 1.5)
    for (let i = 0; i < count; ++i) {
      let value = this._adt.RandomPick().value!
      if (value != null) {
        deleted.push(value)
        await this._adt.Delete(value)
      }
    }
    return deleted
  }
}
