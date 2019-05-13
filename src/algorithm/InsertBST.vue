<template>
  <div>
    <binary-tree-renderer :root="root" :extra="insertExtra" :state="state" :position="position"></binary-tree-renderer>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Point } from 'paper-vueify'
import { NumericBSTAlgorithmMixin } from './NumericBSTAlgorithm'
import { BinaryTreeRenderer } from '../components'
import { $olink, Sleep, BinaryTree, BinaryNode, Operation } from '../model'

@Component({
  components: { BinaryTreeRenderer },
})
export default class InsertBST extends Mixins(NumericBSTAlgorithmMixin) {
  insertNode: BinaryNode<number> = { value: Number.NaN, left: [], right: [], level: 0, state: Operation.Swapping }

  get insertExtra() {
    return Number.isNaN(this.insertNode.value) ? null : this.insertNode
  }

  async RunBuild(tree: BinaryTree<any>) {
    await Sleep(this.delay)
    let data = BinaryTree.NumericData(this.n - 1, this.range)
    for (let value of data) {
      this.insertNode.value = value
      await tree.Insert(value)
      await this.Continue()
    }
    this.insertNode.value = Number.NaN
  }

  Run() {
    let observer = $olink.Get<BinaryTree<any>>(this.id)!
    this.RunBuild(observer)
  }

  mounted() {
    this.CreateBST(1)
    this.Run()
  }
}
</script>