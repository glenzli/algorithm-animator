<template>
  <div v-if="abstractData">
    <array-renderer :abstractData="abstractData"></array-renderer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Mixins } from 'vue-property-decorator'
import { SelectionSort } from '../../model'
import { VALUE_GENERATORS } from '../Defs'
import { SortAlgorithmMixin } from './Sort'
import { ArrayRenderer } from '../../renderer'

@Component({
  components: { ArrayRenderer },
})
export default class SelectionSortRenderer extends Mixins(SortAlgorithmMixin) {
  Init() {
    let sort = new SelectionSort(VALUE_GENERATORS[this.gid])
    sort.n = this.n
    this.abstractData = sort.data
  }
}
</script>
