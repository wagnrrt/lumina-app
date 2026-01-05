import Fastify from 'fastify'
import cors from '@fastify/cors';
import { createClient } from 'redis'

interface RawWeather {
  // Metadados da consulta
  resolvedAddress?: string
  currentConditions?: {
    datetime?: string
    datetimeEpoch?: number
    temp?: number
    feelslike?: number
    conditions?: string
    description?: string
    icon?: string
    windspeed?: number
    windgust?: number
    winddir?: number
    humidity?: number
    pressure?: number
    visibility?: number
    cloudcover?: number
    dew?: number
    uvindex?: number
    sunrise?: string
    sunriseEpoch?: number
    sunset?: string
    sunsetEpoch?: number
    moonphase?: number
    solarradiation?: number
    solarenergy?: number
    precip?: number
    precipprob?: number
    preciptype?: string[] | null
    snow?: number
    snowdepth?: number
  }
  days?: Array<{
    datetime: string
    datetimeEpoch: number
    // Temperatura
    tempmax: number
    tempmin: number
    temp: number
    feelslikemax?: number
    feelslikemin?: number
    feelslike?: number
    // Condições
    conditions: string
    description?: string
    icon?: string
    // Vento
    windspeed?: number
    windgust?: number
    winddir?: number
    // Atmosfera
    humidity?: number
    pressure?: number
    visibility?: number
    cloudcover?: number
    dew?: number
    uvindex?: number
    // Precipitação
    precip?: number
    precipprob?: number
    precipcover?: number
    preciptype?: string[] | null
    snow?: number
    snowdepth?: number
    // Sol e Lua
    sunrise?: string
    sunriseEpoch?: number
    sunset?: string
    sunsetEpoch?: number
    moonphase?: number
    // Risco
    severerisk?: number
    // Horas do dia
    hours?: Array<{
      datetime: string
      datetimeEpoch?: number
      temp: number
      feelslike?: number
      conditions: string
      icon?: string
      windspeed?: number
      windgust?: number
      winddir?: number
      humidity?: number
      pressure?: number
      visibility?: number
      cloudcover?: number
      dew?: number
      uvindex?: number
      precip?: number
      precipprob?: number
      preciptype?: string[] | null
      snow?: number
      snowdepth?: number
    }>
  }>
}

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT)
  },
  password: process.env.REDIS_PASSWORD || undefined
});

client.on('error', err => console.log('Redis Client Error', err));

const server = Fastify({
  logger: true
})

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

interface WeatherQueryParams {
  location: string;
}


