<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item v-for="route in routeList" :key="route.name" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  data() {
    return {
      routeList: [
        {
          path: '',
          children: [{
            path: 'statistics/index',
            name: 'statistics.index',
            meta: { title: '数据统计', icon: 'chart', noCache: true }
          }]
        },
        {
          path: '',
          children: [{
            path: 'message',
            name: 'message',
            meta: { title: '发送短信', icon: 'email', noCache: true }
          }]
        },
        {
          path: '',
          children: [{
            path: 'sendRecord',
            name: 'sendRecord',
            meta: { title: '发送记录', icon: 'table', noCache: true }
          }]
        },
        {
          path: '/template',
          name: 'template',
          meta: { title: '模板管理', icon: 'example', noCache: true },
          children: [{
            path: '/template/marketing',
            name: 'template.marketing',
            meta: { title: '营销' }
          },
          {
            path: '/template/notice',
            name: 'template.notice',
            meta: { title: '通知' }
          }]
        },
        {
          path: '/group',
          name: 'group',
          children: [{
            path: '/group/list',
            name: 'group.list',
            meta: { title: '群组列表', icon: 'peoples' }
          }]
        },
        // {
        //   path: ' ',
        //   redirect: '/group/list',
        //   name: 'group',
        //   meta: {
        //     title: '群组管理',
        //     icon: 'peoples'
        //   },
        //   children: [
        //     {
        //       path: '/group/list',
        //       name: 'groupList',
        //       meta: { title: '群组列表', noCache: true }
        //     }
        //   ]
        // },
        {
          path: '/system',
          name: 'system',
          meta: {
            title: '系统配置',
            icon: 'list'
          },
          children: [
            {
              path: '/system/sign',
              name: 'system.systemSign',
              meta: { title: '签名配置' }
            },
            {
              path: '/system/temp',
              name: 'system.temp',
              meta: { title: '模板配置' }
            },
            {
              path: '/system/site',
              name: 'system.systemSite',
              meta: { title: '站点管理' }
            },
            {
              path: '/system/message',
              name: 'system.message',
              meta: { title: '短信平台' }
            }
          ]
        }

      ]
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<!--
 list:[
        {path:'',redirect:'message',children:[{name:'message',path:'message',meta:{icon:'email',title:'发送短信'}}]},
        {
          name:"system",
          path:"/system",
          redirect:"noredirect",
          meta:{
            icon:list,
            title: '系统配置'
          },
          children:[
            {
              meta:{title:'签名配置'},
              name: 'system.systemSign',
              path: 'sign'
            },
            {
              meta:{title:'模板配置'},
              name: 'system.temp',
              path: 'temp'
            },
            {
              meta:{title:'站点管理'},
              name: 'system.systemSite',
              path: 'site'
            },
            {
              meta:{title:'短信平台'},
              name: 'system.message',
              path: 'message'
            }
          ]
        }
      ],
-->
