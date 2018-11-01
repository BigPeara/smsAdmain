import api from '@/utils/api'

export default {
    addPlatform(data) { // 添加短信平台
        return new Promise((resolve, reject) => {
            api.post('Configplatform/addPlatform', data).then(res => {
                resolve(res.data)
            })
        })
    },
    platformList(query = {}) { // 获取短信平台列表
        // query.loading = true
        return new Promise((resolve, reject) => {
            api.get('Configplatform/platformList', query).then(res => {
                resolve(res.data)
            })
        })
    },
    platformDetail(id) { // 获取详情
        return new Promise((resolve, reject) => {
            api.post('configplatform/get', { id }).then(res => {
                resolve(res.data)
            })
        })
    },
    deletePlatform(id) { // 删除短信平台
        return new Promise((resolve, reject) => {
            api.delete('Configplatform/deletePlatform', { id }).then(res => {
                resolve(res)
            })
        })
    },
    updatePlatform(data) { // 更新短信平台
        return new Promise((resolve, reject) => {
            api.post('Configplatform/updatePlatform', data).then(res => {
                resolve(res.data)
            })
        })
    },
    allselect() { // 获取短信和站点的接口
        return new Promise((resolve, reject) => {
            api.get('configplatform/allselect').then(res => {
                resolve(res.data)
            })
        })
    },
}