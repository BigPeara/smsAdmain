import api from '@/utils/api'

export default {
    groupList($vm) {
        return new Promise(function(resolve, reject) {
            api.post('/group/list', {
                page: $vm.page,
                site_id: $vm.site_id,
                name: $vm.name
            }).then((res) => {
                resolve(res)
            })
        })
    },
    dropSite() {
        return new Promise(function(resolve, reject) {
            api.get('/configsite/allsite').then((res) => {
                resolve(res)
            })
        })
    },
    groupEdit($vm) {
        return new Promise(function(resolve, reject) {
            api.post('/group/edit', {
                id: $vm.id,
                site_id: $vm.site_id,
                name: $vm.name
            }).then((res) => {
                resolve(res)
            })
        })
    },
    getInfo($vm) {
        return new Promise(function(resolve, reject) {
            api.post('/group/get', {
                id: $vm.id
            }).then((res) => {
                resolve(res)
            })
        })
    },
    remove($vm) {
        return new Promise(function(resolve, reject) {
            api.post('/group/del', {
                id: $vm.id
            }).then((res) => {
                resolve(res)
            })
        })
    },
    addGroup($vm) {
        return new Promise(function(resolve, reject) {
            api.post('/group/add', {
                site_id: $vm.site_id,
                name: $vm.name
            }).then((res) => {
                resolve(res)
            })
        })
    },
    phoneInfo($vm) {
        return new Promise(function(resolve, reject) {
            api.post('/group/getGroupPhone', {
                id: $vm.id
            }).then((res) => {
                resolve(res)
            })
        })
    },
    addPhone($vm) {
        return new Promise(function(resolve, reject) {
            api.post('/group/addPhone', {
                id: $vm.id,
                phone: $vm.phone
            }).then((res) => {
                resolve(res)
            })
        })
    },
    getPhone($vm) {
        return new Promise(function(resolve, reject) {
            api.post('/group/getPhone', {
                id: $vm.id
            }).then((res) => {
                resolve(res)
            })
        })
    },
    lookPhone($vm) {
        return new Promise(function(resolve, reject) {
            api.post('/group/phone', {
                id: $vm.id,
                phone: $vm.phone,
                page: $vm.page
            }).then((res) => {
                resolve(res)
            })
        })
    },
    editPhone($vm) {
        return new Promise(function(resolve, reject) {
            api.post('/group/editPhone', {
                id: $vm.id,
                phone: $vm.phone
            }).then((res) => {
                resolve(res)
            })
        })
    },
    removePhone($vm) {
        return new Promise(function(resolve, reject) {
            api.post('/group/delPhone', {
                id: $vm.id
            }).then((res) => {
                resolve(res)
            })
        })
    },
    importPhone(data) {
        return new Promise(function(resolve, reject) {
            api.formPost('/group/importPhone', data).then((res) => {
                resolve(res)
            })
        })
    }
}