# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

<!-- Cutline Project — ponto de entrada para agentes Claude. Leia inteiro antes de executar qualquer tarefa. -->

---

## 🎯 O que é o Cutline

**Cutline** (cutline.surf) é um web app que calcula cenários de classificação e eliminação matemática na WSL (World Surf League). Substitui planilhas Excel que fãs usam manualmente para responder "meu surfista ainda pode se classificar?".

**Tagline:** "Where do you stand?" / "Qual é seu cenário?"

---

## 📁 Documentação do Projeto

Antes de codar qualquer coisa, **LEIA estes documentos na ordem**:

| # | Arquivo | O que contém |
|---|---------|-------------|
| 1 | `docs/01-Analise-do-Problema.md` | Estrutura da WSL, tabela de pontos, lógica matemática de eliminação, formato CT 2026 |
| 2 | `docs/02-Requisitos-do-App.md` | 8 requisitos funcionais, 6 não-funcionais, modelo de dados, wireframes, plano de fases |
| 3 | `docs/03-Pesquisa-de-Naming.md` | Pesquisa de mercado, análise de competidores, justificativa do nome "Cutline" |
| 4 | `design/04-Design-System.md` | Tokens (cores, tipografia, spacing), componentes, layout patterns, acessibilidade, 6 referências reais |
| 5 | `design/05-Identidade-Visual.docx` | Documento profissional completo da identidade visual |
| 6 | `prototype/06-Prototipo-Interativo.html` | Protótipo funcional — abra no browser para ver o design em ação |

---

## 🏗️ Arquitetura & Stack

### Stack Definitiva

```
Frontend:    React 19 + Vite + TypeScript
Styling:     Tailwind CSS 4
State:       Zustand
Backend:     Supabase (PostgreSQL + Auth + Realtime)
Deploy:      Vercel
Domain:      cutline.surf
i18n:        Inglês (primário) + Português-BR
```

### Estrutura de Pastas (target)

```
cutline/
├── CLAUDE.md                    ← Você está aqui
├── docs/                        ← Documentação do projeto (não deployável)
├── design/                      ← Design system e identidade visual
├── prototype/                   ← Protótipos HTML standalone
│
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env.example
│
├── public/
│   ├── favicon.svg
│   └── og-image.png
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css                ← Tailwind imports + CSS custom properties do Design System
│   │
│   ├── engine/                  ← 🧮 MOTOR DE CÁLCULO (core business logic, zero dependências de UI)
│   │   ├── types.ts             ← Interfaces: Surfer, Event, Result, Tour, Season
│   │   ├── points-table.ts      ← Tabela de pontos CT/CS por colocação
│   │   ├── ranking.ts           ← Calcular ranking com descarte (best N of M)
│   │   ├── elimination.ts       ← Verificar eliminação matemática
│   │   ├── simulator.ts         ← Simular cenários hipotéticos
│   │   ├── scenarios.ts         ← Cenários pré-calculados e cruzados
│   │   ├── probability.ts       ← Monte Carlo simplificado para probabilidades
│   │   └── __tests__/           ← Testes unitários do engine (OBRIGATÓRIO 100% coverage)
│   │
│   ├── data/                    ← 📦 DADOS ESTÁTICOS (MVP sem backend)
│   │   ├── surfers-ct-2026.json
│   │   ├── events-ct-2026.json
│   │   ├── results-ct-2026.json
│   │   └── points-table.json
│   │
│   ├── stores/                  ← 🗃️ ZUSTAND STORES
│   │   ├── ranking-store.ts     ← Rankings computados, filtros ativos
│   │   ├── simulator-store.ts   ← Estado do simulador de cenários
│   │   └── ui-store.ts          ← Tab ativa, modal aberto, theme
│   │
│   ├── components/              ← 🧩 COMPONENTES UI
│   │   ├── layout/
│   │   │   ├── BottomNav.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── PageContainer.tsx
│   │   │
│   │   ├── ranking/
│   │   │   ├── PodiumTop3.tsx
│   │   │   ├── RankingRow.tsx
│   │   │   ├── RankingList.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── PillFilters.tsx
│   │   │
│   │   ├── simulator/
│   │   │   ├── ScenarioBuilder.tsx
│   │   │   ├── ResultDropdown.tsx
│   │   │   ├── SimulationResult.tsx
│   │   │   └── QuickScenarios.tsx
│   │   │
│   │   ├── surfer/
│   │   │   ├── SurferProfile.tsx
│   │   │   ├── SurferModal.tsx
│   │   │   ├── ResultsHistory.tsx
│   │   │   └── ScenarioCards.tsx
│   │   │
│   │   ├── calendar/
│   │   │   ├── EventCard.tsx
│   │   │   └── EventList.tsx
│   │   │
│   │   └── ads/
│   │       ├── AdBanner.tsx
│   │       ├── AdNative.tsx
│   │       └── AdSidebar.tsx
│   │
│   ├── pages/                   ← 📄 PÁGINAS (rotas)
│   │   ├── RankingsPage.tsx
│   │   ├── SimulatorPage.tsx
│   │   ├── CalendarPage.tsx
│   │   └── SurferPage.tsx
│   │
│   ├── hooks/                   ← 🪝 CUSTOM HOOKS
│   │   ├── useRanking.ts
│   │   ├── useSimulator.ts
│   │   └── useMediaQuery.ts
│   │
│   ├── lib/                     ← 🔧 UTILIDADES
│   │   ├── cn.ts                ← classnames helper
│   │   ├── format.ts            ← Formatar pontos, nomes, datas
│   │   └── constants.ts         ← Feature flags, URLs, config
│   │
│   └── i18n/                    ← 🌐 INTERNACIONALIZAÇÃO
│       ├── en.json
│       └── pt-BR.json
│
└── supabase/                    ← 🗄️ BACKEND (Fase 2+)
    ├── migrations/
    └── seed.sql
```

