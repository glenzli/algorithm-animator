<template>
  <div id="app">
    <p-canvas :autosize="true"></p-canvas>
    <component :is="algorithm" :paused="paused" :delay="delay"></component>
    <div class="panel">
      <div class="config">
        <div class="button g" :class="{ selected: delay === 1000 }" @click="SetDelay(1000)">Extremely Slow</div>
        <div class="button g" :class="{ selected: delay === 500 }" @click="SetDelay(500)">Slow</div>
        <div class="button g" :class="{ selected: delay === 300 }" @click="SetDelay(300)">Normal</div>
        <div class="button g" :class="{ selected: delay === 100 }" @click="SetDelay(100)">Fast</div>
        <div class="button g" :class="{ selected: delay === 50 }" @click="SetDelay(50)">Extremely Fast</div>
        <div class="button" @click="ToggleAnimation">{{ paused ? 'Continue' : 'Pause' }}</div>
      </div>
      <div class="list">
        <div class="category" v-for="(category, index) in categories" :key="index" :class="{ selected: index === activeCategory }" @click="SelectCategory(index)">{{category}}</div>
        <div class="seperator"></div>
        <div class="tag" v-for="(tag, index) in candidateAlgorithms" :key="`a${index}`" :class="{ selected: index === activeAlgorithm }" @click="SelectAlgorithm(index)">{{tag.name}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Arrayex } from 'arrayex'
import { AlgorithmComponents, AlgorithmCategories } from './algorithm'

@Component({
  components: { ...AlgorithmComponents },
})
export default class App extends Vue {
  activeCategory = 0
  activeAlgorithm = 0
  paused = false
  delay = 500

  get categories() {
    return Object.keys(AlgorithmCategories)
  }

  get candidateAlgorithms() {
    return AlgorithmCategories[this.categories[this.activeCategory]]
  }

  get algorithm() {
    return this.candidateAlgorithms[this.activeAlgorithm].id
  }

  SelectCategory(index: number) {
    this.activeCategory = index
    this.SelectAlgorithm(0)
  }

  SelectAlgorithm(index: number) {
    this.activeAlgorithm = index
    this.paused = false
  }

  ToggleAnimation() {
    this.paused = !this.paused
  }

  SetDelay(delay: number) {
    this.delay = delay
  }

  mounted() {
    this.SetDelay(300)
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
  flex-direction: column;
}

.config {
  display: flex;
  align-items: center;
  justify-content: center;

  .button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: #333;
    color: #eee;
    user-select: none;
    cursor: pointer;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    margin: 0 1rem;

    &:hover {
      background: #555;
    }

    &.g {
      margin: 0;
      border-radius: 0;
      padding: 0.5rem;

      &.selected {
        background: #962222;
      }
    }
  }

  margin: 1rem;
}

.list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex: 1;

  .category, .tag {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: #333;
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

  .category {
    padding: 0.5rem 1rem;
  }

  .tag {
    border-radius: 0.25rem;
    margin: 0.25rem;
    padding: 0.25rem 0.5rem;
  }

  .seperator {
    width: 2rem;
  }
}
</style>
