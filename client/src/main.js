import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import VueSocketIOExt from 'vue-socket.io-extended';
import { io } from 'socket.io-client';
import VueRouter from 'vue-router';

const socket = io("http://127.0.0.1:3000");

Vue.use(VueSocketIOExt, socket);
Vue.use(VueRouter);

const router = new VueRouter({ 
  routes: [
    {
      path: '/',
      name: '',
     
    },
  ],
  mode:'history' 
});

Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
