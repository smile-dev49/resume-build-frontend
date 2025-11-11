  import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

  class ApiService {
    private api: AxiosInstance

    constructor() {
      const apiHost = import.meta.env.VITE_API_HOST || ''
      const baseURL = apiHost ? `${apiHost}` : ''
      
      this.api = axios.create({
        baseURL,
        headers: {
          'Content-Type': 'application/json',
        },
      })

      this.setupInterceptors()
    }

    downloadUrl(url: string, download: boolean = false): string {
      const baseUrl = `${this.api.defaults.baseURL}${url}`
      return download ? `${baseUrl}?mode=download` : baseUrl
    }

    private setupInterceptors() {
      this.api.interceptors.request.use(
        (config) => {
          const token = localStorage.getItem('auth_token')
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
          return config
        },
        (error) => {
          return Promise.reject(error)
        }
      )

      this.api.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401) {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
            window.location.href = '/login'
          }
          return Promise.reject(error)
        }
      )
    }

    async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
      return this.api.get(url, config)
    }

    async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
      return this.api.post(url, data, config)
    }

    async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
      return this.api.put(url, data, config)
    }

    async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
      return this.api.delete(url, config)
    }

    async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
      return this.api.patch(url, data, config)
    }

    async login(username: string, password: string): Promise<AxiosResponse<{token: string, user: any}>> {
      return this.api.post('/signin', { username, password })
    }
  }

  export const apiService = new ApiService()
  export default apiService