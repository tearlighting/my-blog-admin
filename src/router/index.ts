import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"
import DefaultLayout from "@/layout/DefaultLayout.vue"
import { EPemission } from "@/constants"
import { EIcons } from "@/constants/icons"
import { createRoutes } from "@/utils"

/**
 * 设计的就是具名路由,想要keepAlive的话,组件里面必须同步设置name,否则无法生效
 */

export const routes = createRoutes([
  {
    path: "/",
    redirect: {
      name: "login",
    },
    meta: {
      hidden: true,
      roles: [EPemission.visitor, EPemission.user, EPemission.admin],
    },
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    name: "login",
    meta: {
      roles: [EPemission.visitor, EPemission.user, EPemission.admin],
      title: "login",
      hidden: true,
    },
  },
  {
    name: "waitingLogin",
    path: "/waitingLogin",
    component: () => import("@/views/waitLogin/index.vue"),
    meta: {
      roles: [EPemission.visitor, EPemission.user, EPemission.admin],
      title: "waitingLogin",
      hidden: true,
    },
  },
  //   {
  //     path: "/dashboard",
  //     component: DefaultLayout,
  //     meta: {
  //       hidden: true,
  //       roles: [EPemission.visitor],
  //     },
  //     children: [
  //       {
  //         path: "",
  //         name: "Dashboard",
  //         component: () => import("@/views/dashboard/index.vue"),
  //         meta: {
  //           keepAlive: true,
  //           titleKey: "router.dashboard",
  //           roles: [EPemission.visitor],
  //           icon: EIcons.Dashboard,
  //         },
  //       },
  //     ],
  //   },

  {
    path: "/home",
    component: DefaultLayout,
    meta: {
      hidden: true,
      roles: [EPemission.user, EPemission.admin],
    },
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/views/home/index.vue"),
        meta: {
          keepAlive: true,
          titleKey: "router.home",
          roles: [EPemission.user, EPemission.admin],
          icon: EIcons.Dashboard,
        },
      },
    ],
  },
  {
    path: "/blog",
    component: DefaultLayout,
    redirect: {
      name: "blogType",
    },
    name: "blog",
    meta: {
      titleKey: "router.blog",
      icon: EIcons.Home,
      roles: [EPemission.visitor, EPemission.user, EPemission.admin],
    },
    children: [
      {
        path: "type",
        name: "blogType",
        meta: {
          titleKey: "router.blog.blogType",
          roles: [EPemission.visitor, EPemission.user, EPemission.admin],
          icon: EIcons.MenuOpen,
        },
        component: () => import("@/views/blog/blogType/index.vue"),
        // children: [
        //   {
        //     path: "menu1-1",
        //     name: "Menu11",
        //     redirect: "/level/menu1/menu1-1/menu1-1-1",
        //     meta: {
        //       // title: t("router.level.menu1.menu11"),
        //       titleKey: "router.level.menu1.menu11",
        //       roles: [EPemission.visitor],
        //     },
        //     children: [
        //       {
        //         path: "menu1-1-1",
        //         name: "Menu111",
        //         component: () => import("@/views/menu/menu111/index.vue"),
        //         meta: {
        //           // title: t("router.level.menu1.menu11.menu111"),
        //           titleKey: "router.level.menu1.menu11.menu111",
        //           roles: [EPemission.visitor],
        //         },
        //       },
        //     ],
        //   },
        //   {
        //     path: "menu1-2",
        //     name: "Menu12",
        //     component: () => import("@/views/menu/menu12/index.vue"),
        //     meta: {
        //       // title: t("router.level.menu1.menu12"),
        //       titleKey: "router.level.menu1.menu12",
        //       roles: [EPemission.visitor],
        //     },
        //   },
        // ],
      },
    ],
  },
])

const router = createRouter({
  history: createWebHistory(),
  routes: routes as RouteRecordRaw[],
})

export default router
