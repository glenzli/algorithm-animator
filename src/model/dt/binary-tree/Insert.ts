import { BinaryTreeADT } from '../../adt'
import { PseudoCode } from '../../PseudoCode'
import { BinaryTreeAlgorithm } from './BinaryTree'

PseudoCode.Pseudo('BinaryTree.Insert', BinaryTreeADT.insertPseudoCode)

export class BinaryTreeInsert<T> extends BinaryTreeAlgorithm<T> {
  constructor(generator: () => T, compare?: (val1: T, val2: T) => number) {
    super(generator, compare)
  }

  protected async RunCore() {
    let inserted = []
    let count = Math.floor(this.n / 5)
    for (let i = 0; i < count; ++i) {
      let next = this._generator()
      let nextCount = 1 + Math.floor(2 * Math.random())
      for (let j = 0; j < nextCount; ++j) {
        inserted.push(next)
        await this._adt.Insert(next)
      }
    }
    return inserted
  }
}

