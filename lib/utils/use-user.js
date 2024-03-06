import { api } from 'boot/axios'
export const getFetcher = (url) => {
  const endpoint = process.env.API_URL + url
  return api.get(endpoint).then((res) => {
    return res.data
  })
}

export const options = {
  revalidateOnReconnect: true,
  shouldRetryOnError: false,
  revalidateOnFocus: false
}
