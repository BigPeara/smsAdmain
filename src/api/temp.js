import api from '@/utils/api'

export default {
    tempadmin($vm) {
        return new Promise(function(resolve, reject) {
            api.post('/template/listmarket', {
                page: $vm.page,
                plat_id: $vm.plat_id,
                name: $vm.name
            }).then((res) => {
                if (res.data.code === 200) {
                    resolve(res)
                } else {
                    reject(res)
                }
            })
        })
    },
    listnotice($vm) {
        return new Promise(function(resolve, reject) {
            api.post('/template/listnotice', {
                page: $vm.page,
                plat_id: $vm.plat_id,
                name: $vm.name
            }).then((res) => {
                resolve(res)
            })
        })
    },
    editTemp($vm) {
        return new Promise(function(resolve, reject) {
            api.post('/template/edit', {
                id: $vm.id,
                name: $vm.name,
                content: $vm.content,
                plat_id: $vm.plat_id,
                plat_template_id: $vm.plat_template_id
            }).then((res) => {
                resolve(res)
            })
        })
    },
    getInfo($vm) {
        return new Promise(function(resolve, reject) {
            api.post('/template/get', {
                id: $vm.id
            }).then((res) => {
                resolve(res)
            })
        })
    },
    remove($vm) {
        return new Promise(function(resolve, reject) {
            api.post('/template/del', {
                id: $vm.id
            }).then((res) => {
                resolve(res)
            })
        })
    },
    dropDown() {
        return new Promise(function(resolve, reject) {
            api.get('/configplatform/allplatform').then((res) => {
                resolve(res)
            })
        })
    },
    addList($vm) {
        return new Promise(function(resolve, reject) {
            api.post('/template/addmarket', {
                name: $vm.name,
                content: $vm.content,
                plat_id: $vm.plat_id,
                plat_template_id: $vm.plat_template_id
            }).then((res) => {
                resolve(res)
            })
        })
    },
    addnotice($vm) {
        return new Promise(function(resolve, reject) {
            api.post('/template/addnotice', {
                name: $vm.name,
                content: $vm.content,
                plat_id: $vm.plat_id,
                plat_template_id: $vm.plat_template_id
            }).then((res) => {
                resolve(res)
            })
        })
    },
    getSelect($vm) {
        return new Promise(function(resolve, reject) {
            api.post('/template/getSelect', {
                plat_id: $vm.plat_id,
                name: $vm.name
            }).then((res) => {
                resolve(res)
            })
        })
    }
}