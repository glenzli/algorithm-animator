<template>
  <div>
    <array-renderer :array="array" :state="state"></array-renderer>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Vue } from 'vue-property-decorator'
import { Arrayex } from 'arrayex'
import { ObservableArray, ArrayItem, $olink, ObservableArrayState, Sleep, ArrayItemState } from '../../model'
import { ArrayRenderer } from '../../components'
import { NumericArrayAlgorithmMixin } from './NumericArrayAlgorithm'

@Component({
  components: { ArrayRenderer },
})
export default class ShellSort extends Mixins(NumericArrayAlgorithmMixin) {
  state: ObservableArrayState = { locators: [-1], partition: [0, 0], seperators: [-1] }

  async ShellSortOnce(array: ObservableArray<number>, delta: number, from: number) {
    let subArray = []
    for (let i = from; i < array.length; i += delta) {
      subArray.push(array.Get(i, ArrayItemState.Accessed)!)
    }
    await Sleep(this.delay)
    subArray = subArray.sort((a, b) => b - a)
    for (let i = from; i < array.length; i += delta) {
      array.Set(i, subArray.pop()!, ArrayItemState.Selected)
    }
    await Sleep(this.delay)
    array.Restore()
  }

  async RunShellSort(array: ObservableArray<number>) {
    this.PointTo(0)
    let interval = array.length
    await Sleep(this.delay)
    while (interval > 2) {
      this.PointTo(1)
      await Sleep(this.delay)
      this.PointTo(2)
      interval = Math.ceil(interval / 2)
      await Sleep(this.delay)
      for (let i = 0; i < interval; ++i) {
        this.PointTo(3)
        await Sleep(this.delay)
        this.PointTo(4)
        await this.ShellSortOnce(array, interval, i)
      }
    }
    array.Restore()
    await this.RunInsertionsort(array)
  }

  async RunInsertionsort(array: ObservableArray<number>) {
    for (let i = 1; i < array.length; ++i) {
      Vue.set(this.state.locators!, 0, i - 1)
      Vue.set(this.state.seperators!, 0, i - 1)
      let current = array.Get(i, ArrayItemState.Accessed)!
      await Sleep(this.delay)
      await this.Continue()
      let j = i - 1
      for (; j >= 0; --j) {
        if (current > array.Get(j, ArrayItemState.Accessed)!) {
          array.State(ArrayItemState.None, j)
          break
        }
      }
      if (j !== i - 1) {
        await Sleep(this.delay)
        await this.Continue()
        await array.Move(i, j + 1)
        await this.Continue()
      }
      array.PartialRestore(ArrayItemState.Accessed)
      await this.Continue()
    }
    this.state.locators = [-1]
    this.state.seperators = [-1]
  }

  async Run() {
    let observer = $olink.Get<ObservableArray<any>>(this.array.id)!
    await this.RunShellSort(observer)
    this.OnComplete()
  }

  mounted() {
    this.CreateArray()
    this.Run()
  }
}

export const PseudoCode = `
{shellSort} (A):
  d ← A.{length}
  {while} d > 1:
    d = ⌈d / 2⌉
    {for} i ∈ [0, d):
      {insertionSort}(A[i; i + d; ...; i + k * d; ...])
`

</script>
