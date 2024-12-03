export default {
  path: "/fighting",
  meta: {
    title: "励志"
  },
  children: [
    {
      path: "/fighting/index",
      name: "Fighting",
      component: () => import("@/views/fighting/index.vue"),
      meta: {
        title: "加油"
        // 通过设置显示父级,如果只有一个子菜单可以用这种方式
        // showParent: true
      }
    },
    {
      // 如果有多个子菜单，可以直接显示
      path: "/fighting/effect",
      name: "Effect",
      component: () => import("@/views/fighting/effect.vue"),
      meta: {
        title: "努力"
      }
    }
  ]
} as RouteConfigsTable;
