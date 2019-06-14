import { Array$ } from 'js-corelib'
import { BinaryTreeADT } from '../../adt'
import { PseudoCode } from '../../PseudoCode'
import { BinaryTreeAlgorithm } from './BinaryTree'

PseudoCode.Pseudo('BinaryTree.Insert', BinaryTreeADT.insertPseudoCode)

export class BinaryTreeInsert<T> extends BinaryTreeAlgorithm<T> {
  constructor(generator: () => T, compare?: (val1: T, val2: T) => number) {
    super(generator, compare)
  }

  Init() {
    this._adt.Replace(Array$.Create(Math.floor(this._n / 2), () => this._generator()), false)
    return this._adt.data
  }

  protected async RunCore() {
    let inserted = []
    let count = this._n - Math.floor(this._n / 2)
    for (let i = 0; i < count; ++i) {
      let next = this._generator()
      inserted.push(next)
      await this._adt.Insert(next)
    }
    return inserted
  }
}

