import api from '@/utils/api'

export default {
  addSign(data) { // 添加签名接口
    return new Promise((resolve, reject) => {
      api.post('Configplatformsign/addSign', data).then(res => {
        resolve(res.data)
      })
    })
  },
  signList(query = {}) { // 获取签名列表
    query.loading = true
    return new Promise((resolve, reject) => {
      api.get('Configplatformsign/signList', query).then(res => {
        resolve(res.data)
      })
    })
  },
  signDetail(id) { // 获取详情
    return new Promise((resolve, reject) => {
      api.post('Configplatformsign/get', { id }).then(res => {
        resolve(res.data)
      })
    })
  },
  deleteSign(id) { // 删除签名接口
    return new Promise((resolve, reject) => {
      api.delete('Configplatformsign/deleteSign', { id }).then(res => {
        resolve(res)
      })
    })
  },
  updateSign(data) { // 更新签名接口
    return new Promise((resolve, reject) => {
      api.post('Configplatformsign/updateSign', data).then(res => {
        resolve(res.data)
      })
    })
  }
}
