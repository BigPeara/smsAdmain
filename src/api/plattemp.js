import api from '@/utils/api'

export default {
  addPlattemp(data) { // 添加模板接口
    return new Promise((resolve, reject) => {
      api.post('plattemp/add', data).then(res => {
        resolve(res.data)
      })
    })
  },
  plattempList(query = {}) { // 获取模板列表
    query.loading = true
    return new Promise((resolve, reject) => {
      api.get('plattemp/list', query).then(res => {
        resolve(res.data)
      })
    })
  },
  plattempDetail(id) { // 获取详情
    return new Promise((resolve, reject) => {
      api.post('plattemp/get', { id }).then(res => {
        resolve(res.data)
      })
    })
  },
  deletePlattemp(id) { // 删除接口
    return new Promise((resolve, reject) => {
      api.delete('plattemp/del', { id }).then(res => {
        resolve(res)
      })
    })
  },
  updatePlattemp(data) { // 更新第三方模板
    return new Promise((resolve, reject) => {
      api.post('plattemp/edit', data).then(res => {
        resolve(res.data)
      })
    })
  }
}
