import Layout from '@/views/layout/Layout'

const systemRouter = {
  path: '/system',
  component: Layout,
  redirect: 'noredirect',
  name: 'system',
  meta: {
    title: '系统配置',
    icon: 'list'
  },
  children: [
    {
      path: 'sign',
      component: () => import('@/views/system/sign'),
      name: 'system.systemSign',
      meta: { title: '签名配置' }
    },
    {
      path: 'temp',
      component: () => import('@/views/system/temp'),
      name: 'system.temp',
      meta: { title: '模板配置' }
    },
    {
      path: 'site',
      component: () => import('@/views/system/site'),
      name: 'system.systemSite',
      meta: { title: '站点管理' }
    },
    {
      path: 'message',
      component: () => import('@/views/system/message'),
      name: 'system.message',
      meta: { title: '短信平台' }
    }
  ]
}

export default systemRouter
