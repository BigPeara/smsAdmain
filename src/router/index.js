import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'
// import Contacts from '@/views/group/contacts.vue'
import group from './modules/group'
import system from './modules/system'
import template from './modules/template'
export const constantRouterMap = [{
        path: '/login',
        name: 'login',
        component: () =>
            import ('@/views/login/index'),
        hidden: true
    },
    {
        path: '/404',
        component: () =>
            import ('@/views/errorPage/404'),
        hidden: true
    },
    {
        path: '/401',
        component: () =>
            import ('@/views/errorPage/401'),
        hidden: true
    },
    {
        path: '',
        component: Layout,
        redirect: 'statistics/index',
        children: [{
            path: 'statistics/index',
            component: () =>
                import ('@/views/statistics/index'),
            name: 'statistics.index',
            meta: { title: '数据统计', icon: 'chart', noCache: true }
        }]
    },
    {
        path: '',
        component: Layout,
        redirect: 'statistics',
        children: [{
            path: 'account',
            component: () =>
                import ('@/views/account/index'),
            name: 'account',
            meta: { title: '账号信息', icon: 'chart', noCache: true }
        }]
    },
    {
        path: '',
        component: Layout,
        redirect: 'message',
        children: [{
            path: 'message',
            component: () =>
                import ('@/views/message/index'),
            name: 'message',
            meta: { title: '发送短信', icon: 'email', noCache: true }
        }]
    },
    {
        path: '',
        component: Layout,
        redirect: 'smart',
        children: [{
            path: 'smart',
            component: () =>
                import ('@/views/smart/index'),
            name: 'smart',
            meta: { title: '智能推送', icon: 'guide', noCache: true }
        }]
    },
    {
        path: '',
        component: Layout,
        redirect: 'sendRecord',
        children: [{
            path: 'sendRecord',
            component: () =>
                import ('@/views/sendRecord/index'),
            name: 'sendRecord',
            meta: { title: '发送记录', icon: 'table', noCache: true }
        }]
    },
    group,
    system,
    template,
    {
        path: '',
        component: Layout,
        redirect: 'contacts',
        children: [{
            path: '/group/contacts/:id',
            component: () =>
                import ('@/views/group/contacts'),
            name: 'contacts',
            meta: { title: '联系人', noCache: true }
        }]
    }
]

export default new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
})

export const asyncRouterMap = [
    { path: '*', redirect: '/404', hidden: true }
]