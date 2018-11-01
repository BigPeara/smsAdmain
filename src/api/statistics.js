import api from '@/utils/api'

export default {
  getData(data) { // 添加短信平台
    return new Promise((resolve, reject) => {
      api.post('statistics/index', data).then(res => {
        resolve(res.data)
      })
    })
  }
}
