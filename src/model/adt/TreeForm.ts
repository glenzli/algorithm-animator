import { ValueItem } from './Defs'

export interface TreeNodeItem<T> extends ValueItem<T> {
  parent: TreeNodeItem<T>,
  children: Array<TreeNodeItem<T> | null>
}
