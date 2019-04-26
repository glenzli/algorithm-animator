export function Sleep(time: number) {
  return new Promise(resolve => setTimeout(resolve, time))
}
