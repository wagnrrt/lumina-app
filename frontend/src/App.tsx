import { useEffect, useState, type JSX } from 'react'
import * as React from 'react'
import type { WeatherData } from './types'
import { getWeatherData } from './services/weatherService'
import { Input } from './components/ui/input'
import { Card, CardTitle } from './components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './components/ui/chart'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import { Sun, Moon, Cloud, CloudRain, CloudLightning, CloudSnow, CloudFog, Wind, LoaderCircle, MapPin, Search, CloudSun, CloudMoon, CloudDrizzle, Cloudy, Droplets, ChevronUp, ChevronDown, Thermometer, Gauge, Eye, Sunrise, Sunset, Snowflake } from 'lucide-react'

function App() {
  const [city, setCity] = useState<string>('São Paulo')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState<string>('')
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0)

  const selectedDay = weather?.daily[selectedDayIndex]

  // Função para retornar o ícone baseado na condição
  const getWeatherIcon = (condition: string, size: string = 'w-8 h-8') => {
    const iconClass = size

    const ICON_MAP: Record<string, JSX.Element> = {
      'clear-day': <Sun className={iconClass} />,
      'clear-night': <Moon className={iconClass} />,
      'partly-cloudy-day': <CloudSun className={iconClass} />,
      'partly-cloudy-night': <CloudMoon className={iconClass} />,
      'cloudy': <Cloudy className={iconClass} />,
      'rain': <CloudRain className={iconClass} />,
      'showers-day': <CloudRain className={iconClass} />,
      'showers-night': <CloudDrizzle className={iconClass} />,
      'thunder-rain': <CloudLightning className={iconClass} />,
      'thunder': <CloudLightning className={iconClass} />,
      'snow': <CloudSnow className={iconClass} />,
      'fog': <CloudFog className={iconClass} />,
      'wind': <Wind className={iconClass} />
    }

    return ICON_MAP[condition] || <Cloud className={iconClass} />
  }

  // Classificar UV Index
  const getUVLevel = (uv: number) => {
    if (uv < 3) return 'Baixo'
    if (uv < 6) return 'Moderado'
    if (uv < 8) return 'Alto'
    if (uv < 11) return 'Muito Alto'
    return 'Extremo'
  }

  // Classificar fase da lua
  const getMoonPhase = (phase: number) => {
    if (phase === 0) return 'Nova'
    if (phase < 0.25) return 'Crescente'
    if (phase === 0.25) return 'Quarto Crescente'
    if (phase < 0.5) return 'Crescente'
    if (phase === 0.5) return 'Cheia'
    if (phase < 0.75) return 'Minguante'
    if (phase === 0.75) return 'Quarto Minguante'
    return 'Minguante'
  }

  // Classificar risco de tempestade
  const getSevereRiskLevel = (risk: number) => {
    if (risk < 30) return { label: 'Baixo', color: 'text-green-400' }
    if (risk < 60) return { label: 'Moderado', color: 'text-yellow-400' }
    return { label: 'Alto', color: 'text-red-400' }
  }

  // Formatar data em português BR (para sidebar)
  const formatDateBR = (daysFromNow: number) => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

    const date = new Date()
    date.setDate(date.getDate() + daysFromNow)

    const dayName = days[date.getDay()]
    const day = date.getDate()
    const month = months[date.getMonth()]

    return `${dayName}, ${day} ${month}`
  }

  // Formatar data completa para o card principal
  const formatFullDate = (dayIndex: number) => {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

    const date = new Date()
    date.setDate(date.getDate() + dayIndex)

    const dayName = days[date.getDay()]
    const day = date.getDate()
    const month = months[date.getMonth()]

    return `${dayName}, ${day} de ${month}`
  }

  const fetchWeather = async (query: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getWeatherData(query)
      setWeather(data)
      setSelectedDayIndex(0)
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

  // Preparar dados para o gráfico
  const chartData = selectedDay?.hours?.map(h => ({
    time: h.time.slice(0, 5), // "14:00:00" -> "14:00"
    temperatura: Math.round(h.temp),
    sensacao: Math.round(h.feelslike)
  })) ?? []

  const chartConfig = {
    temperatura: {
      label: 'Temperatura',
      color: 'hsl(var(--chart-1))',
    },
    sensacao: {
      label: 'Sensação',
      color: 'hsl(var(--chart-2))',
    },
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 font-sans selection:bg-primary selection:text-primary-foreground">
      <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6">

        {/* HEADER - Melhorado */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center text-background flex-shrink-0">
              <Cloud className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="leading-none">
              <h1 className="text-base sm:text-lg font-bold tracking-tight">Lumina</h1>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-widest">Weather Engine</p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="relative w-full sm:w-auto sm:min-w-[280px] md:w-96 group">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-zinc-100 transition-colors w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <Input
              type="text"
              className="w-full py-2 sm:py-2.5 pl-9 sm:pl-11 pr-3 sm:pr-4 text-xs sm:text-sm"
              placeholder="Pesquisar cidade..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-16 sm:py-20">
            <LoaderCircle className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
            <p className="text-muted-foreground text-[11px] sm:text-[12px] uppercase tracking-[0.3em]">Carregando dados...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-16 sm:py-20">
            <p className="text-muted-foreground text-[11px] sm:text-[12px] uppercase tracking-widest text-center px-4">{error}</p>
          </div>
        ) : weather && selectedDay ? (

          <main className="w-full animate-in fade-in duration-1000 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 sm:gap-6">

            {/* COLUNA ESQUERDA (Principal + Métricas) */}
            <div className="flex-1 flex flex-col space-y-4 sm:space-y-6">

              {/* GRID PRINCIPAL */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

                {/* CARTÃO PRINCIPAL + GRÁFICO */}
                <div className="flex flex-col lg:col-span-2 gap-4 sm:gap-6">

                  {/* Cartão do Tempo Atual - Melhorado */}
                  <Card className="p-4 sm:p-5 md:p-6 relative overflow-hidden flex flex-col">
                    <div className="absolute -right-8 sm:-right-12 -top-8 sm:-top-12 opacity-[0.03] pointer-events-none">
                      {getWeatherIcon(selectedDay.icon || weather.icon, 'w-32 h-32 sm:w-40 sm:h-40 md:w-60 md:h-60 lg:w-80 lg:h-80')}
                    </div>

                    <CardTitle className="relative z-10 flex justify-between items-start">
                      <div className="w-full space-y-3 sm:space-y-4">
                        <div className="flex flex-col gap-1.5 sm:gap-2 md:gap-4">
                          <span className="text-[9px] sm:text-[10px] text-muted-foreground/60 uppercase tracking-[0.25em] sm:tracking-[0.3em]">
                            {formatFullDate(selectedDayIndex)}
                          </span>
                          <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] truncate">{weather.resolvedAddress}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light tracking-tighter">
                            {selectedDayIndex === 0 ? Math.round(weather.temperature) : Math.round(selectedDay.temp)}°
                          </h2>
                          <div className="flex flex-col gap-1.5 sm:gap-2">
                            <div className="flex items-center gap-0.5 sm:gap-1">
                              <ChevronUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-400 flex-shrink-0" />
                              <span className="text-lg sm:text-xl md:text-2xl font-light text-red-400">{Math.round(selectedDay.high)}°</span>
                            </div>
                            <div className="flex items-center gap-0.5 sm:gap-1">
                              <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-400 flex-shrink-0" />
                              <span className="text-lg sm:text-xl md:text-2xl font-light text-blue-400">{Math.round(selectedDay.low)}°</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardTitle>

                    <div className="space-y-1 relative z-10 mt-3 sm:mt-4">
                      <p className="text-xl sm:text-2xl md:text-3xl font-medium tracking-tight">{selectedDay.condition}</p>
                      <p className="text-xs sm:text-sm line-clamp-2 md:line-clamp-none">{selectedDay.description}</p>
                      <div className="flex items-center gap-3 sm:gap-4 pt-1.5 sm:pt-2 flex-wrap">
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <Droplets className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-blue-400 whitespace-nowrap">{Math.round(selectedDay.precipProb)}% precipitação</span>
                        </div>
                        {selectedDay.snow > 0 && (
                          <div className="flex items-center gap-1 sm:gap-1.5">
                            <Snowflake className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-cyan-400 whitespace-nowrap">{selectedDay.snow} cm neve</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* Cartão Horário e Gráfico - Melhorado */}
                  <Card className="p-4 sm:p-5 md:p-6 overflow-hidden relative">
                    <h3 className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-[0.25em] sm:tracking-[0.3em] relative z-10 mb-3 sm:mb-4">
                      Fluxo de Temperatura (24h)
                    </h3>

                    <div className="flex gap-4 sm:gap-6 md:gap-12 overflow-x-auto pb-3 sm:pb-4 px-1 scrollbar-hide relative z-10 touch-pan-x -mx-1">
                      {selectedDay.hours && selectedDay.hours.length > 0 ? (
                        selectedDay.hours.map((h, i) => (
                          <div key={i} className="flex flex-col items-center gap-1.5 sm:gap-2 group min-w-[3rem] sm:min-w-12">
                            <span className="text-[8px] sm:text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{h.time.slice(0, 5)}</span>
                            <div className="transition-transform group-hover:scale-110">
                              {getWeatherIcon(h.icon || selectedDay.icon, 'w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6')}
                            </div>
                            <span className="text-base sm:text-lg font-medium tracking-tighter">{Math.round(h.temp)}°</span>
                            <div className="flex items-center gap-0.5 sm:gap-1">
                              <Droplets className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-blue-400 flex-shrink-0" />
                              <span className="text-[9px] sm:text-[10px] md:text-[12px] text-blue-400">{Math.round(h.precipProb ?? 0)}%</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-center w-full py-6 sm:py-8">
                          <p className="text-xs sm:text-sm text-muted-foreground">Dados horários não disponíveis</p>
                        </div>
                      )}
                    </div>

                    {chartData.length > 0 && (
                      <div className="relative z-10 border-t border-border pt-3 sm:pt-4 mt-2 sm:mt-3">
                        <ChartContainer config={chartConfig} className="h-40 sm:h-48 md:h-52 w-full">
                          <AreaChart accessibilityLayer data={chartData} margin={{ left: -20, right: -20, top: 5, bottom: 5 }}>
                            <defs>
                              <linearGradient id="sensacaoGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--chart-5)" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="var(--chart-5)" stopOpacity={0.05} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis
                              dataKey="time"
                              tickLine={false}
                              axisLine={false}
                              interval="preserveStartEnd"
                              tick={{ fontSize: 10 }}
                            />
                            <ChartTooltip
                              cursor={false}
                              content={<ChartTooltipContent indicator="line" className="space-x-2 sm:space-x-4 md:space-x-8" />}
                            />

                            <Area
                              type="monotone"
                              dataKey="temperatura"
                              stroke="var(--primary)"
                              fill="transparent"
                              strokeWidth={1.5}
                            />
                            <Area
                              type="monotone"
                              dataKey="sensacao"
                              stroke="var(--chart-5)"
                              fill="url(#sensacaoGradient)"
                              strokeWidth={1.5}
                            />
                          </AreaChart>
                        </ChartContainer>
                      </div>
                    )}
                  </Card>
                </div>

                {/* MÉTRICAS LATERAIS - Melhorado Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 lg:gap-6">
                  <MetricCard
                    icon={<Thermometer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    label="Sensação"
                    value={selectedDayIndex === 0
                      ? `${Math.round(weather.feelslike)}°`
                      : `${Math.round(selectedDay.feelslikeMax)}°`
                    }
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

              {/* MÉTRICAS INFERIORES - Grid Responsivo Melhorado */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
                <MetricSub
                  icon={<Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                  label="Visibilidade"
                  value={selectedDayIndex === 0 ? `${weather.visibility} km` : `${selectedDay.visibility} km`}
                />
                <MetricSub
                  icon={<Gauge className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                  label="Pressão"
                  value={selectedDayIndex === 0 ? `${weather.pressure} hPa` : `${selectedDay.pressure} hPa`}
                />
                <MetricSub
                  icon={<Cloud className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                  label="Nuvens"
                  value={selectedDayIndex === 0 ? `${Math.round(weather.cloudCover)}%` : `${Math.round(selectedDay.cloudCover)}%`}
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
                  value={`${getMoonPhase(selectedDay.moonPhase)}`}
                />
              </div>

              {/* ALERTA DE TEMPESTADE - Melhorado */}
              <Card className="p-3 sm:p-4 md:p-6 relative overflow-hidden h-full">
                {/* Elemento decorativo no canto */}
                <div className="absolute -right-4 sm:-right-6 -bottom-4 sm:-bottom-6 opacity-[0.03] pointer-events-none">
                  <CloudLightning className="w-24 h-24 sm:w-32 sm:h-32" />
                </div>

                {/* Wrapper principal com flex column */}
                <div className="relative z-10 h-full flex flex-col">
                  {/* Título no topo, alinhado à esquerda */}
                  <div className="flex items-center gap-1.5 sm:gap-2 pb-4 sm:pb-6">
                    <CloudLightning className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                    <span className="text-[9px] sm:text-[10px] md:text-[12px] font-bold text-secondary-foreground uppercase tracking-widest">
                      Alerta de Tempestade
                    </span>
                  </div>

                  {/* Conteúdo restante centralizado verticalmente no espaço sobrando */}
                  <div className="flex-1 flex items-center">
                    <div className="w-full space-y-2 sm:space-y-3">
                      <div className="flex items-center gap-2 sm:gap-4">
                        <span className="text-[12px] sm:text-[14px] text-muted-foreground uppercase min-w-12 sm:min-w-16 md:min-w-24">
                          Risco Severo
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="w-full h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${selectedDay.severeRisk < 30
                                ? 'bg-green-400'
                                : selectedDay.severeRisk < 60
                                  ? 'bg-yellow-400'
                                  : 'bg-red-400'
                                }`}
                              style={{ width: `${selectedDay.severeRisk}%` }}
                            />
                          </div>
                        </div>
                        <span
                          className={`text-[12px] sm:text-xs md:text-xl font-medium text-right ${getSevereRiskLevel(selectedDay.severeRisk).color}`}
                        >
                          {getSevereRiskLevel(selectedDay.severeRisk).label}
                        </span>
                      </div>

                      <p className="text-[8px] sm:text-[10px] md:text-[12px] text-muted-foreground uppercase leading-relaxed">
                        {selectedDay.severeRisk < 30
                          ? 'Condições normais esperadas'
                          : selectedDay.severeRisk < 60
                            ? 'Atenção para possíveis tempestades'
                            : 'Alto risco de condições severas - mantenha-se atento'}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

            </div>

            {/* SIDEBAR - PREVISÃO 15 DIAS - Melhorado */}
            <div className="w-full lg:w-80 xl:w-96">
              <Card className="px-4 sm:px-6 flex flex-col h-full">
                <h3 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em]">
                  Previsão 15 Dias
                </h3>

                <div className="flex-1 space-y-2 sm:space-y-3 md:space-y-4 pt-3 sm:pt-4 overflow-y-auto pr-1 sm:pr-2 pb-4 sm:pb-6">
                  {weather.daily.map((d, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedDayIndex(i)}
                      className={`
                        flex items-center justify-between group py-2 px-2 sm:px-3 md:px-6 rounded-lg transition-all cursor-pointer
                        ${selectedDayIndex === i
                          ? 'bg-primary/20 border-l-2 border-primary'
                          : 'hover:bg-accent/5'
                        }
                      `}
                    >
                      <div className="space-y-0.5 min-w-0 flex-shrink">
                        <p className={`
                          text-[10px] sm:text-xs md:text-[14px] font-bold uppercase tracking-tight transition-colors truncate
                          ${selectedDayIndex === i
                            ? 'text-primary'
                            : 'text-muted-foreground group-hover:text-white'
                          }
                        `}>
                          {i === 0 ? 'Hoje' : formatDateBR(i)}
                        </p>
                        <div className="flex items-center gap-1">
                          <Droplets className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-blue-400 flex-shrink-0" />
                          <span className="text-[9px] sm:text-[10px] md:text-[12px] text-blue-400">{Math.round(d.precipProb)}%</span>
                        </div>
                        {d.snow > 0 && (
                          <div className="flex items-center gap-1">
                            <CloudSnow className="w-2 h-2 sm:w-2.5 sm:h-2.5 flex-shrink-0" />
                            <span className="text-[7px] sm:text-[8px] text-cyan-400">{d.snow} cm</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 flex-shrink-0">
                        {getWeatherIcon(d.icon || weather.icon, 'w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5')}
                        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 w-12 sm:w-14 md:w-16 justify-end">
                          <div className="flex items-center gap-0.5">
                            <ChevronUp className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-red-400 flex-shrink-0" />
                            <span className="text-[9px] sm:text-[10px] md:text-xs font-bold">{Math.round(d.high)}°</span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <ChevronDown className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-blue-400 flex-shrink-0" />
                            <span className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground">{Math.round(d.low)}°</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </main>) : null}

        {/* FOOTER - Melhorado */}
        <footer className="pt-6 sm:pt-8 md:pt-16 pb-6 sm:pb-8 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 border-t border-border">
          <span className="text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-[0.3em] sm:tracking-[0.4em] text-center sm:text-left">Lumina Intelligence &copy; 2025</span>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-1 h-1 bg-muted-foreground rounded-full" />
            <span className="text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-[0.15em] sm:tracking-[0.2em]">Sistemas Operacionais</span>
          </div>
        </footer>
      </div>
    </div >
  )
}

// METRIC CARD - Component Melhorado
const MetricCard: React.FC<{ icon: JSX.Element, label: string, value: string, unit?: string, sub: string }> = ({ icon, label, value, unit, sub }) => (
  <Card className="p-3 sm:p-4 md:p-6 flex flex-col justify-between relative overflow-hidden min-h-[100px] sm:min-h-[110px] md:min-h-[120px]">
    <div className="absolute -right-3 -bottom-3 sm:-right-4 sm:-bottom-4 md:-right-6 md:-bottom-6 opacity-[0.03] pointer-events-none">
      {React.cloneElement(icon, { className: 'w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32' })}
    </div>

    <div className="space-y-0.5 relative z-10">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="text-primary flex-shrink-0">{icon}</div>
        <span className="text-[9px] sm:text-[10px] md:text-[12px] font-bold text-secondary-foreground uppercase tracking-widest truncate">{label}</span>
      </div>
      <p className="text-[8px] sm:text-[9px] md:text-[10px] text-muted-foreground uppercase leading-relaxed line-clamp-1">{sub}</p>
    </div>
    <div className="flex items-baseline gap-0.5 sm:gap-1 mt-2 sm:mt-3 md:mt-4 relative z-10">
      <span className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight">{value}</span>
      {unit && <span className="text-[7px] sm:text-[8px] md:text-[10px] text-muted-foreground font-bold uppercase">{unit}</span>}
    </div>
  </Card>
)

// METRIC SUB - Component Melhorado
const MetricSub: React.FC<{ icon: JSX.Element, label: string, value: string }> = ({ icon, label, value }) => (
  <Card className="p-2 sm:p-3 md:p-4 text-center relative overflow-hidden flex flex-col justify-center items-center min-h-[70px] sm:min-h-[80px] md:min-h-[90px]">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
      {React.cloneElement(icon, { className: 'w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20' })}
    </div>

    <div className="flex items-center justify-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1 md:mb-2 relative z-10 w-full">
      <div className="text-primary scale-75 sm:scale-90 md:scale-100 flex-shrink-0">{icon}</div>
      <p className="text-[7px] sm:text-[8px] md:text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] sm:tracking-[0.2em] truncate max-w-full">{label}</p>
    </div>
    <p className="text-xs sm:text-sm md:text-lg font-light tracking-tight relative z-10 whitespace-nowrap">{value}</p>
  </Card>
)

export default App
