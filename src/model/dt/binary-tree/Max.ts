import { BinaryTreeADT } from '../../adt'
import { PseudoCode } from '../../PseudoCode'
import { BinaryTreeAlgorithm } from './BinaryTree'

PseudoCode.Pseudo('BinaryTree.Max', BinaryTreeADT.maxPseudoCode)

export class BinaryTreeMax<T> extends BinaryTreeAlgorithm<T> {
  constructor(generator: () => T, compare?: (val1: T, val2: T) => number) {
    super(generator, compare)
  }

  protected async RunCore() {
    return (await this._adt.Max())[0].value
  }
}

