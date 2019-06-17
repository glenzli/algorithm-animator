import { BinaryTreeADT } from '../../adt'
import { PseudoCode } from '../../PseudoCode'
import { BinaryTreeAlgorithm } from './BinaryTree'

PseudoCode.Pseudo('BinaryTree.Delete', BinaryTreeADT.deletePseudoCode)

export class BinaryTreeDelete<T> extends BinaryTreeAlgorithm<T> {
  constructor(generator: () => T, compare?: (val1: T, val2: T) => number) {
    super(generator, compare)
  }

  protected async RunCore() {
    let deleted = []
    let count = Math.floor(this.n / 1.5)
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

