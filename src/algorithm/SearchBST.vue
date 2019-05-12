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
export default class SearchBST extends Mixins(NumericBSTAlgorithmMixin) {
  searchNode: ObservableBinaryNode<number> = { value: Number.NaN, left: [], right: [], level: 0, state: ObservableState.Swapping }

  get insertExtra() {
    return Number.isNaN(this.searchNode.value) ? null : this.searchNode
  }

  async RunBuild(tree: ObservableBinaryTree<any>) {
    await Sleep(this.delay)
    let data = ObservableBinaryTree.NearlyBalancedNumericData(Math.ceil((this.n + 1) / 2), this.range)
    for (let value of data) {
      this.searchNode.value = value
      await tree.Search(value)
      await this.Continue()
    }
    this.searchNode.value = Number.NaN
  }

  Run() {
    let observer = $olink.Get<ObservableBinaryTree<any>>(this.id)!
    this.RunBuild(observer)
  }

  mounted() {
    this.CreateBST()
    this.Run()
  }
}
</script>