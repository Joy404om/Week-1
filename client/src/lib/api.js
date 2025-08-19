import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    localStorage.setItem('bmg_token', token)
  } else {
    delete api.defaults.headers.common.Authorization
    localStorage.removeItem('bmg_token')
  }
}

export function loadAuthToken() {
  const token = localStorage.getItem('bmg_token')
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  }
  return token
}

