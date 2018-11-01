import api from '@/utils/api'
import { Message } from 'element-ui'

export default {
  addManger(data) { // 添加用户
    return new Promise((resolve, reject) => {
      api.post('login/addManger', data).then(res => {
        Message.success('添加成功！')
        resolve(res.data)
      })
    })
  },
  changePwd(data) { // 修改用户
    return new Promise((resolve, reject) => {
      api.post('login/changePwd', data).then(res => {
        Message.success('修改成功！')
        resolve(res.data)
      })
    })
  },
  logOut() { // 登出接口
    return new Promise((resolve, reject) => {
      api.post('login/logOut').then(res => {
        Message.success('退出登录！')
        resolve(res.data)
      })
    })
  }
}
