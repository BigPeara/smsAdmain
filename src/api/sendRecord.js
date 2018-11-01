import api from '@/utils/api';
import { Message } from 'element-ui';

export default {
    search($vm) {
        return new Promise(function(resolve, reject) {
            api.post('/sendlog/index', {
                sendtime: $vm.sendtime,
                site_id: $vm.site_id,
                status: $vm.status,
                type: $vm.type,
                content: $vm.content,
                page: $vm.page,
                phone: $vm.phone
            }).then((res) => {
                resolve(res)
            })
        })
    },
    sendAgain($vm) {
        return new Promise(function(resolve, reject) {
            api.post('/sendlog/send', {
                id: $vm.id
            }).then((res) => {
                Message.success('批量重发成功，等待发送中...')
                resolve(res)
            })
        })
    }
}