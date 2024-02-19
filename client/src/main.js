import Vue from 'vue';
import ElementUI from 'element-ui';
import service from '@/service';
import 'normalize.css/normalize.css';
import axios from 'axios';
import App from './App';
import router from './router';
import './static/styles/theme.less';
import './static/styles/index.scss';

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

Vue.use(ElementUI, {
  size: 'small', // set element-ui default size
});
Vue.prototype.$service = service;
Vue.config.productionTip = false;
new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
