import api from '@/utils/api'
import { Message } from 'element-ui'

export default {
  getTemplate(query = {}) { // 获取短信模板
    return new Promise((resolve, reject) => {
      api.get('multisend/getTemplate', query).then(res => {
        resolve(res.data)
      })
    })
  },
  allselect() { // 获取短信和站点的接口
    return new Promise((resolve, reject) => {
      api.get('multisend/sendPage').then(res => {
        resolve(res.data)
      })
    })
  },
  groupList(query = {}) { // 群发页面-通过站点id搜索群组
    return new Promise((resolve, reject) => {
      api.get('group/list', query).then(res => {
        resolve(res.data)
      })
    })
  },
  sendIndex(data) { // 群发接口
    return new Promise((resolve, reject) => {
      api.post('multisend/index', data).then(res => {
        Message.success('提交成功，等待发送中...')
        resolve(res.data)
      })
    })
  },
  uploadText(data) { // 群发页面导入txt
    return new Promise((resolve, reject) => {
      api.formPost('multisend/uploadText', data).then(res => {
        Message.success('文件上传成功')
        resolve(res.data)
      })
    })
  },
  testSend(data) { // 测试发送
    return new Promise((resolve, reject) => {
      api.post('multisend/testSend', data).then(res => {
        Message.success('预览请求成功，等待发送中...')
        resolve(res.data)
      })
    })
  }
}
