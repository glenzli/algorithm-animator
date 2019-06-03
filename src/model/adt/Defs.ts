export enum ActiveState {
  None = 0,
  Peeked,
  Selected,
  Marked,
  Updated,
  Swapping,
  Moving,
  MovingTo,
  Less,
  Greater,
}

export interface ValueItem<T> {
  value: T,
  action: ActiveState,
}
