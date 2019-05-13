<template>
  <div>
    <binary-tree-renderer :root="root" :state="state" :position="position"></binary-tree-renderer>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { NumericBSTAlgorithmMixin } from './NumericBSTAlgorithm'
import { BinaryTreeRenderer } from '../components'
import { $olink, BinaryTree } from '../model'

@Component({
  components: { BinaryTreeRenderer },
})
export default class PostorderBST extends Mixins(NumericBSTAlgorithmMixin) {
  async RunBuild(tree: BinaryTree<any>) {
    tree.Postorder()
  }

  Run() {
    let observer = $olink.Get<BinaryTree<any>>(this.id)!
    this.RunBuild(observer)
  }

  mounted() {
    this.CreateBST()
    this.Run()
  }
}
</script>