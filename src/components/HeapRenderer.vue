<template>
  <div>
    <heap-node-renderer v-for="(node, index) in actualHeap" :key="index" :node="node" :heap="heap" :index="index + 1" :count="state.count" :position="position"></heap-node-renderer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { Arrayex } from 'arrayex'
import { PointObject, Point } from 'paper-vueify'
import HeapNodeRenderer from './HeapNodeRenderer.vue'
import { HeapNode, HeapState } from '../model'

@Component({
  components: { HeapNodeRenderer },
})
export default class HeapRenderer extends Vue {
  @Prop({ required: true }) heap!: Array<HeapNode<any>>
  @Prop({ required: true }) state!: HeapState
  @Prop({ default: () => Point(0, 0) }) position!: PointObject

  get actualHeap() {
    return this.heap.slice(1, this.state.count + 1)
  }
}
</script>
