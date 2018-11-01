import axios from 'axios'
import router from '@/router'
const url = 'http://tb.luochen.com/sms'

// create an axios instance
const service = axios.create({
        baseURL: url, // api的base_url
        timeout: 5000 // request timeout
    })
    // request interceptor
service.interceptors.request.use(
        config => {
            // config.url = config.url + '?debug=true'
            return config
        },
        error => {
            // Do something with request error
            console.log(error) // for debug
            Promise.reject(error)
        }
    )
    // respone interceptor
service.interceptors.response.use(
    response => {
        if (response.data.code === 405) {
            router.push({ name: 'login' })
        } else if (response.data.code && response.data.code !== 200) {
            return Promise.reject(response.data.message)
        }
        return response
    },
    error => {
        return Promise.reject(error)
    }
)

export default service