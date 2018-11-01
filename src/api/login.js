import api from '@/utils/api'

export function loginByUsername(data) {
    return new Promise((resolve, reject) => {
        api.post('login/index', data).then(res => {
            resolve(res.data)
        })
    })
}

// export function logout() {
//   return request({
//     url: '/login/logout',
//     method: 'post'
//   })
// }

export function getUserInfo(token) {
    // return request({
    //   url: '/user/info',
    //   method: 'get',
    //   params: { token }
    // })
}