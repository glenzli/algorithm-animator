import { BinaryTreeADT } from '../../adt'
import { PseudoCode } from '../../PseudoCode'
import { BinaryTreeAlgorithm } from './BinaryTree'

PseudoCode.Pseudo('BinaryTree.InOrder', BinaryTreeADT.inOrderPseudoCode)

export class BinaryTreeInOrder<T> extends BinaryTreeAlgorithm<T> {
  constructor(generator: () => T, compare?: (val1: T, val2: T) => number) {
    super(generator, compare)
  }

  protected async RunCore() {
    await this._adt.InOrder()
  }
}

