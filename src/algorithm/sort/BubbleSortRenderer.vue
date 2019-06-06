<template>
  <div v-if="abstractData">
    <array-renderer :abstractData="abstractData"></array-renderer>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { BubbleSort } from '../../model'
import { SortAlgorithmMixin } from './Sort'

@Component
export default class BubbleSortRenderer extends Mixins(SortAlgorithmMixin) {
  InitSort(generator: () => any) {
    return new BubbleSort(generator)
  }
}
</script>
