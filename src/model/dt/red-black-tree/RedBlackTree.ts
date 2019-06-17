import { Array$ } from 'js-corelib'
import { Algorithm } from '../../Algorithm'
import { RedBlackTreeADT, RedBlackTreeData } from '../../adt'

export class RedBlackTreeAlgorithm<T> extends Algorithm<RedBlackTreeData<T>, RedBlackTreeADT<T>> {
  protected _generator: () => T
  protected _n = 10

  constructor(generator: () => T, compare?: (val1: T, val2: T) => number) {
    super(new RedBlackTreeADT(compare))
    this._generator = generator
  }

  get data() {
    return this._adt.data
  }

  get n() {
    return this._n
  }

  set n(value: number) {
    this._n = Math.max(value, 1)
  }

  Init() {
    this._adt.Replace(Array$.Create(this._n, () => this._generator()))
    return this._adt.data
  }

  protected async RunCore(): Promise<any> {}
}

