class Interactor {
  private _delay = 100
  private _memorizedDelay = 0
  private _paused = false
  private _aborting = false
  private _running = 0
  private _nextRunning = -1
  private _onPaused: ((paused: boolean) => void) | null = null

  get delay() {
    return this._delay
  }

  set delay(value: number) {
    if (!this.immediate) {
      this._delay = value
    }
  }

  get immediate() {
    return this._delay === 0
  }

  set immediate(value: boolean) {
    if (value && this._delay > 0) {
      this._memorizedDelay = this._delay
      this._delay = 0
    } else if (!value && this._delay === 0) {
      this._delay = this._memorizedDelay
    }
  }

  get paused() {
    return this._paused
  }

  set paused(value: boolean) {
    this._paused = value
    if (this._onPaused) {
      this._onPaused(value)
    }
  }

  get aborting() {
    return this._aborting
  }

  set aborting(value: boolean) {
    this._aborting = value
  }

  get running() {
    return this._running
  }

  set running(value: number) {
    this._running = value
  }

  get nextRunning() {
    return this._nextRunning
  }

  OnPaused(onPaused: (paused: boolean) => void) {
    this._onPaused = onPaused
    this._onPaused(this._paused)
  }

  private Continue() {
    return new Promise<void>(resolve => {
      if (this._paused) {
        let pausePoll = setInterval(() => {
          if (!this._paused) {
            clearInterval(pausePoll)
            resolve()
          }
        }, 250)
      } else {
        resolve()
      }
    })
  }

  async Doze(n = 1) {
    if (this._aborting) {
      throw new Error('Abort ' + Math.floor(1e8 * Math.random()))
    } else {
      if (!this.immediate) {
        await this.Continue()
      }
      return new Promise<void>(resolve => setTimeout(resolve, this._delay * n))
    }
  }

  Ready(next: number) {
    this._nextRunning = next
    return new Promise(resolve => {
      if (this._running > 0) {
        let abortingPoll = setInterval(() => {
          if (this._running === 0) {
            clearInterval(abortingPoll)
            resolve()
          }
        }, 50)
      } else {
        resolve()
      }
    })
  }

  async ImmediateExecute<T>(f: () => Promise<T>) {
    this.immediate = true
    let result: any
    try {
      result = await f()
    } catch (e) {
    } finally {
      this.immediate = false
    }
    return result
  }
}

export const Interact = new Interactor()
