<template>
  <div id="app">
    <v-app>
      <v-navigation-drawer fxied v-model="drawer" app>
        <v-list dense>
          <v-list-group v-for="(cAlgorithms, category) in algorithms" :key="category">
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title class="category">{{category}}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
            <v-list-tile v-for="algorithm in cAlgorithms" :key="algorithm.id" @click="Select(algorithm.id, category, algorithm.code)">
              <v-list-tile-content>
                <v-list-tile-title>{{algorithm.name}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
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
              <component v-if="currentAlgorithmId" :is="currentAlgorithmId" :n="n" :key="key" :paused="paused" :delay="delay" @complete="Complete" @point="PointTo"></component>
            </v-flex>
            <v-layout column align-center class="codebox">
              <code-renderer :rawCode="currentAlogorithmCode" :pointer="codePointer"></code-renderer>
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
import { Component, Vue } from 'vue-property-decorator'
import { Arrayex } from 'arrayex'
import { AlgorithmComponents, AlgorithmCategories } from './algorithm'
import { CodeRenderer } from './components'
import { NODESIZE_X_PLUS } from './components'

@Component({
  components: { ...AlgorithmComponents, CodeRenderer },
})
export default class App extends Vue {
  paused = false
  complete = false
  speed = 6
  n = 50
  key = 0
  drawer = false
  currentCategory = ''
  currentAlgorithmId = ''
  currentAlogorithmCode = '' as string | undefined
  codePointer = -1

  get algorithms() {
    return AlgorithmCategories
  }

  get readableAlgorithmName() {
    let name = this.currentAlgorithmId.substr(0, this.currentAlgorithmId.length - this.currentCategory.length)
    return `${this.currentCategory}::${name}`
  }

  get delay() {
    return Math.pow(2, (12 - this.speed) / 2) * 15
  }

  ToggleDrawer() {
    this.drawer = !this.drawer
  }

  Select(id: string, category: string, code: string) {
    this.currentCategory = category
    this.currentAlgorithmId = id
    this.currentAlogorithmCode = code
    this.paused = false
    this.codePointer = -1
    // force canvas resize
    window.dispatchEvent(new Event('resize'))
  }

  Toggle() {
    if (!this.complete) {
      this.paused = !this.paused
    } else {
      this.Replay()
    }
  }

  Complete() {
    this.paused = true
    this.complete = true
    this.codePointer = -1
  }

  Replay() {
    ++this.key
    this.complete = false
    this.paused = false
  }

  PointTo(pointer: number) {
    this.codePointer = pointer
  }

  OnResize(size: any) {
    this.n = Math.floor(size.width / NODESIZE_X_PLUS) - 1
    ++this.key
  }

  mounted() {
    this.currentCategory = Object.keys(this.algorithms)[0]
    this.currentAlgorithmId = this.algorithms[this.currentCategory][0].id
    this.currentAlogorithmCode = this.algorithms[this.currentCategory][0].code
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

.category {
  font-weight: bold;
  font-size: 1.1rem;
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
