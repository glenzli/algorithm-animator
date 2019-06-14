import { AVLTreeADT } from '../../adt'
import { PseudoCode } from '../../PseudoCode'
import { AVLTreeAlgorithm } from './AVLTree'

PseudoCode.Pseudo('AVLTree.Balance', AVLTreeADT.balancePseudoCode)

export class AVLTreeBalance<T> extends AVLTreeAlgorithm<T> {
  constructor(generator: () => T, compare?: (val1: T, val2: T) => number) {
    super(generator, compare)
  }

  Init() {
    this._adt.PrepareBalanceSample(this._generator)
    return this._adt.data
  }

  protected async RunCore() {
    await this._adt.Balance()
  }
}

