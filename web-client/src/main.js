import Vue from 'vue'
import App from './App.vue'
import router from './router'
import HeyUI from 'heyui'
import 'heyui/themes/index.css'
import './assets/less/public.less'

Vue.config.productionTip = false
Vue.use(HeyUI)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
