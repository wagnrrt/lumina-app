import Fastify from 'fastify'
import cors from '@fastify/cors';
import { createClient } from 'redis'

interface RawWeather {
  currentConditions?: {
    temp?: number
    tempmax?: number
    tempmin?: number
    conditions?: string
    description?: string
    windspeed?: number
    uvindex?: number
    sunrise?: string
    sunset?: string
    humidity?: number
    visibility?: number
    pressure?: number
    icon?: string
  }
  hours?: Array<{
    datetime: string
    temp: number
    conditions: string
  }>
  days?: Array<{
    datetime: string
    tempmax: number
    tempmin: number
    conditions: string
  }>
  resolvedAddress?: string
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
    // Monta a URL base
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}`

    const params = new URLSearchParams({
      key: WEATHER_API_KEY || '',
      unitGroup: 'metric',
      include: 'days,hours,current',
      elements: 'datetime,tempmax,tempmin,temp,conditions,description,windspeed,uvindex,sunrise,sunset,humidity,visibility,pressure,icon',
      contentType: 'json',
      lang: 'pt'
    });

    // 4. Weather API response
    const response = await fetch(`${url}?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }

    // 5. Save cached response
    const raw = await response.json() as RawWeather;

    // Normaliza os campos que o frontend espera
    const normalized = {
      city: location,
      country: raw.resolvedAddress ?? '',
      temperature: raw.currentConditions?.temp ?? 0,
      high: raw.currentConditions?.tempmax ?? 0,
      low: raw.currentConditions?.tempmin ?? 0,
      condition: raw.currentConditions?.conditions ?? '',
      description: raw.currentConditions?.description ?? '',
      windSpeed: raw.currentConditions?.windspeed ?? 0,
      uvIndex: raw.currentConditions?.uvindex ?? 0,
      sunrise: raw.currentConditions?.sunrise ?? '',
      sunset: raw.currentConditions?.sunset ?? '',
      humidity: raw.currentConditions?.humidity ?? 0,
      visibility: raw.currentConditions?.visibility ?? 0,
      pressure: raw.currentConditions?.pressure ?? 0,
      icon: raw.currentConditions?.icon ?? '',
      hourly: raw.hours?.map(h => ({
        time: h.datetime,
        temp: h.temp,
        condition: h.conditions
      })) ?? [],
      daily: raw.days?.map(d => ({
        day: d.datetime,
        high: d.tempmax,
        low: d.tempmin,
        condition: d.conditions
      })) ?? []
    };

    await client.set(location, JSON.stringify(normalized), { EX: 60 * 60 });
    return normalized;

  } catch (error) {
    console.error(error)
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
