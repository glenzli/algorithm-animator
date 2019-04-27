export function Sleep(time: number) {
  return new Promise(resolve => setTimeout(resolve, time))
}

export enum ObservableState {
  None = 0,
  Accessed,
  Selected,
  Swapping,
  MovingFrom,
  MovingTo,
}
