import { Sleep } from '../utils'

describe('utils', () => {
  const SLEEP_TIME = 500
  let start = new Date().getTime()
  test('Sleep', () => {
    let delta = Math.abs(new Date().getTime() - start - SLEEP_TIME)
    Sleep(SLEEP_TIME).then(() => {
      expect(delta / SLEEP_TIME).toBeLessThan(0.1)
    })
  })
})