---

## 🧮 Motor de Cálculo — REGRAS CRÍTICAS

Este é o coração do app. **As regras abaixo são INVIOLÁVEIS**:

### Tabela de Pontos CT (evento padrão)
```
1º = 10,000 | 2º = 7,800 | 3º = 6,085 | 5º = 4,745 | 9º = 3,320
13º ≈ 2,590 | 17º ≈ 2,020 | 25º ≈ 1,575 | 33º ≈ 1,330
```

### Pipeline Masters = pontos × 1.5
```
1º = 15,000 | 2º = 11,700 | 3º = 9,128 | 5º = 7,118 | 9º = 4,980
```

### Regras de Descarte
```
CT Título:          best 9 of 12 resultados
CT Pós-temporada:   best 7 of 9 resultados (temporada regular)
CS Qualificação:    best 5 of 7 resultados
```

### Eliminação Matemática
```typescript
function isEliminated(surfer: Surfer, targetRank: number): boolean {
  const bestPossible = calculateBestCase(surfer); // pontos atuais - piores descartáveis + max restantes
  const targetSurfer = getRankedSurfer(targetRank);
  const worstTarget = calculateWorstCase(targetSurfer); // mínimo garantido do alvo

  return bestPossible < worstTarget;
}
```

### ⚠️ Edge Cases que DEVEM ser tratados
1. Pipeline vale 1.5× — SEMPRE aplicar multiplicador
2. Descarte muda conforme mais eventos acontecem (com 6 eventos jogados, descarta 0; com 12, descarta 3)
3. Empates: usar tiebreaker da WSL (melhor resultado individual > segundo melhor > etc.)
4. Wildcards: resultados contam para ranking mas não afetam contagem de vagas
5. Surfistas que não competem em um evento = 0 pontos (mas NÃO conta como "pior resultado" para descarte — simplesmente não entra na lista)

---

## 🎨 Design System — Resumo Rápido

> Detalhes completos em `design/04-Design-System.md`

