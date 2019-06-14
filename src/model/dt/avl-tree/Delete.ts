import { AVLTreeADT } from '../../adt'
import { PseudoCode } from '../../PseudoCode'
import { AVLTreeAlgorithm } from './AVLTree'

PseudoCode.Pseudo('AVLTree.Delete', AVLTreeADT.deletePseudoCode)

export class AVLTreeDelete<T> extends AVLTreeAlgorithm<T> {
  constructor(generator: () => T, compare?: (val1: T, val2: T) => number) {
    super(generator, compare)
  }

  protected async RunCore() {
    let deleted = [] as Array<any>
    let count = Math.floor(this._n / 5)
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

