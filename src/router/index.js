import { createRouter, createWebHashHistory } from "vue-router";
import store from "../store"

//showProjectSelect 是否在header上显示项目下拉框，默认false
const routes = [
  {
    path: '/',
    redirect: '/managedevice'
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录'
    },
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    children: [
      {
        path: '/managedevice',
        name: 'managedevice',
        meta: {
          title: '设备管理',
          keepAlive: true
        },
        component: () => import('@/views/project-device/ManageDevice.vue')
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: {
          title: '首页'
        },
        component: () => import('@/views/Dashboard.vue')
      },
      {
        path: '/createproject',
        name: 'createproject',
        meta: {
          title: '创建项目'
        },
        component: () => import('@/views/project-device/CreateProject.vue')
      },
      {
        path: '/editproject',
        name: 'editproject',
        meta: {
          title: '编辑项目'
        },
        component: () => import('@/views/project-device/EditProject.vue')
      },
      {
        path: '/manageproject',
        name: 'manageproject',
        meta: {
          title: '项目管理',
          keepAlive: true
        },
        component: () => import('@/views/project-device/ManageProject.vue')
      },
      {
        path: '/managetag',
        name: 'managetag',
        meta: {
          title: '标签管理'
        },
        component: () => import('@/views/project-device/ManageTag.vue')
      },
      {
        path: '/devicedetail',
        name: 'devicedetail',
        meta: {
          title: '设备详情'
        },
        component: () => import('@/views/project-device/DeviceDetail.vue')
      },
      {
        path: '/editdevice',
        name: 'editdevice',
        meta: {
          title: '编辑设备信息'
        },
        component: () => import('@/views/project-device/EditDevice.vue')
      },
      {
        path: '/devicebinding',
        name: 'devicebinding',
        meta: {
          title: '设备绑定'
        },
        component: () => import('@/views/project-device/DeviceBinding.vue')
      },
      {
        path: '/devicebindingbatch',
        name: 'devicebindingbatch',
        meta: {
          title: '设备批量绑定'
        },
        component: () => import('@/views/project-device/DeviceBindingBatch.vue')
      },
      {
        path: '/manageprojectdevice',
        name: 'manageprojectdevice',
        meta: {
          title: '项目设备管理',
          showProjectSelect: true,
          keepAlive: true
        },
        component: () => import('@/views/project-device/ManageProjectDevice.vue')
      },
      {
        path: '/projectdevicedetail',
        name: 'projectdevicedetail',
        meta: {
          title: '项目设备详情'
        },
        component: () => import('@/views/project-device/ProjectDeviceDetail.vue')
      },
      {
        path: '/alarmsetting',
        name: 'alarmsetting',
        meta: {
          title: '预警设置'
        },
        component: () => import('@/views/project-device/AlarmSetting.vue')
      },
      {
        path: '/pointbinding',
        name: 'pointbinding',
        meta: {
          title: '项目点位设置',
          showProjectSelect: true
        },
        component: () => import('@/views/project-device/PointBinding.vue')
      },
      {
        path: '/projectalarm',
        name: 'projectalarm',
        meta: {
          title: '项目预警中心',
          showProjectSelect: true
        },
        component: () => import('@/views/monitor/ProjectAlarm.vue')
      },
      {
        path: '/viewpoint',
        name: 'viewpoint',
        meta: {
          title: '点位监测',
          showProjectSelect: true
        },
        component: () => import('@/views/monitor/ViewPoint.vue')
      },
      {
        path: '/viewreport',
        name: 'viewreport',
        meta: {
          title: '数据报告',
          showProjectSelect: true
        },
        component: () => import('@/views/monitor/ViewReport.vue')
      },
      {
        path: '/viewreportoverall',
        name: 'viewreportoverall',
        meta: {
          title: '报告总览',
          showProjectSelect: true
        },
        component: () => import('@/views/monitor/ViewReportOverall.vue')
      },
      {
        path: '/manageuser',
        name: 'manageuser',
        meta: {
          title: '用户管理'
        },
        component: () => import('@/views/system/ManageUser.vue')
      },
      {
        path: '/deviceconfig',
        name: 'deviceconfig',
        meta: {
          title: '设备初始化'
        },
        component: () => import('@/views/system/DeviceConfig.vue')
      },
    ]
  },
]
const updateHeader = (to) => {
  store.commit('setShowProjectSelect', !!to.meta.showProjectSelect)
}
const router = createRouter({
  history: createWebHashHistory(),//createWebHistory、createWebHashHistory
  routes,
})
router.beforeEach((to, from, next) => {
  // document.title = `${to.meta.title}`;
  let token = localStorage.getItem('token')
  if (!token && to.path !== '/login') {
    next('/login');
  } else {
    next();
  }
  updateHeader(to)
});

export default router;