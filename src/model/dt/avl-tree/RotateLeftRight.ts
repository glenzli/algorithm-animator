import { AVLTreeADT } from '../../adt'
import { PseudoCode } from '../../PseudoCode'
import { AVLTreeAlgorithm } from './AVLTree'

PseudoCode.Pseudo('AVLTree.RotateLeftRight', AVLTreeADT.rotateLeftRightPseudoCode)

export class AVLTreeRotateLeftRight<T> extends AVLTreeAlgorithm<T> {
  constructor(generator: () => T, compare?: (val1: T, val2: T) => number) {
    super(generator, compare)
  }

  Init() {
    this._adt.PrepareRotateLeftRightSample(this._generator)
    return this._adt.data
  }

  protected async RunCore() {
    await this._adt.RotateLeftRight()
  }
}

