import { BinaryTreeADT } from '../../adt'
import { PseudoCode } from '../../PseudoCode'
import { BinaryTreeAlgorithm } from './BinaryTree'
import { Interact } from '../../Interact'

PseudoCode.Pseudo('BinaryTree.Predecessor', BinaryTreeADT.predecessorPseudoCode)

export class BinaryTreePredecessor<T> extends BinaryTreeAlgorithm<T> {
  constructor(generator: () => T, compare?: (val1: T, val2: T) => number) {
    super(generator, compare)
  }

  protected async RunCore() {
    let pairs = []
    let count = Math.floor(this._n / 5)
    for (let i = 0; i < count; ++i) {
      let node = this._adt.RandomPick()
      let predecessor = await this._adt.Predecessor(node)
      pairs.push(predecessor ? [node.value!, predecessor.value!] : [node.value!])
      await Interact.Doze(3)
      this._adt.Restore()
    }
    return pairs
  }
}

