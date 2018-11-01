import Layout from '@/views/layout/Layout'

const groupRouter = {
    path: '/group',
    component: Layout,
    redirect: 'noredirect',
    name: 'group',
    meta: {
        title: '群组管理',
        icon: 'peoples'
    },
    children: [{
            path: 'list',
            component: () =>
                import ('@/views/group/list'),
            name: 'groupList',
            meta: { title: '群组列表', noCache: true }
        }, ,
        {
            path: 'contacts',
            component: () =>
                import ('@/views/group/contacts'),
            name: 'groupContacts',
            meta: { title: '联系人', noCache: true }
        }
    ]
}

export default groupRouter
