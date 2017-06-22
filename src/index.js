import Vue from 'vue';
import VueResource from 'vue-resource';
import layout from './pages/layout.vue';

Vue.use( VueResource );

const app = new Vue({
  el: '#app',
  render: h => h( layout )
}).$mount('#app');

export default app;
