import Vue from 'vue'
import App from './App.vue'
import PaperVueify from 'paper-vueify'
import paper from 'paper'

Vue.config.productionTip = false
Vue.use(PaperVueify, paper)

new Vue({
  render: (h) => h(App),
}).$mount('#app')
