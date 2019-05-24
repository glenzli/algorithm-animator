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
export default class BuildHeap extends Mixins(NumericBSTAlgorithmMixin) {
  searchNode: BinaryNode<number> = { value: Number.NaN, left: [], right: [], level: 0, state: Operation.Swapping }

  get insertExtra() {
    return Number.isNaN(this.searchNode.value) ? null : this.searchNode
  }

  async RunBuild(tree: BinaryTree<any>) {
    await Sleep(this.delay)
    let data = BinaryTree.NumericData(Math.ceil((this.n + 1) / 2), this.range)
    data = [tree.root[0].value, ...data]
    for (let value of data) {
      this.searchNode.value = value
      await tree.Delete(value)
      await this.Continue()
    }
    this.searchNode.value = Number.NaN
  }

  async Run() {
    let observer = $olink.Get<BinaryTree<any>>(this.id)!
    await this.RunBuild(observer)
    this.OnComplete()
  }

  mounted() {
    this.CreateBST()
    this.Run()
  }
}
</script>