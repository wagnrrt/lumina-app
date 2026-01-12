import { useState } from 'react'
import { Thermometer, Wind, Droplets, Sun, Eye, Gauge, Cloud, Sunrise, Sunset, Moon } from 'lucide-react'
import { LoadingSpinner } from './components/loading/loadingSpinner'
import { ErrorMessage } from './components/loading/errorMessage'
import { MainWeatherCard } from './components/weather-card/mainWeatherCard'
import { HourlyForecast } from './components/weather-card/hourlyForecast'
import { MetricCard, MetricSub } from './components/metrics/metricCards'
import { getMoonPhase, getUVLevel } from './utils/formatters'
import { StormAlert } from './components/weather-card/StormAlert'
import { ForecastSidebar } from './components/forecast/forecastSidebar'
import { Footer } from './components/layout/footer'
import { useWeather } from './hooks/useWeather'
import { Header } from './components/layout/header'

function App() {
  const [city, setCity] = useState<string>('São Paulo')
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0)
  const { weather, loading, error, fetchWeather } = useWeather(city)

  const selectedDay = weather?.daily[selectedDayIndex]

  const handleSearch = (newCity: string) => {
    setCity(newCity)
    fetchWeather(newCity)
    setSelectedDayIndex(0)
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 font-sans selection:bg-primary selection:text-primary-foreground">
      <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6">
        <Header onSearch={handleSearch} />

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : weather && selectedDay ? (
          <main className="w-full animate-in fade-in duration-1000 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 sm:gap-6">

            {/* COLUNA ESQUERDA */}
            <div className="flex-1 flex flex-col space-y-4 sm:space-y-6">

              {/* GRID PRINCIPAL */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

                {/* CARTÃO PRINCIPAL + GRÁFICO */}
                <div className="flex flex-col lg:col-span-2 gap-4 sm:gap-6">
                  <MainWeatherCard
                    weather={weather}
                    selectedDay={selectedDay}
                    selectedDayIndex={selectedDayIndex}
                  />
                  <HourlyForecast selectedDay={selectedDay} />
                </div>

                {/* MÉTRICAS LATERAIS */}
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 lg:gap-6">
                  <MetricCard
                    icon={<Thermometer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    label="Sensação"
                    value={selectedDay ? `${Math.round(selectedDay.feelslikeMax)}°` : '--'}
                    sub={selectedDayIndex === 0 ? 'Térmica' : `Mín: ${Math.round(selectedDay.feelslikeMin)}°`}
                  />
                  <MetricCard
                    icon={<Wind className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    label="Vento"
                    value={`${Math.round(selectedDay.windSpeed)}`}
                    unit="km/h"
                    sub={`Rajadas ${Math.round(selectedDay.windGust)} km/h`}
                  />
                  <MetricCard
                    icon={<Droplets className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    label="Umidade"
                    value={`${Math.round(selectedDay.humidity)}`}
                    unit="%"
                    sub="Ar externo"
                  />
                  <MetricCard
                    icon={<Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    label="Índice UV"
                    value={selectedDay.uvIndex.toString()}
                    sub={getUVLevel(selectedDay.uvIndex)}
                  />
                </div>
              </div>

              {/* MÉTRICAS INFERIORES */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
                <MetricSub
                  icon={<Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                  label="Visibilidade"
                  value={`${selectedDay.visibility} km`}
                />
                <MetricSub
                  icon={<Gauge className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                  label="Pressão"
                  value={`${selectedDay.pressure} hPa`}
                />
                <MetricSub
                  icon={<Cloud className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                  label="Nuvens"
                  value={`${Math.round(selectedDay.cloudCover)}%`}
                />
                <MetricSub
                  icon={<Sunrise className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                  label="Amanhecer"
                  value={selectedDay.sunrise}
                />
                <MetricSub
                  icon={<Sunset className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                  label="Entardecer"
                  value={selectedDay.sunset}
                />
                <MetricSub
                  icon={<Moon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                  label='Fase da lua'
                  value={getMoonPhase(selectedDay.moonPhase)}
                />
              </div>

              {/* ALERTA DE TEMPESTADE */}
              <StormAlert selectedDay={selectedDay} />
            </div>

            {/* SIDEBAR - PREVISÃO 15 DIAS */}
            <ForecastSidebar
              daily={weather.daily}
              selectedDayIndex={selectedDayIndex}
              onSelectDay={setSelectedDayIndex}
              weatherIcon={selectedDay.icon}
            />
          </main>
        ) : null}

        <Footer />
      </div>
    </div>
  )
}

export default App
