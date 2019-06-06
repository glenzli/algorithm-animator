import { AbstractData, ADT } from './ADT'
import { ValueItem } from './Defs'

export abstract class TreeFormADT<TData extends AbstractData, TNode, T> extends ADT<TData> {
  abstract get count(): number

  abstract get height(): number

  abstract Parent(node: TNode): TNode

  abstract Children(node: TNode): Array<TNode | null>

  abstract IsLeaf(node: TNode): boolean

  abstract IsRoot(node: TNode): boolean

  abstract ValueOf(node: TNode): ValueItem<T>
}
