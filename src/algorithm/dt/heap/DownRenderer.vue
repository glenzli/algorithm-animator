<template>
  <div v-if="abstractData">
    <heap-renderer :abstractData="abstractData"></heap-renderer>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { HeapAlgorithmMixin } from './Heap'
import { HeapDown } from '../../../model'

@Component
export default class DownRenderer extends Mixins(HeapAlgorithmMixin) {
  InitHeap(generator: () => any) {
    return new HeapDown(generator)
  }
}
</script>
