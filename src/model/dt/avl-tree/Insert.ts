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
    let count = Math.floor(this.n / 5)
    for (let i = 0; i < count; ++i) {
      let next = this._generator()
      let nextCount = 1 + Math.floor(4 * Math.random())
      for (let j = 0; j < nextCount; ++j) {
        inserted.push(next)
        await this._adt.Insert(next)
      }
    }
    return inserted
  }
}

