import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import VueKonva from "vue-konva";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircle, faSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import store from "./store";
import router from "./router";

library.add(faCircle, faSquare);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.use(VueKonva);

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  title: "Table Manager V2",
  render: h => h(App),
  created() {}
}).$mount("#app");
