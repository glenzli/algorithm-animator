<template>
  <div v-if="abstractData">
    <avl-tree-renderer :abstractData="abstractData"></avl-tree-renderer>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { AVLTreeAlgorithmMixin } from './AVLTree'
import { AVLTreeInsert } from '../../../model'

@Component
export default class InsertRenderer extends Mixins(AVLTreeAlgorithmMixin) {
  InitTree(generator: () => any) {
    return new AVLTreeInsert(generator)
  }
}
</script>
