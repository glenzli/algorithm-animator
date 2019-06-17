<template>
  <div v-if="abstractData">
    <red-black-tree-renderer :abstractData="abstractData"></red-black-tree-renderer>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { RedBlackTreeAlgorithmMixin } from './RedBlackTree'
import { RedBlackTreeInsert } from '../../../model'

@Component
export default class InsertRenderer extends Mixins(RedBlackTreeAlgorithmMixin) {
  InitTree(generator: () => any) {
    return new RedBlackTreeInsert(generator)
  }
}
</script>
