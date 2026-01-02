import axios, { AxiosError } from 'axios'

// Configurar instância base
const api = axios.create({
  baseURL: 'https://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// GET request
export async function getWeatherData(id: string): Promise<Response> {
  try {
    const { data } = await api.get<Response>(`/${id}`)
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro Axios:', error.response?.data)
    }
    throw error
  }
}
