const admin = [
  // Router for admin login page (separated from admin routes).
  {
    path: "/",
    redirect: "/login",
  },

  {
    path: "/login",
    name: "admin.login",
    component: () => import("@/pages/login.vue"),
    meta: {
      title: "Home - CTU",
    },
  },

  // HOME ROUTER WITH CHILD ROUTES
  {
    path: "/home",
    name: "admin.home",
    component: () => import("@/layouts/home.vue"),
    meta: {
      title: "Home - CTU",
    },
    children: [
      // DASHBOARD
      {
        path: "dashboard",
        name: "admin.dashboard",
        component: () => import("@/pages/dashboard.vue"),
        meta: {
          title: "Dashboard - CTU",
        },
      },

      // USERS
      {
        path: "users",
        name: "admin.users",
        component: () => import("@/pages/users/index.vue"),
        meta: { title: "Users - CTU" },
      },

      // Details user
      {
        path: "users/:email",
        name: "UserDetail",
        component: () => import("@/pages/users/detail.vue"),
        meta: { title: "User Detail - CTU" },
      },

      // Update user
      {
        path: "users/:email/edit",
        name: "UserEdit",
        component: () => import("@/pages/users/updateInfo.vue"),
        meta: { title: "Update User - CTU" },
      },

      // ROLES
      {
        path: "roles",
        name: "admin.roles",
        component: () => import("@/pages/roles/index.vue"),
        meta: { title: "Roles - CTU" },
      },

      // Edit role
      {
        path: "roles/:role_id/edit",
        name: "RoleEdit",
        component: () => import("@/pages/roles/updateInfo.vue"),
        meta: { title: "Edit Role - CTU" },
      },

      // PORTS
      {
        path: "ports",
        name: "admin.ports",
        component: () => import("@/pages/ports/index.vue"),
        meta: { title: "Ports - CTU" },
      },

      // SHIPS
      {
        path: "ships",
        name: "admin.ships",
        component: () => import("@/pages/ships/index.vue"),
        meta: { title: "Ships - CTU" },
      },

      // Ship detail
      {
        path: "ships/:ship_id",
        name: "ShipDetail",
        component: () => import("@/pages/ships/detail.vue"),
        meta: { title: "Ship Detail - CTU" },
      },
      // Update ship
      {
        path: "ships/:ship_id/edit",
        name: "ShipEdit",
        component: () => import("@/pages/ships/updateInfo.vue"),
        meta: { title: "Update Ship - CTU" },
      },

      // SCHEDULES
      {
        path: "schedules",
        name: "admin.schedules",
        component: () => import("@/pages/schedules/index.vue"),
        meta: { title: "Schedules - CTU" },
      },
    ],
  },
];
export default admin;
