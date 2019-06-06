<template>
  <div v-if="abstractData">
    <array-renderer :abstractData="abstractData" :position="position"></array-renderer>
    <array-renderer :abstractData="auxData" :position="auxPosition"></array-renderer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Mixins } from 'vue-property-decorator'
import { Point } from 'paper-vueify'
import { MergeSort, AbstractData, ArrayData } from '../../model'
import { SortAlgorithmMixin } from './Sort'
import { ITEM_SIZES, ItemHelpers } from '../../renderer'

@Component
export default class MergeSortRenderer extends Mixins(SortAlgorithmMixin) {
  auxData: AbstractData = { id: -1 }

  get position() {
    return Point(0, -ITEM_SIZES.DIAMETER)
  }

  get auxPosition() {
    let aux = ItemHelpers.GetOffsetX(((this.auxData as ArrayData<any>).array || []).length)
    let origin = ItemHelpers.GetOffsetX(((this.abstractData as ArrayData<any>).array || []).length) + ITEM_SIZES.DIAMETER_SPACED * ((this.abstractData as ArrayData<any>).partition || [0])[0]
    return Point(origin - aux, ITEM_SIZES.DIAMETER)
  }

  InitSort(generator: () => any) {
    let sort = new MergeSort(generator)
    this.auxData = sort.auxData
    return sort
  }
}
</script>
