import { Cloud, MapPin, Search, Sun, Thermometer, Wind } from 'lucide-react'
import { Input } from './components/ui/input'
import { useEffect, useState } from 'react'
import { getWeatherData } from './services/weatherService'
import type { WeatherData } from './types'
import { Rain } from './components/icons'

function App() {

  const [city, setCity] = useState<string>('São Paulo')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState<string>('')

  const fetchWeather = async (query: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getWeatherData(query)
      setWeather(data)
    } catch (err) {
      setError('Could not fetch weather data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather(city)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      fetchWeather(searchInput)
      setCity(searchInput)
    }
  }

  const getWeatherIcon = (condition: string) => {
    const cond = condition.toLowerCase()
    if (cond.includes('sun') || cond.includes('clear')) return <Sun className="w-8 h-8 text-zinc-100" />
    if (cond.includes('rain') || cond.includes('drizzle')) return <Rain className="w-8 h-8 text-zinc-100" />
    return <Cloud className="w-8 h-8 text-zinc-100" />
  }

  return (

    <div className="min-h-screen selection:bg-zinc-100 selection:text-zinc-900">
      <div className="max-w-5xl mx-auto space-y-8 py-5">

        {/* Header & Search */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Lumina Weather</h1>
            <p className="text-muted-foreground text-sm">Minimalist atmospheric tracking.</p>
          </div>

          <form className="relative w-full md:w-80 group" onSubmit={handleSearch}>
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none transition-colors group-focus-within:text-zinc-50 text-muted-foreground">
              <Search size={16} />
            </div>
            <Input
              type="text"
              className="w-full pl-10 pr-4 text-sm "
              placeholder="Search location..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
            <div className="w-8 h-8 border-2 border-zinc-800 border-t-zinc-400 rounded-full animate-spin" />
            <p className="text-zinc-500 animate-pulse text-sm">Retrieving atmospheric data...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[60vh]">
            <p className="text-destructive bg-destructive/5 border border-destructive/20 px-4 py-2 rounded-lg text-sm">{error}</p>
          </div>
        ) : weather ? (
          <main className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">

            {/* Current Weather Card */}
            <div className="md:col-span-3 bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-8 md:p-12 relative overflow-hidden backdrop-blur-sm">
              <div className="relative z-10 flex flex-col md:flex-row h-full justify-between items-start md:items-center gap-12">

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">{weather.city}, {weather.country}</span>
                  </div>
                  <div className="flex items-end gap-6">
                    <span className="text-8xl font-light tracking-tighter leading-none">{Math.round(weather.temperature)}°</span>
                    <div className="flex flex-col pb-2">
                      <span className="text-2xl font-medium text-zinc-100 capitalize">{weather.condition}</span>
                      <span className="text-zinc-500">{weather.description}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 w-full md:w-auto">
                  <Metric icon={<Thermometer />} label="High" value={`${Math.round(weather.high)}°`} />
                  <Metric icon={<Thermometer className="rotate-180" />} label="Low" value={`${Math.round(weather.low)}°`} />
                  <Metric icon={<Wind />} label="Wind" value={`${weather.windSpeed} km/h`} />
                  <Metric icon={<Sun className="w-4 h-4" />} label="UV" value={weather.uvIndex.toString()} />
                </div>
              </div>
            </div>

            {/* Sun Cycle Info */}
            <div className="md:col-span-1 bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-8 backdrop-blur-sm flex flex-col justify-center">
              <div className="space-y-6">
                <h3 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.2em]">Sun Cycle</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400">Sunrise</span>
                    <span className="text-sm font-medium">{weather.sunrise}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400">Sunset</span>
                    <span className="text-sm font-medium">{weather.sunset}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Humidity & Visibility */}
            <div className="md:col-span-1 bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-8 backdrop-blur-sm flex flex-col justify-center">
              <div className="space-y-6">
                <h3 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.2em]">Atmosphere</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400">Humidity</span>
                    <span className="text-sm font-medium">{weather.humidity}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400">Visibility</span>
                    <span className="text-sm font-medium">{weather.visibility} km</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pressure */}
            <div className="md:col-span-1 bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-8 backdrop-blur-sm flex flex-col justify-center">
              <div className="space-y-6">
                <h3 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.2em]">Pressure</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400">Barometer</span>
                    <span className="text-sm font-medium">{weather.pressure} hPa</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400">Status</span>
                    <span className="text-sm font-medium">Stable</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hourly Forecast */}
            <div className="md:col-span-3 bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-8 backdrop-blur-sm">
              <h3 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.2em] mb-8">Hourly Forecast</h3>
              <div className="flex gap-12 overflow-x-auto pb-4 scrollbar-hide">
                {weather.hourly.map((h, i) => (
                  <div key={i} className="flex flex-col items-center gap-4 min-w-15">
                    <span className="text-xs text-zinc-500 font-medium whitespace-nowrap">{h.time}</span>
                    <div className="text-zinc-400">
                      {getWeatherIcon(h.condition)}
                    </div>
                    <span className="text-lg font-medium">{Math.round(h.temp)}°</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Forecast */}
            <div className="md:col-span-3 bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-8 backdrop-blur-sm">
              <h3 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.2em] mb-8">Next 5 Days</h3>
              <div className="space-y-0">
                {weather.daily.map((d, i) => (
                  <div key={i} className={`flex items-center justify-between py-5 ${i !== weather.daily.length - 1 ? 'border-b border-zinc-800/50' : ''}`}>
                    <span className="w-24 text-sm font-medium">{d.day}</span>
                    <div className="flex items-center gap-4 flex-1 justify-center">
                      {getWeatherIcon(d.condition)}
                      <span className="text-xs text-zinc-500 capitalize">{d.condition}</span>
                    </div>
                    <div className="w-24 flex justify-end gap-4">
                      <span className="font-semibold">{Math.round(d.high)}°</span>
                      <span className="text-zinc-500">{Math.round(d.low)}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </main>
        ) : null}

        <footer className="text-center py-12 text-zinc-700 text-[10px] tracking-[0.3em] uppercase">
          &copy; Lumina Systems &bull; Minimal Weather
        </footer>

      </div>
    </div>
  )
}

const Metric: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-2 text-zinc-500">
      {icon}
      <span className="text-[10px] font-semibold uppercase tracking-widest">{label}</span>
    </div>
    <span className="text-xl font-medium tracking-tight">{value}</span>
  </div>
)

export default App
