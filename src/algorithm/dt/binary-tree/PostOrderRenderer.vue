<template>
  <div v-if="abstractData">
    <binary-tree-renderer :abstractData="abstractData"></binary-tree-renderer>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { BinaryTreeAlgorithmMixin } from './BinaryTree'
import { BinaryTreePostOrder } from '../../../model'

@Component
export default class PostOrderRenderer extends Mixins(BinaryTreeAlgorithmMixin) {
  InitTree(generator: () => any) {
    return new BinaryTreePostOrder(generator)
  }
}
</script>
