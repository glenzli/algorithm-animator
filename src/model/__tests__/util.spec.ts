import { Sleep } from '../utils'

describe('utils', () => {
  const SLEEP_TIME = 500

  test('Sleep', async () => {
    let start = new Date().getTime()
    await Sleep(SLEEP_TIME)
    let delta = Math.abs(new Date().getTime() - start - SLEEP_TIME)
    expect(delta / SLEEP_TIME).toBeLessThan(0.1)
  })
})

