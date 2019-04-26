<template>
  <div>
    <array-item-visualizer v-for="(item, index) in array" :key="index" :item="item" :index="index" :seperated="seperations[index]" :pointer="pointers[index]" :total="size" :yBase="yBase"></array-item-visualizer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import ArrayItemVisualizer from './ArrayItemVisualizer.vue'
import { ObservableArrayItem, ObservableArrayState } from '../model'

@Component({
  components: { ArrayItemVisualizer },
})
export default class ArrayVisualizer extends Vue {
  @Prop({ required: true }) array!: Array<ObservableArrayItem<any>>
  @Prop({ default: () => ({}) }) state!: ObservableArrayState
  @Prop({ default: 0 }) yBase!: number

  get size() {
    return this.array.length
  }

  get pointers() {
    if (this.state.pointers && this.state.pointers.length > 0) {
      return this.array.map((_, index) => this.state.pointers!.includes(index))
    } else {
      return this.array.map(() => false)
    }
  }

  get seperations() {
    if (this.state.seperation && this.state.seperation[1] > this.state.seperation[0]) {
      return this.array.map((_, index) => index >= this.state.seperation![0] && index <= this.state.seperation![1])
    } else {
      return this.array.map(() => false)
    }
  }
}
</script>
