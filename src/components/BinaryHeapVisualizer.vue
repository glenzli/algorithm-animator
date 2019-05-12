<template>
  <div>
    <binary-heap-node-visualizer v-for="(node, index) in actualHeap" :key="index" :node="node" :heap="heap" :index="index + 1" :count="state.count" :position="position"></binary-heap-node-visualizer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { Arrayex } from 'arrayex'
import { PointObject, Point } from 'paper-vueify'
import BinaryHeapNodeVisualizer from './BinaryHeapNodeVisualizer.vue'
import { ObservableBinaryHeapNode, ObservableState, ObservableBinaryHeapState } from '../model'

@Component({
  components: { BinaryHeapNodeVisualizer },
})
export default class BinaryHeapVisualizer extends Vue {
  @Prop({ required: true }) heap!: Array<ObservableBinaryHeapNode<any>>
  @Prop({ required: true }) state!: ObservableBinaryHeapState
  @Prop({ default: () => Point(0, 0) }) position!: PointObject

  get actualHeap() {
    return this.heap.slice(1, this.state.count + 1)
  }
}
</script>
