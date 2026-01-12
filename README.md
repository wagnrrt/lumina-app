# Lumina App - Frontend

Aplicativo de meteorologia moderno e responsivo construído com React, TypeScript e Vite.

## Estrutura do Projeto

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

## Stack Tecnológica

- **React 19** - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Utility-first CSS
- **Recharts** - Biblioteca de gráficos
- **Lucide React** - Sistema de ícones
- **shadcn/ui** - Componentes base acessíveis

## Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Editar .env com a URL do backend
VITE_API_URL=http://localhost:3000/api
```

## Funcionalidades

- Busca de cidades em tempo real
- Previsão estendida de 15 dias
- Detalhamento horário com previsão de 24 horas
- Gráficos interativos de temperatura e sensação térmica
- Métricas completas: UV index, vento, umidade, pressão, visibilidade
- Sistema de alertas de tempestades severas
- Indicadores de nascer e pôr do sol
- Fases da lua
- Interface totalmente responsiva (mobile-first)
- Dark mode nativo
- Animações e transições suaves

## Integração com Backend

O frontend espera as seguintes rotas do backend:

```typescript
GET /

Query Parameters
- location (string): city or location name

    Exemplo de Request
GET http://localhost:3000/?location=Araras

// Resposta esperada segue a interface WeatherData
// Consulte src/types/weather.ts para estrutura completa
```

### Exemplo de Resposta

```json
{
  "resolvedAddress": "São Paulo, BR",
  "temperature": 24.5,
  "feelslike": 26.2,
  "icon": "partly-cloudy-day",
  "visibility": 10,
  "pressure": 1013,
  "cloudCover": 45,
  "daily": [
    {
      "icon": "partly-cloudy-day",
      "condition": "Parcialmente Nublado",
      "description": "Céu parcialmente coberto com possibilidade de chuvas isoladas",
      "temp": 24.5,
      "high": 28,
      "low": 18,
      "precipProb": 30,
      "windSpeed": 15,
      "humidity": 65,
      "uvIndex": 7,
      "hours": [...]
    }
  ]
}
```

## Licença

MIT License - veja o arquivo LICENSE para detalhes

## Contato

Para questões e suporte, abra uma issue no repositório.
https://lumina-weather.vercel.app