async function getWeatherData({ location }: WeatherQueryParams) {
  if (!location) {
    throw new Error('Location is required')
  }

  try {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}`

    const params = new URLSearchParams({
      key: WEATHER_API_KEY || '',
      unitGroup: 'metric',
      include: 'days,hours,current',
      lang: 'pt'
    });

    const response = await fetch(`${url}?${params.toString()}`)

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Weather API Error:', {
        status: response.status,
        body: errorText,
        location
      });
      throw new Error(`Weather API error: ${response.status} - ${errorText}`)
    }

    const raw = await response.json() as RawWeather;

    const normalized = {
      resolvedAddress: raw.resolvedAddress ?? '',

      // Current conditions
      temperature: raw.currentConditions?.temp ?? 0,
      feelslike: raw.currentConditions?.feelslike ?? 0,
      condition: raw.currentConditions?.conditions ?? '',
      description: raw.currentConditions?.description ?? '',
      icon: raw.currentConditions?.icon ?? '',

      // Hoje 
      high: raw.days?.[0]?.tempmax ?? 0,
      low: raw.days?.[0]?.tempmin ?? 0,

      // Vento 
      windSpeed: raw.currentConditions?.windspeed ?? 0,
      windGust: raw.currentConditions?.windgust ?? 0,
      windDir: raw.currentConditions?.winddir ?? 0,

      // Precipitação 
      precip: raw.currentConditions?.precip ?? 0,
      precipProb: raw.currentConditions?.precipprob ?? 0,
      precipProbDay: raw.days?.[0]?.precipprob ?? 0,
      precipType: raw.days?.[0]?.preciptype ?? null,
      snow: raw.days?.[0]?.snow ?? 0,
      snowDepth: raw.days?.[0]?.snowdepth ?? 0,

      // Atmosfera
      humidity: raw.currentConditions?.humidity ?? 0,
      pressure: raw.currentConditions?.pressure ?? 0,
      visibility: raw.currentConditions?.visibility ?? 0,
      cloudCover: raw.currentConditions?.cloudcover ?? 0,
      dew: raw.currentConditions?.dew ?? 0,
      uvIndex: raw.currentConditions?.uvindex ?? 0,

      // Solar
      solarRadiation: raw.currentConditions?.solarradiation ?? 0,
      solarEnergy: raw.currentConditions?.solarenergy ?? 0,

      // Sol e lua
      sunrise: raw.currentConditions?.sunrise ?? '',
      sunset: raw.currentConditions?.sunset ?? '',
      moonPhase: raw.currentConditions?.moonphase ?? 0,

      // Previsões horárias
      hourly: raw.days?.[0]?.hours?.map(h => ({
        time: h.datetime,
        epoch: h.datetimeEpoch,
        temp: h.temp,
        feelslike: h.feelslike ?? h.temp,
        condition: h.conditions,
        icon: h.icon ?? '',
        precipProb: h.precipprob ?? 0,
        precipType: h.preciptype ?? null,
        windSpeed: h.windspeed ?? 0,
        windGust: h.windgust ?? 0,
        humidity: h.humidity ?? 0,
        cloudCover: h.cloudcover ?? 0,
        uvIndex: h.uvindex ?? 0,
        visibility: h.visibility ?? 0
      })) ?? [],

      // Previsões diárias 
      daily: raw.days?.map(d => ({
        day: d.datetime,
        epoch: d.datetimeEpoch,
        high: d.tempmax,
        low: d.tempmin,
        temp: d.temp,
        feelslikeMax: d.feelslikemax ?? d.tempmax,
        feelslikeMin: d.feelslikemin ?? d.tempmin,
        condition: d.conditions,
        description: d.description ?? '',
        icon: d.icon ?? '',
        precipProb: d.precipprob ?? 0,
        precipCover: d.precipcover ?? 0,
        precipType: d.preciptype ?? null,
        snow: d.snow ?? 0,
        windSpeed: d.windspeed ?? 0,
        windGust: d.windgust ?? 0,
        humidity: d.humidity ?? 0,
        uvIndex: d.uvindex ?? 0,
        sunrise: d.sunrise ?? '',
        sunset: d.sunset ?? '',
        moonPhase: d.moonphase ?? 0,
        severeRisk: d.severerisk ?? 0,
        // ✅ ADICIONADO: Campos que existem em days[]
        pressure: d.pressure ?? 0,
        cloudCover: d.cloudcover ?? 0,
        visibility: d.visibility ?? 0,
        // ✅ ADICIONADO: Previsão horária do dia
        hours: d.hours?.map(h => ({
          time: h.datetime,
          epoch: h.datetimeEpoch,
          temp: h.temp,
          feelslike: h.feelslike ?? h.temp,
          condition: h.conditions,
          icon: h.icon ?? '',
          precipProb: h.precipprob ?? 0,
          precipType: h.preciptype ?? null,
          windSpeed: h.windspeed ?? 0,
          windGust: h.windgust ?? 0,
          humidity: h.humidity ?? 0,
          cloudCover: h.cloudcover ?? 0,
          uvIndex: h.uvindex ?? 0,
          visibility: h.visibility ?? 0
        })) ?? []
      })) ?? []
    }

    await client.set(location, JSON.stringify(normalized), { EX: 60 * 60 });

    return normalized;

  } catch (error) {
    console.error('getWeatherData error:', error)
    throw error;
  }
}

server.get('/', async (request, reply) => {
  const { location } = request.query as { location?: string };

  if (!location) {
    return reply.status(400).send({ error: 'Location is required' });
  }

  // 1. Check cache
  const data = await client.get(location);

  if (!data) {
    // 2. Cache response
    try {
      // 3. Request Weather API
      const json = await getWeatherData({ location });

      return reply.send(json)
    } catch (err) {
      return reply.status(500).send({ error: 'Failed to fetch data' })
    }
  }

  return reply.send(JSON.parse(data));
});


const start = async () => {
  try {
    await client.connect();

    // Habilita CORS para todas as origens
    await server.register(cors, {
      origin: 'http://localhost:5173', methods: ['GET']
    });

    await server.listen({ port: 3000, host: '0.0.0.0' })

  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
