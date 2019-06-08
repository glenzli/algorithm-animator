import { ValueItem } from './Defs'
import { AbstractData } from './ADT'

export interface TreeNodeItem<T> extends ValueItem<T> {
  children: Array<TreeNodeItem<T> | null>
}

export interface TreeData<T> extends AbstractData {
  root: TreeNodeItem<T>,
  height: number,
  actives: Array<ValueItem<T>>,
}
