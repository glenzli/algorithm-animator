class ObjectLink {
  private _map = new Map<number, any>()
  private _id = 0

  Get<T>(id: number) {
    return this._map.get(id) as T | undefined
  }

  New<T>(obj: T) {
    this._map.set(++this._id, obj)
    return this._id
  }
}

const $olink = new ObjectLink()

export { $olink }
