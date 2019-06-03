export interface AbstractData {
  id: number,
}

export abstract class ADT<TData extends AbstractData> {
  protected _data: TData

  constructor(data: TData) {
    this._data = data
  }

  get data() {
    return this._data
  }
}
