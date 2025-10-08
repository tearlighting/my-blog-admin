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
      name: "home",
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
    component: () => import("@/views/waitingLogin/index.vue"),
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
    name: "blog",
    meta: {
      titleKey: "router.blog",
      roles: [EPemission.user, EPemission.admin],
    },
    children: [
      {
        path: "type",
        name: "blogType",
        meta: {
          keepAlive: true,
          titleKey: "router.blog.blogType",
          roles: [EPemission.user, EPemission.admin],
          icon: EIcons.MenuOpen,
        },
        component: () => import("@/views/blog/blogType/index.vue"),
      },
      {
        path: "list",
        name: "blogList",
        component: () => import("@/views/blog/blogList/index.vue"),
        meta: {
          keepAlive: true,
          titleKey: "router.blog.blogList",
          roles: [EPemission.user, EPemission.admin],
        },
      },
      {
        path: "detail",
        name: "blogDetail",
        component: () => import("@/views/blog/blogDetail/index.vue"),
        meta: {
          keepAlive: true,
          hidden: true,
          titleKey: "router.blog.blogDetail",
          roles: [EPemission.user, EPemission.admin],
        },
      },
    ],
  },
  {
    path: "/message",
    component: DefaultLayout,
    meta: {
      hidden: true,
      roles: [EPemission.user, EPemission.admin],
    },
    children: [
      {
        path: "",
        name: "message",
        component: () => import("@/views/message/index.vue"),
        meta: {
          //   keepAlive: true,
          titleKey: "router.message",
          roles: [EPemission.user, EPemission.admin],
          icon: EIcons.Dashboard,
        },
      },
    ],
  },
  {
    path: "/project",
    component: DefaultLayout,
    name: "project",
    meta: {
      titleKey: "router.project",
      roles: [EPemission.user, EPemission.admin],
    },
    children: [
      {
        path: "list",
        name: "projectList",
        meta: {
          //   keepAlive: true,
          titleKey: "router.project.projectList",
          roles: [EPemission.user, EPemission.admin],
          icon: EIcons.MenuOpen,
        },
        component: () => import("@/views/project/projectList/index.vue"),
      },
      {
        path: "list",
        name: "projectDetail",
        meta: {
          //   keepAlive: true,
          hidden: true,
          titleKey: "router.project.projectDetail",
          roles: [EPemission.user, EPemission.admin],
          icon: EIcons.MenuOpen,
        },
        component: () => import("@/views/project/projectDetail/index.vue"),
      },
    ],
  },
  {
    path: "/utils",
    component: DefaultLayout,
    meta: {
      titleKey: "router.utils",
      roles: [EPemission.user, EPemission.admin],
    },
    children: [
      {
        path: "imgupload",
        name: "imgupload",
        component: () => import("@/views/utils/imgUploader/index.vue"),
        meta: {
          titleKey: "router.utils.imgupload",
          roles: [EPemission.user, EPemission.admin],
          icon: EIcons.Dashboard,
        },
      },
    ],
  },
])

const router = createRouter({
  history: createWebHistory(),
  routes: routes as RouteRecordRaw[],
})

export default router
