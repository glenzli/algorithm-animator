import { RedBlackTreeADT, RedBlackTreeNode } from '../../adt'
import { PseudoCode } from '../../PseudoCode'
import { Interact } from '../../Interact'
import { RedBlackTreeAlgorithm } from './RedBlackTree'

PseudoCode.Pseudo('RedBlackTree.InsertFix', RedBlackTreeADT.insertFixUpPseudoCode)

export class RedBlackTreeInsertFixUp<T> extends RedBlackTreeAlgorithm<T> {
  private _fix: RedBlackTreeNode<T> | null = null

  constructor(generator: () => T, compare?: (val1: T, val2: T) => number) {
    super(generator, compare)
  }

  Init() {
    this._fix = this._adt.PrepareInsertFixUpSample(this._generator)
    return this._adt.data
  }

  protected async RunCore() {
    if (this._fix) {
      await Interact.Doze()
      await this._adt.InsertFixUp(this._fix)
      this._fix = null
    }
  }
}

