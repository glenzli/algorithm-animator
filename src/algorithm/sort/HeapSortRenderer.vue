<template>
  <div v-if="abstractData">
    <array-renderer :abstractData="abstractData" :position="position"></array-renderer>
    <heap-renderer :abstractData="heapData"></heap-renderer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Mixins } from 'vue-property-decorator'
import { Point } from 'paper-vueify'
import { HeapSort, AbstractData, HeapData } from '../../model'
import { SortAlgorithmMixin } from './Sort'
import { ItemHelpers, ITEM_SIZES, HeapRenderer } from '../../renderer'

@Component({
  components: { HeapRenderer },
})
export default class HeapSortRenderer extends Mixins(SortAlgorithmMixin) {
  heapData: AbstractData = { id: -1 }

  InitSort(generator: () => any) {
    let sort = new HeapSort(generator)
    this.heapData = sort.heap
    return sort
  }

  get position() {
    return Point(0, ItemHelpers.GetOffsetY((this.heapData as HeapData<any>).height) - 2 * ITEM_SIZES.DIAMETER)
  }
}
</script>
