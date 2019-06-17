<template>
  <div v-if="abstractData">
    <avl-tree-renderer :abstractData="abstractData"></avl-tree-renderer>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { AVLTreeAlgorithmMixin } from './AVLTree'
import { AVLTreeDelete } from '../../../model'

@Component
export default class DeleteRenderer extends Mixins(AVLTreeAlgorithmMixin) {
  InitTree(generator: () => any) {
    return new AVLTreeDelete(generator)
  }
}
</script>
