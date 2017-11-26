import axios from 'axios'

export function get(url) {
  return axios({
    method: 'GET',
    url: url,
  })
}

export function post(url, payload) {
  return axios({
    method: 'POST',
    url: url,
    data: payload,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json'
    }
  })
}

export function patch(url, payload) {
  return axios({
    method: 'PATCH',
    url: url,
    data: payload
  })
}

export function put(url, payload) {
  return axios({
    method: 'PUT',
    url: url,
    data: payload
  })
}
export function del(url) {
  return axios({
    method: 'DELETE',
    url: url
  })
}
