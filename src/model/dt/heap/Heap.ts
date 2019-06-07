import { Algorithm } from '../../Algorithm'
import { HeapADT, HeapData } from '../../adt'

export class HeapAlgorithm<T> extends Algorithm<HeapData<T>, HeapADT<T>> {
  protected _generator: () => T
  protected _n = 10
  private _heapify = true

  constructor(generator: () => T, heapify = true, compare?: (val1: T, val2: T) => number) {
    super(new HeapADT(compare))
    this._generator = generator
    this._heapify = heapify
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

  get capacity() {
    return this._adt.capacity
  }

  Init() {
    this._adt.Replace(new Array(this._n).fill(0).map(() => this._generator()), this._heapify)
    return this._adt.data
  }

  protected async RunCore() {}
}