### Conceito: "Ocean Dark"
- Dark theme com fundo azulado (não cinza puro)
- Acentos oceânicos (azul → turquesa)
- Mobile-first, dados são protagonistas

### Cores Principais
```css
--bg-primary: #0B1120;       /* Fundo principal */
--bg-secondary: #111827;     /* Cards */
--brand-500: #0EA5E9;        /* Primary action */
--accent-primary: #F97316;   /* CTAs, destaques */
--status-classified: #10B981; /* Verde */
--status-risk: #F59E0B;       /* Amber */
--status-eliminated: #EF4444; /* Vermelho */
```

### Font
```
Inter (font-feature-settings: 'tnum'; /* tabular numbers para scores */)
```

### Breakpoints
```
Mobile: < 768px (bottom nav, single column)
Desktop: ≥ 1024px (top nav, main + sidebar)
```

---

## 🚀 Como Rodar

```bash
# Instalar dependências
npm install

# Dev server
npm run dev

# Build
npm run build

# Testes do engine
npm run test

# Lint
npm run lint
```

---

## 📋 Plano de Execução por Fases

### Fase 1 — MVP (Prioridade MÁXIMA)

**Objetivo:** App funcionando com dados estáticos do CT 2026 masculino.

**Ordem de execução:**

```
1. Setup do projeto (Vite + React + TS + Tailwind + Zustand)
2. Engine de cálculo + testes unitários (SEM UI)
3. Dados estáticos (JSON com surfistas, eventos, resultados reais de 2025-2026)
4. UI: Layout base (Header, BottomNav, PageContainer)
5. UI: Rankings page (PodiumTop3, RankingList, StatusBadge, PillFilters)
6. UI: Simulator page (ScenarioBuilder, SimulationResult)
7. UI: Calendar page (EventList, EventCard)
8. UI: SurferModal (clique no ranking → perfil expandido)
9. Responsivo: mobile + desktop
10. Deploy no Vercel
```

### Fase 2 — Enriquecimento
- Challenger Series
- Simulação multi-evento
- Cenários cruzados (se A perde → B classifica?)
- Cenários pré-calculados
- Share via URL
- Rankings feminino

### Fase 3 — Automação
- Supabase backend
- Scraping/API WSL para dados em tempo real
- PWA offline
- Monte Carlo para probabilidades
- i18n PT-BR

### Fase 4 — Expansão
- QS regional
- Dados históricos
- Notificações push
- Longboard/Big Wave Tour

---

## 🤖 Instruções para Agentes Claude

### Princípios Gerais

1. **SEMPRE leia a doc antes de codar** — Os documentos em `docs/` e `design/` contêm decisões já tomadas. Não reinvente.
2. **Engine primeiro, UI depois** — O motor de cálculo é a prioridade #1. Sem ele, o app não tem valor.
3. **Testes são obrigatórios para o engine** — Zero tolerância para bugs em cálculos de pontos. Fãs vão comparar com a WSL oficial.
4. **Siga o Design System** — Cores, tipografia e componentes estão definidos em `design/04-Design-System.md`. Use-os.
5. **TypeScript strict** — `strict: true` no tsconfig. Sem `any`, sem `@ts-ignore`.

### Usando Team Feature (Agentes em Paralelo)

Para máxima velocidade, divida o trabalho em agentes paralelos:

#### Setup Inicial (sequencial, 1 agente)
```
Agente Principal:
→ npm create vite@latest . -- --template react-ts
→ Instalar deps (tailwind, zustand, vitest, lucide-react, react-router-dom)
→ Configurar tailwind.config.ts com tokens do Design System
→ Configurar vitest
→ Criar index.css com CSS custom properties
→ Commit: "chore: project setup"
```

#### Após setup, paralelizar:

