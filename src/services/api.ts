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

      // Formatar mensagem de erro para o usuário
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Network Error when attempting to fetch resource.')
      }

      if (error.response) {
        // Erro de resposta do servidor
        throw new Error(error.response.data?.message || `Erro ${error.response.status}: ${error.response.statusText}`)
      }

      if (error.request) {
        // Requisição foi feita mas não houve resposta
        throw new Error('Network Error when attempting to fetch resource.')
      }
    }

    // Erro genérico
    throw new Error('Erro ao buscar dados meteorológicos.')
  }
}
