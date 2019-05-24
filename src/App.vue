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
            <v-list-tile v-for="algorithm in cAlgorithms" :key="algorithm.id" @click="Select(algorithm.id, category)">
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
      </v-toolbar>
      <v-content>
        <v-container fluid fill-height full-width pa-0>
          <p-canvas :autosize="true" @resize="OnResize"></p-canvas>
          <component v-if="currentAlgorithmId" :is="currentAlgorithmId" :n="n" :key="key" :paused="paused" :delay="delay" @complete="Complete"></component>
        </v-container>
      </v-content>
      <v-footer app fixed height="64">
        <v-container fluid fill-width fill-height>
          <v-layout align-center>
            <v-btn icon @click="Toggle">
              <v-icon>{{ paused ? 'play_arrow' : 'pause' }}</v-icon>
            </v-btn>
            <v-btn icon @click="Replay">
              <v-icon>replay</v-icon>
            </v-btn>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <v-slider v-model="speed" :min="1" :max="12" thumb-label="always" ticks prepend-icon="directions_walk" append-icon="directions_run"></v-slider>
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

@Component({
  components: { ...AlgorithmComponents },
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

  Select(id: string, category: string) {
    this.currentCategory = category
    this.currentAlgorithmId = id
    this.paused = false
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
  }

  Replay() {
    ++this.key
    this.complete = false
    this.paused = false
  }

  OnResize(size: any) {
    this.n = Math.ceil(size.width / 48)
    ++this.key
  }

  mounted() {
    this.currentCategory = Object.keys(this.algorithms)[0]
    this.currentAlgorithmId = this.algorithms[this.currentCategory][0].id
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
</style>
