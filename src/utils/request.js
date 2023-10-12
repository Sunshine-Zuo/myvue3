import axios from 'axios';
import router from "../router";
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
let reqConfig;
let loadingE;
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,

});

service.interceptors.request.use(
  config => {
    /* download file*/
    if (config.isDownLoadFile) {
      config.responseType = 'blob'
    }
    /* upload file*/
    if (config.isUploadFile) {
      config.headers['Content-Type'] = 'multipart/form-data'
    }
    reqConfig = config
    if (config.bfLoading) {
      loadingE = ElLoading.service({
        lock: true,
        text: '加载中',
        // spinner: 'el-icon-ElLoading',
        background: 'rgba(0, 0, 0, 0.3)'
      })
    }
    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
    if (reqConfig.afHLoading && loadingE) {
      loadingE.close()
    }
    // 如果是下载文件直接返回
    if (reqConfig.isDownLoadFile) {
      const type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
      const fileName = `用户注册数据.xlsx`
      const blob = new Blob([response.data], { type })
      if (typeof window.navigator.msSaveBlob !== 'undefined') {
        /** For IE* >=IE10 */
        window.navigator.msSaveBlob(blob, fileName)
      } else {
        /** For Non-IE (chrome, firefox) */
        const URL = window.URL || window.webkitURL
        const objectUrl = URL.createObjectURL(blob)
        if (fileName) {
          const a = document.createElement('a')
          if (typeof a.download === 'undefined') {
            window.location = objectUrl
          } else {
            a.href = objectUrl
            a.download = fileName
            document.body.appendChild(a)
            a.click()
            a.remove()
          }
        } else {
          window.location = objectUrl
        }
      }
      return response.data
    }
    const { message, code, status } = response
    const successCode = [0, 200, '0', '200']
    if (successCode.includes(status)) {
      return response.data;
    } else {
      // if (code === 401) {
      //   router.push({ path: '/login' })
      //   localStorage.setItem('token', '')
      // }
      if (reqConfig.isAlertErrorMsg) {
        ElMessage({
          message: message,
          type: 'error',
          duration: 2 * 1000
        })
      }
      return Promise.reject(response);
    }
  },
  error => {
    console.log(error);
    if (error.response.status === 401) {
      router.push({ path: '/login' })
      localStorage.setItem('token', '')
    }
    if (error.response.data?.message) {
      ElMessage({
        message: error.response.data.message,
        type: 'error',
        duration: 2 * 1000
      })
    } else {
      ElMessage({
        message: error?.message,
        type: 'error',
        duration: 2 * 1000
      })
    }
    if (reqConfig.afHLoading && loadingE) {
      loadingE.close()
    }
    return Promise.reject(error);
  }
);
export function axiosReq({
  url,
  method,
  data,
  params,
  bfLoading,
  afHLoading,
  isUploadFile,
  isDownLoadFile,
  isAlertErrorMsg,
}) {
  return service({
    url: url,
    method: method ?? 'get',
    data: data ?? {},
    params: params ?? {},
    bfLoading: bfLoading ?? true,
    afHLoading: afHLoading ?? true,
    isUploadFile: isUploadFile ?? false,
    isDownLoadFile: isDownLoadFile ?? false,
    isAlertErrorMsg: isAlertErrorMsg ?? true,
    headers: {
      'X-Fontre-Auth-Access': localStorage.getItem('token'),
      'X-Fontre-Auth-Model': 'token'
    }
  })
}
export default axiosReq;
