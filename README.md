# Lumina Weather - Frontend

Aplicativo de meteorologia moderno e responsivo construído com React, TypeScript e Vite.

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes React organizados por feature
│   ├── forecast/       # Componentes de previsão
│   ├── layout/         # Header, Footer
│   ├── loading/        # Loading e Error states
│   ├── metrics/        # Cards de métricas
│   ├── search/         # Barra de busca
│   ├── ui/            # Componentes base (shadcn/ui)
│   └── weather-card/  # Cards principais do clima
├── hooks/             # Custom hooks
│   └── useWeather.ts  # Hook para gerenciar dados do clima
├── services/          # Serviços de API
│   ├── api.ts        # Configuração base do fetch
│   └── weatherService.ts  # Chamadas específicas de clima
├── types/            # TypeScript types
│   └── weather.ts    # Tipos de dados do clima
├── utils/            # Utilitários
│   ├── constants.ts  # Constantes da aplicação
│   ├── formatters.ts # Funções de formatação
│   └── weatherIcons.tsx  # Mapeamento de ícones
├── App.tsx           # Componente principal
└── main.tsx          # Entry point
```

## 🚀 Tecnologias

- **React 18** - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Gráficos
- **Lucide React** - Ícones
- **shadcn/ui** - Componentes base

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Editar .env com a URL do backend
VITE_API_URL=http://localhost:3000/api
```

## 🏃 Executar

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

## 🎨 Features

- ✅ Busca de cidades
- ✅ Previsão de 15 dias
- ✅ Detalhamento horário (24h)
- ✅ Gráficos de temperatura
- ✅ Métricas detalhadas (UV, vento, umidade, etc)
- ✅ Alerta de tempestades
- ✅ Totalmente responsivo
- ✅ Dark mode nativo

## 🔌 Integração com Backend

O frontend espera as seguintes rotas do backend:

```typescript
GET /api/weather?city={cityName}

// Resposta esperada: WeatherData (ver src/types/weather.ts)
```

## 📱 Componentes Principais

### `useWeather` Hook
Gerencia estado de carregamento, erro e dados do clima.

### `MainWeatherCard`
Exibe temperatura atual, condições e localização.

### `HourlyForecast`
Mostra previsão hora a hora com gráfico.

### `ForecastSidebar`
Lista de 15 dias de previsão.

## 🎯 Arquitetura

A estrutura segue princípios de **separação de responsabilidades**:

- **Components**: UI pura, sem lógica de negócio
- **Hooks**: Lógica reutilizável e estado
- **Services**: Comunicação com APIs
- **Utils**: Funções auxiliares puras
- **Types**: Definições de tipos centralizadas

## 🌐 Variáveis de Ambiente

```bash
VITE_API_URL=http://localhost:3000/api  # URL base do backend
```

## 📄 Licença

MIT
