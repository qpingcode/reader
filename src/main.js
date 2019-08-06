import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import './assets/js/VueTouch.js'
import ba from 'vue-ba'

Vue.config.productionTip = false


// 增加百度统计
Vue.use(ba, '764983231767f686c84e1180cd32e85b')


router.afterEach((to, from, next) => {
    window.scrollTo(0, 0);
})

new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app')
