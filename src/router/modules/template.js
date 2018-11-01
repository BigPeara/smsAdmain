import Layout from '@/views/layout/Layout'

const templateRouter = {
    path: '/template',
    component: Layout,
    redirect: 'noredirect',
    name: 'template',
    meta: {
        title: '模板管理',
        icon: 'example'
    },
    children: [{
            path: 'marketing',
            component: () =>
                import ('@/views/template/marketing'),
            name: 'marketing',
            meta: { title: '营销模板', noCache: true }
        },
        {
            path: 'notice',
            component: () =>
                import ('@/views/template/notice'),
            name: 'notice',
            meta: { title: '通知模板', noCache: true }
        }
    ]
}

export default templateRouter