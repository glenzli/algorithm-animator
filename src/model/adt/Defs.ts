export enum UniqueAction {
  None = 0,
  Peek,
  Select,
  Update,
  Swap,
  Move,
  Target,
}

export enum UniqueState {
  None = 0,
  Less,
  LessOrEqual,
  Greater,
  GreaterOrEqual,
  Equal,
  ApproximateEqual,
}

export enum UniqueAttribute {
  None = 0,
  Emphasize,
  Ignore,
}

export interface ValueItem<T> {
  value: T | null,
  action: UniqueAction,
  state: UniqueState,
  attribute: UniqueAttribute
}
