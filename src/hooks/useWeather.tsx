import { getWeatherData } from '@/services/api'
import type { WeatherData } from '@/types'
import { useState, useEffect } from 'react'

interface UseWeatherReturn {
  weather: WeatherData | null
  loading: boolean
  error: string | null
  fetchWeather: (city: string) => Promise<void>
}

export const useWeather = (initialCity: string): UseWeatherReturn => {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWeather = async (city: string) => {
    setLoading(true)
    setError(null)

    try {
      const data = await getWeatherData(city)
      setWeather(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível buscar dados do clima. Tente novamente.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather(initialCity)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { weather, loading, error, fetchWeather }
}
