import { AVLTreeADT } from '../../adt'
import { PseudoCode } from '../../PseudoCode'
import { AVLTreeAlgorithm } from './AVLTree'

PseudoCode.Pseudo('AVLTree.Insert', AVLTreeADT.insertPseudoCode)

export class AVLTreeInsert<T> extends AVLTreeAlgorithm<T> {
  constructor(generator: () => T, compare?: (val1: T, val2: T) => number) {
    super(generator, compare)
  }

  Init() {
    this._adt.Replace([this._generator()])
    return this._adt.data
  }

  protected async RunCore() {
    let inserted = [] as Array<any>
    for (let i = 0; i < this._n; ++i) {
      let next = this._generator()
      if (await this._adt.Insert(next)) {
        inserted.push(next)
      }
    }
    return inserted
  }
}

