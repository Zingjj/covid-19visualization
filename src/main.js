import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueResource from 'vue-resource';
import echarts from 'echarts'
import "echarts/map/js/world.js";
import "echarts/map/js/china.js";
import "echarts/extension-src/bmap/bmap.js"
import "echarts-gl" //3D地图插件

Vue.prototype.$echarts = echarts

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(VueResource);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
