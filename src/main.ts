import Vue from 'vue'
import App from './App.vue'
import PaperVueify from 'paper-vueify'
import paper from 'paper'
import Vuetify from 'vuetify'

Vue.config.productionTip = false
Vue.use(Vuetify)
Vue.use(PaperVueify, paper)

new Vue({
  render: (h) => h(App),
}).$mount('#app')
