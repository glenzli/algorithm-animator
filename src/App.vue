<template>
  <div id="app">
    <p-canvas :autosize="true"></p-canvas>
    <component :is="current"></component>
    <div class="panel">
      <div class="config"></div>
      <div class="list">
        <div class="tag" v-for="(tag, index) in algorithms" :key="index" :class="{ selected: index === active }" @click="Select(index)">{{tag}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AlgorithmComponents } from './algorithm'

@Component({
  components: { ...AlgorithmComponents },
})
export default class App extends Vue {
  algorithms = Object.keys(AlgorithmComponents)
  active = 0

  get current() {
    return this.algorithms[this.active]
  }

  Select(index: number) {
    this.active = index
  }
}
</script>

<style lang="less">
html, body {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

#app {
  font-family: 'Titillium Web', sans-serif;;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100%;
  width: 100%;
}

.panel {
  position: fixed;
  left: 50%;
  bottom: 5%;
  transform: translate(-50%, 0);
  display: flex;
  flex-direction: row;
}

.list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex: 1;

  .tag {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: #333;
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
    margin: 0.25rem;
    color: #eee;
    user-select: none;
    cursor: pointer;

    &.selected {
      background: #962222;
    }

    &:hover {
      background: #555;
    }
  }
}
</style>
