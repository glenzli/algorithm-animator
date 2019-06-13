<template>
  <div id="app">
    <v-app>
      <v-navigation-drawer fxied v-model="drawer" app>
        <v-list dense>
          <v-list-group v-for="(cAlgorithms, category) in algorithms" :key="category">
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-title class="category">{{category}}</v-list-tile-title>
              </v-list-tile>
            </template>
            <template v-for="(algorithm, index) in cAlgorithms">
              <v-list-tile v-if="algorithm.id" :key="index" @click="Select(index, category)">
                <v-list-tile-title>{{algorithm.name}}</v-list-tile-title>
              </v-list-tile>
              <v-list-group v-else :key="index" sub-group no-action>
                <template v-slot:activator>
                  <v-list-tile>
                    <v-list-tile-title class="category sub">{{index}}</v-list-tile-title>
                  </v-list-tile>
                </template>
                <v-list-tile v-for="(subAlgorithm, subIndex) in algorithm" :key="subIndex" @click="Select(subIndex, category, index)">
                  <v-list-tile-title>{{subAlgorithm.name}}</v-list-tile-title>
                </v-list-tile>
              </v-list-group>
            </template>
          </v-list-group>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar color="indigo darken-2" fixed app dark>
        <v-toolbar-side-icon @click.stop="ToggleDrawer"></v-toolbar-side-icon>
        <v-toolbar-title>{{readableAlgorithmName}}</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-content>
        <v-container fluid fill-height full-width pa-0>
          <v-layout column>
            <v-flex>
              <p-canvas :autosize="true" @resize="OnResize"></p-canvas>
              <component v-if="currentAlgorithm" :is="currentAlgorithm.id" :n="n" :key="version"></component>
            </v-flex>
            <v-layout column align-center class="codebox">
              <code-renderer v-if="currentAlgorithm" :rawCode="currentAlgorithm.code"></code-renderer>
            </v-layout>
          </v-layout>
        </v-container>
      </v-content>
      <v-footer app fixed height="64">
        <v-container fluid fill-width fill-height>
          <v-layout align-center>
            <v-spacer></v-spacer>
            <v-btn icon @click="Toggle">
              <v-icon>{{ paused ? 'play_arrow' : 'pause' }}</v-icon>
            </v-btn>
            <v-btn icon @click="Replay">
              <v-icon>replay</v-icon>
            </v-btn>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <v-slider v-model="speed" :min="1" :max="12" thumb-label ticks prepend-icon="directions_walk" append-icon="directions_run"></v-slider>
            <v-spacer></v-spacer>
          </v-layout>
        </v-container>
      </v-footer>
    </v-app>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Algorithms, AlgorithmComponents } from './algorithm'
import { ITEM_SIZES, CodeRenderer } from './renderer'
import { Interact } from './model'

@Component({
  components: { ...AlgorithmComponents, CodeRenderer },
})
export default class App extends Vue {
  paused = false
  speed = 6
  n = 50
  version = 0
  drawer = false
  currentCategory = ''
  currentSubCategory = ''
  currentAlgorithmIndex = 0

  get algorithms() {
    return Algorithms
  }

  get currentAlgorithm() {
    if (this.currentCategory) {
      if (this.currentSubCategory) {
        return (this.algorithms[this.currentCategory] as { [index: string]: Array<{ name: string, id: string, code: string }> })[this.currentSubCategory][this.currentAlgorithmIndex]
      }
      return (this.algorithms[this.currentCategory] as Array<{ name: string, id: string, code: string }>)[this.currentAlgorithmIndex]
    }
    return null
  }

  get readableAlgorithmName() {
    if (this.currentCategory && this.currentAlgorithm) {
      if (this.currentSubCategory) {
        return `${this.currentCategory}::${this.currentSubCategory}::${this.currentAlgorithm.name}`
      } else {
        return `${this.currentCategory}::${this.currentAlgorithm.name}`
      }
    } else {
      return 'Algorithm'
    }
  }

  get delay() {
    return Math.pow(2, (12 - this.speed) / 2) * 15
  }

  ToggleDrawer() {
    this.drawer = !this.drawer
  }

  Select(index: number, category: string, subCategory = '') {
    this.currentCategory = category
    this.currentSubCategory = subCategory
    this.currentAlgorithmIndex = index
    Interact.paused = false
    // force canvas resize
    window.dispatchEvent(new Event('resize'))
  }

  Toggle() {
    if (Interact.paused && Interact.running === 0) {
      ++this.version
      Interact.paused = false
    } else {
      Interact.paused = !Interact.paused
    }
  }

  Replay() {
    Interact.paused = false
    ++this.version
  }

  OnResize(size: any) {
    this.n = Math.floor(size.width / ITEM_SIZES.DIAMETER_SPACED) - 1
    ++this.version
  }

  @Watch('delay')
  OnDelayChanged(delay: number) {
    Interact.delay = delay
  }

  mounted() {
    this.currentCategory = Object.keys(this.algorithms)[0]
    Interact.delay = this.delay
    Interact.OnPaused(paused => { this.paused = paused })
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
  font-family: 'Titillium Web', Consolas, 'Microsoft YaHei', sans-serif;;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100%;
  width: 100%;
}

.category {
  font-weight: bold;
  font-size: 1.1rem;

  &.sub {
    font-size: 1rem;
  }
}

.description {
  position: absolute;
  left: 10%;
  bottom: 128px;
  font-size: 1.2rem;
  width: 80%;
}

.codebox {
  flex: none;
  background: #333;
  overflow-y: auto;
}
</style>
