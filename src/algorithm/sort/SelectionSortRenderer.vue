<template>
  <div v-if="abstractData">
    <array-renderer :abstractData="abstractData"></array-renderer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Mixins } from 'vue-property-decorator'
import { SelectionSort } from '../../model'
import { SortAlgorithmMixin } from './Sort'

@Component
export default class SelectionSortRenderer extends Mixins(SortAlgorithmMixin) {
  InitSort(generator: () => any) {
    return new SelectionSort(generator)
  }
}
</script>
