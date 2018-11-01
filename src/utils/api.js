import service from './request'
import { Message, MessageBox } from 'element-ui'
var qs = require('qs')

export default {
    get(url, data, error) {
        return new Promise((resolve, reject) => {
            service.get(url, {
                params: data
            }).then(res => {
                resolve(res)
            }, err => {
                err = error || err
                Message.error(err)
            })
        })
    },
    post(url, data, error) {
        return new Promise((resolve, reject) => {
            service.post(url, qs.stringify(data)).then(res => {
                resolve(res)
            }, err => {
                err = error || err
                Message.error(err)
            })
        })
    },
    formPost(url, data, error) {
        // debugger
        return new Promise((resolve, reject) => {
            service.post(url, data).then(res => {
                resolve(res)
            }, err => {
                err = error || err
                Message.error(err)
            })
        })
    },
    delete(url, data, error) {
        var title = '确认删除么？'
        return new Promise((resolve, reject) => {
            MessageBox.confirm(title, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                service.post(url, qs.stringify(data)).then(res => {
                    resolve(res)
                }, err => {
                    err = error || err
                    Message.error(err)
                })
            }).catch(() => {
                Message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        })
    }
}