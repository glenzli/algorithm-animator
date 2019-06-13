import { AVLTreeADT } from '../../adt'
import { PseudoCode } from '../../PseudoCode'
import { AVLTreeAlgorithm } from './AVLTree'

PseudoCode.Pseudo('AVLTree.Insert', AVLTreeADT.insertPseudoCode)

export class AVLTreeInsert<T> extends AVLTreeAlgorithm<T> {
  constructor(generator: () => T, compare?: (val1: T, val2: T) => number) {
    super(generator, compare)
  }

  protected async RunCore() {
    let inserted = [] as Array<any>
    let count = this._n / 2
    for (let i = 0; i < count; ++i) {
      let next = this._generator()
      if (await this._adt.Insert(next)) {
        inserted.push(next)
      }
    }
    return inserted
  }
}

