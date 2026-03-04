import { createRouter, createWebHashHistory } from "vue-router";
import admin from "./admin.router";
// import { useAuthStore } from "@/stores/authenticate-login";
import PageNotFound from "@/pages/404page.vue";
const routes = [
  ...admin,
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: PageNotFound,
    meta: {
      title: "404 - Page Not Found",
    },
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // const authStore = useAuthStore();
  document.title = to.meta?.title ?? "No title page!!!";
  next();
  // if (to.path.startsWith("/admin") && !authStore.isLogged) {
  //   next({ name: "admin.login" });
  // } else {
  //   next();
  // }
});
export default router;
