import axios from 'axios'

// Configurar instância base
const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// GET request usando query param
export async function getWeatherData(location: string) {
  try {
    const { data } = await api.get('/', {
      params: { location }
    })
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro Axios:', error.response?.data)
    }
    throw error
  }
}
