import { ADT, AbstractData } from './adt'
import { Interact } from './Interact'
import { PseudoCode } from './PseudoCode'

export abstract class Algorithm<TData extends AbstractData, TADT extends ADT<TData>> {
  protected _adt: TADT

  constructor(adt: TADT) {
    this._adt = adt
    this._adt.data.id = Algorithm.Register(this)
  }

  get id() {
    return this._adt.data.id
  }

  get adt() {
    return this._adt
  }

  abstract Init(): TData

  async Run() {
    PseudoCode.enabled = true
    if (Interact.running > 0) {
      Interact.aborting = true
    }
    await Interact.Ready(this.id)
    if (Interact.nextRunning === this.id) {
      try {
        Interact.aborting = false
        ++Interact.running
        await this.RunCore()
        Interact.paused = true
        --Interact.running
      } catch (e) {
        if (--Interact.running === 0) {
          Interact.aborting = false
        }
      }
    }
  }

  protected abstract RunCore(): Promise<void>

  private static map = new Map<number, any>()

  static Register<TData extends AbstractData, TADT extends ADT<TData>>(algorithm: Algorithm<TData, TADT>) {
    this.map.set(this.map.size, algorithm)
    return this.map.size - 1
  }

  static From<T extends Algorithm<AbstractData, ADT<AbstractData>>>(id: number) {
    return this.map.get(id)! as T
  }
}
