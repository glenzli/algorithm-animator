<template>
  <div v-if="abstractData">
    <array-renderer :abstractData="abstractData"></array-renderer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Mixins } from 'vue-property-decorator'
import { InsertionSort } from '../../model'
import { SortAlgorithmMixin } from './Sort'

@Component
export default class InsertionSortRenderer extends Mixins(SortAlgorithmMixin) {
  InitSort(generator: () => any) {
    return new InsertionSort(generator)
  }
}
</script>
