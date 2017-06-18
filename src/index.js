import Vue from 'vue';

import layout from './pages/layout.vue';

const app = new Vue({
  el: '#app',
  render: h => h( layout )
}).$mount('#app');

export default app;
