import { $olink } from '../ObjectLink'

describe('ObjectLink', () => {
  test('New & Get', () => {
    expect($olink.Get(999999)).toEqual(undefined)
    let id = $olink.New({ n: 123456 })
    expect($olink.Get(id)).toEqual({ n: 123456 })
  })
})
