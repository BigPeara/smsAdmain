import api from '@/utils/api'

export default {
  addSite(data) { // 添加站点
    return new Promise((resolve, reject) => {
      api.post('Configsite/addSite', data).then(res => {
        resolve(res.data)
      })
    })
  },
  siteList(query = {}) { // 获取站点列表
    query.loading = true
    return new Promise((resolve, reject) => {
      api.get('Configsite/siteList', query).then(res => {
        resolve(res.data)
      })
    })
  },
  siteDetail(id) { // 获取详情
    return new Promise((resolve, reject) => {
      api.post('Configsite/get', { id }).then(res => {
        resolve(res.data)
      })
    })
  },
  deleteSite(id) { // 删除站点
    return new Promise((resolve, reject) => {
      api.delete('Configsite/deleteSite', { id }).then(res => {
        resolve(res)
      })
    })
  },
  updateSite(data) { // 更新站点
    return new Promise((resolve, reject) => {
      api.post('Configsite/updateSite', data).then(res => {
        resolve(res.data)
      })
    })
  }
}
