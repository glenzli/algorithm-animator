import { AVLTreeADT } from '../../adt'
import { PseudoCode } from '../../PseudoCode'
import { AVLTreeAlgorithm } from './AVLTree'

PseudoCode.Pseudo('AVLTree.Balance', AVLTreeADT.balanceUpPseudoCode)

export class AVLTreeBalanceUp<T> extends AVLTreeAlgorithm<T> {
  constructor(generator: () => T, compare?: (val1: T, val2: T) => number) {
    super(generator, compare)
  }

  Init() {
    this._adt.PrepareBalanceUpSample(this._generator)
    return this._adt.data
  }

  protected async RunCore() {
    await this._adt.BalanceUp()
  }
}

