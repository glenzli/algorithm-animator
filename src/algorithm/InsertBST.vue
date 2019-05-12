<template>
  <div>
    <binary-tree-visualizer :root="root" :extra="insertExtra" :state="state" :position="position"></binary-tree-visualizer>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Point } from 'paper-vueify'
import { NumericBSTAlgorithmMixin } from './NumericBSTAlgorithm'
import { BinaryTreeVisualizer } from '../components'
import { $olink, Sleep, ObservableBinaryTree, ObservableBinaryNode, ObservableState } from '../model'

@Component({
  components: { BinaryTreeVisualizer },
})
export default class InsertBST extends Mixins(NumericBSTAlgorithmMixin) {
  insertNode: ObservableBinaryNode<number> = { value: Number.NaN, left: [], right: [], level: 0, state: ObservableState.Swapping }

  get insertExtra() {
    return Number.isNaN(this.insertNode.value) ? null : this.insertNode
  }

  async RunBuild(tree: ObservableBinaryTree<any>) {
    await Sleep(this.delay)
    let data = ObservableBinaryTree.NearlyBalancedNumericData(this.n - 1, this.range)
    for (let value of data) {
      this.insertNode.value = value
      await tree.Insert(value)
      await this.Continue()
    }
    this.insertNode.value = Number.NaN
  }

  Run() {
    let observer = $olink.Get<ObservableBinaryTree<any>>(this.id)!
    this.RunBuild(observer)
  }

  mounted() {
    this.CreateBST(1)
    this.Run()
  }
}
</script>