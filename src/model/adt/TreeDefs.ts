import { ValueItem } from './Defs'
import { AbstractData } from './ADT'

export interface TreeNode<T> extends ValueItem<T> {
  children: Array<TreeNode<T> | null>
  tag: number
}

export interface TreeData<T, TNode extends TreeNode<T> = TreeNode<T>> extends AbstractData {
  root: TNode,
  height: number,
  actives: Array<ValueItem<T>>,
}