```
┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐
│  AGENTE 1: Engine       │  │  AGENTE 2: Data + Types │  │  AGENTE 3: UI Base      │
│                         │  │                         │  │                         │
│  • src/engine/types.ts  │  │  • src/data/*.json      │  │  • src/index.css        │
│  • points-table.ts      │  │    (surfistas reais     │  │    (design tokens CSS)  │
│  • ranking.ts           │  │     CT 2026, eventos,   │  │  • Layout components    │
│  • elimination.ts       │  │     resultados reais)   │  │    (Header, BottomNav,  │
│  • simulator.ts         │  │  • Scrape/pesquisar     │  │     PageContainer)      │
│  • scenarios.ts         │  │    dados reais da WSL   │  │  • StatusBadge          │
│  • Testes unitários     │  │  • Validar pontos com   │  │  • PillFilters          │
│    para TUDO            │  │    site oficial WSL     │  │  • RankingRow           │
│                         │  │                         │  │  • PodiumTop3           │
└─────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘
         ↓                            ↓                            ↓
         └────────────────────────────┼────────────────────────────┘
                                      ↓
                    ┌─────────────────────────────────┐
                    │  INTEGRAÇÃO (Agente Principal)   │
                    │                                  │
                    │  • Zustand stores                │
                    │  • Conectar engine + data + UI   │
                    │  • Pages (Rankings, Simulator,   │
                    │    Calendar)                     │
                    │  • Responsividade                │
                    │  • Testes E2E                    │
                    │  • Deploy Vercel                 │
                    └─────────────────────────────────┘
```

#### Regras para Paralelização

1. **Agentes NÃO devem editar os mesmos arquivos** — Cada agente tem ownership de seus diretórios
2. **Engine (Agente 1) não importa nada de React** — É TypeScript puro, testável isoladamente
3. **UI (Agente 3) pode usar dados mock** até que Agente 2 termine os JSONs reais
4. **Integração acontece DEPOIS** que os 3 agentes terminam — nunca antes

### Convenções de Código

```typescript
// Naming
PascalCase    → Componentes React, Interfaces, Types
camelCase     → Funções, variáveis, hooks
kebab-case    → Arquivos de componentes (ranking-row.tsx) — NÃO, usamos PascalCase para componentes
UPPER_SNAKE   → Constantes globais

// Imports
import type { Surfer } from '@/engine/types'; // Type imports separados
import { calculateRanking } from '@/engine/ranking';
import { useRankingStore } from '@/stores/ranking-store';
import { RankingRow } from '@/components/ranking/RankingRow';

// Path aliases (configurar no vite.config.ts)
@ → src/
```

### Convenções de Commit

```
feat:     Nova funcionalidade
fix:      Correção de bug
refactor: Refatoração sem mudança de comportamento
test:     Adição/correção de testes
style:    Formatação, CSS
docs:     Documentação
chore:    Setup, configs, deps
data:     Atualização de dados (resultados, surfistas)
```

---

## 📊 Dados Reais que Precisam Ser Coletados

Para o MVP, precisamos dos dados reais do CT 2026:

1. **Lista completa de surfistas** CT 2026 (nome, país, seed)
2. **Calendário de eventos** com datas e locais
3. **Resultados já finalizados** da temporada
4. **Tabela de pontos oficial** (WSL Rule Book 2025/2026)
5. **Regras de tiebreaker** oficiais

Fonte primária: https://www.worldsurfleague.com/athletes/tour/mct
Fonte secundária: https://en.wikipedia.org/wiki/2026_World_Surf_League

---

## ⚠️ O que NÃO fazer

- ❌ Não usar Next.js — MVP é SPA pura com Vite (mais simples, mais rápido)
- ❌ Não criar backend no MVP — Dados estáticos em JSON
- ❌ Não usar CSS modules ou styled-components — Tailwind only
- ❌ Não ignorar mobile — 70%+ dos usuários será mobile
- ❌ Não inventar cores/fontes — Seguir Design System rigorosamente
- ❌ Não usar `any` em TypeScript — Nunca
- ❌ Não pular testes do engine — É o core do produto
- ❌ Não fazer deploy sem testar os cálculos contra dados reais da WSL

---

*Última atualização: 2026-02-28*
*Mantido por: @matheusmelchiades*
