import { useEffect, useState } from 'react'
import type { WeatherData } from './types'
import { getWeatherData } from './services/weatherService'
import { Input } from './components/ui/input'
import { Card, CardTitle } from './components/ui/card'
import { Cloud, LoaderCircle, MapPin, Rainbow, Search, SunsetIcon } from 'lucide-react'

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
      setError(
        err instanceof Error
          ? err.message
          : 'Could not fetch weather data. Please try again.'
      )
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
    if (cond.includes('sun') || cond.includes('clear'))
      return <SunsetIcon className="w-8 h-8 " />
    if (cond.includes('rain') || cond.includes('drizzle'))
      return <Rainbow className="w-8 h-8 " />
    return <Cloud className="w-8 h-8 " />
  }

  return (
    <div className="min-h-screen p-6 md:p-10 font-sans selection:bg-primary selection:text-primary-foreground">
      <div className="2xl:mx-40 space-y-6">

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-background">
              <Cloud className="w-5 h-5" />
            </div>
            <div className="leading-none">
              <h1 className="text-lg font-bold tracking-tight">Lumina</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Weather Engine</p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="relative w-full md:w-95 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-zinc-100 transition-colors w-4 h-4" />

            <Input
              type="text"
              className="w-full py-2.5 pl-11 pr-4 text-sm"
              placeholder="Pesquisar cidade..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <LoaderCircle className="w-6 h-6 animate-spin" />
            <p className="text-muted-foreground text-[12px] uppercase tracking-[0.3em]">Mapeando troposfera...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center">
            <p className="text-muted-foreground text-[12px] uppercase tracking-widest">{error}</p>
          </div>
        ) : weather ? (
          <main className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in duration-1000">

            {/* Seção Principal (3/4 da tela) */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 grid grid-rows-2 gap-6">
                <Card className="px-6 justify-between">
                  <CardTitle className="relative z-10 flex justify-between items-start">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{weather.city}, {weather.country}</span>
                      </div>
                      <h2 className="text-8xl md:text-9xl font-light tracking-tighter">{Math.round(weather.temperature)}°</h2>
                    </div>
                    <div className="bg-primary text-black p-5 rounded-2xl">
                      {getWeatherIcon(weather.condition)}
                    </div>
                  </CardTitle>
                  <div>
                    <p className="text-3xl font-medium tracking-tight">{weather.condition}</p>
                    <p className="text-sm">{weather.description}</p>
                  </div>
                </Card>

                <Card className="px-6">
                  <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em] mb-8">Fluxo de Temperatura (24h)</h3>
                  <div className="flex gap-12 overflow-x-auto pb-4 px-2 scrollbar-hide">
                    {weather.hourly.map((h, i) => (
                      <div key={i} className="flex flex-col items-center gap-4 min-w-15 group">
                        <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{h.time}</span>
                        <div className="transition-transform group-hover:scale-110">
                          {getWeatherIcon(h.condition)}
                        </div>
                        <span className="text-lg font-medium tracking-tighter">{Math.round(h.temp)}°</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <MetricCard label="Sensação" value={'°'} sub="Térmica" />
                <MetricCard label="Vento" value={`${weather.windSpeed}`} unit="km/h" sub="Noroeste" />
                <MetricCard label="Umidade" value={`${weather.humidity}`} unit="%" sub="Ar externo" />
                <MetricCard label="Índice UV" value={weather.uvIndex.toString()} sub="Moderado" />
              </div>

              {/* Hourly Timeline */}

              {/* Dados Atmosféricos Extras */}
              <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricSub label="Visibilidade" value={`${weather.visibility} km`} />
                <MetricSub label="Pressão" value={`${weather.pressure} hPa`} />
                <MetricSub label="Amanhecer" value={weather.sunrise} />
                <MetricSub label="Entardecer" value={weather.sunset} />
              </div>

            </div>

            {/* Previsão Estendida (Sidebar) */}
            <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-[2.5rem] p-8 lg:h-full flex flex-col">
              <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em] mb-10">Previsão 7 Dias</h3>
              <div className="space-y-8 flex-1">
                {weather.daily.map((d, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-bold text-zinc-400 group-hover:text-white transition-colors uppercase tracking-tight">{d.day}</p>
                      <p className="text-[9px] text-zinc-700"></p>
                    </div>
                    <div className="flex items-center gap-4">
                      {getWeatherIcon(d.condition,)}
                      <div className="flex items-center gap-3 w-16 justify-end">
                        <span className="text-xs font-bold">{Math.round(d.high)}°</span>
                        <span className="text-xs text-zinc-700">{Math.round(d.low)}°</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 pt-6 border-t border-zinc-800/30">
                <p className="text-[10px] text-zinc-700 italic text-center leading-relaxed">
                  Semana
                </p>
              </div>
            </div>

          </main>
        ) : null}

        <footer className="pt-16 pb-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-zinc-900">
          <span className="text-[9px] text-zinc-800 uppercase tracking-[0.4em]">Lumina Intelligence &copy; 2025</span>
          <div className="flex items-center gap-3">
            <div className="w-1 h-1 bg-zinc-700 rounded-full" />
            <span className="text-[9px] text-zinc-700 uppercase tracking-[0.2em]">Sistemas Operacionais</span>
          </div>
        </footer>
      </div>
    </div>
  )
};

const MetricCard: React.FC<{ label: string, value: string, unit?: string, sub: string }> = ({ label, value, unit, sub }) => (
  <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-[1.8rem] p-6 flex flex-col justify-between group">
    <div className="space-y-0.5">
      <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{label}</span>
      <p className="text-[9px] text-zinc-800 uppercase">{sub}</p>
    </div>
    <div className="flex items-baseline gap-1 mt-4">
      <span className="text-2xl font-light tracking-tight">{value}</span>
      {unit && <span className="text-[10px] text-zinc-700 font-bold uppercase">{unit}</span>}
    </div>
  </div>
)

const MetricSub: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-2xl p-5 text-center space-y-1">
    <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">{label}</p>
    <p className="text-lg font-light tracking-tight">{value}</p>
  </div>
)

export default App
