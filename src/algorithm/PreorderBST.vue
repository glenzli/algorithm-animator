<template>
  <div>
    <binary-tree-visualizer :root="root" :state="state" :position="position"></binary-tree-visualizer>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { NumericBSTAlgorithmMixin } from './NumericBSTAlgorithm'
import { BinaryTreeVisualizer } from '../components'
import { $olink, ObservableBinaryTree } from '../model'

@Component({
  components: { BinaryTreeVisualizer },
})
export default class PreorderBST extends Mixins(NumericBSTAlgorithmMixin) {
  async RunBuild(tree: ObservableBinaryTree<any>) {
    tree.Preorder()
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