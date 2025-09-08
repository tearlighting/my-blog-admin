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
      name: "Dashboard",
    },
    name: "Home",
    meta: {
      hidden: true,
      roles: [EPemission.visitor],
    },
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      roles: [EPemission.visitor],
      title: "login",
    },
  },
  {
    path: "/dashboard",
    component: DefaultLayout,
    meta: {
      hidden: true,
      roles: [EPemission.visitor],
    },
    children: [
      {
        path: "",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        meta: {
          keepAlive: true,
          titleKey: "router.dashboard",
          roles: [EPemission.visitor],
          icon: EIcons.Dashboard,
        },
      },
    ],
  },
  {
    path: "/level",
    component: DefaultLayout,
    redirect: "/level/menu1/menu1-1/menu1-1-1",
    name: "Level",
    meta: {
      titleKey: "router.level",
      icon: EIcons.Home,
      roles: [EPemission.visitor],
    },
    children: [
      {
        path: "Menu1",
        name: "Menu1",
        redirect: "/level/menu1/menu1-1/menu1-1-1",
        meta: {
          titleKey: "router.level.menu1",
          roles: [EPemission.visitor],
          icon: EIcons.MenuOpen,
        },
        children: [
          {
            path: "menu1-1",
            name: "Menu11",
            redirect: "/level/menu1/menu1-1/menu1-1-1",
            meta: {
              // title: t("router.level.menu1.menu11"),
              titleKey: "router.level.menu1.menu11",
              roles: [EPemission.visitor],
            },
            children: [
              {
                path: "menu1-1-1",
                name: "Menu111",
                component: () => import("@/views/menu/menu111/index.vue"),
                meta: {
                  // title: t("router.level.menu1.menu11.menu111"),
                  titleKey: "router.level.menu1.menu11.menu111",
                  roles: [EPemission.visitor],
                },
              },
            ],
          },
          {
            path: "menu1-2",
            name: "Menu12",
            component: () => import("@/views/menu/menu12/index.vue"),
            meta: {
              // title: t("router.level.menu1.menu12"),
              titleKey: "router.level.menu1.menu12",
              roles: [EPemission.visitor],
            },
          },
        ],
      },
    ],
  },
])

const router = createRouter({
  history: createWebHistory(),
  routes: routes as RouteRecordRaw[],
})

export default router
