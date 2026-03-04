import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./routers/index.js";
import { createPinia } from "pinia";
import "flowbite";
import AOS from "aos";
import "aos/dist/aos.css";
// FontAwesome core
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Icon packs
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

// Add all icons
library.add(fas, far, fab);
const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);

app.component("font-awesome-icon", FontAwesomeIcon);
// ✅ Init AOS
AOS.init({
  duration: 600, // thời gian animation (ms)
  easing: "ease-in-out",
  once: true, // chỉ animation một lần khi scroll xuống
});
app.mount("#app");
