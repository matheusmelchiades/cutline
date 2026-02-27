# Cutline — Prompt Inicial & Guia para Claude Code

> **Este documento descreve como o Claude Code deve configurar e desenvolver o projeto Cutline.**
> É um complemento ao `CLAUDE.md` na raiz do projeto, com foco no fluxo de execução.

---

## 1. Contexto do Projeto

**Cutline** é um web app para calcular cenários de classificação e eliminação matemática na WSL (World Surf League).

| Item | Valor |
|------|-------|
| **Nome** | Cutline |
| **Domínio** | cutline.surf |
| **Tagline EN** | "Where do you stand?" |
| **Tagline PT-BR** | "Qual é seu cenário?" |
| **Público** | Fãs de surf (Brasil, Austrália, EUA, Havaí), jornalistas, apostadores |
| **Conceito visual** | "Ocean Dark" — dark theme com acentos oceânicos |
| **MVP** | CT 2026 masculino, dados estáticos, SPA |

### Documentação Existente

Antes de qualquer tarefa, leia na ordem:

1. `docs/01-Analise-do-Problema.md` — Estrutura WSL, tabela de pontos, lógica matemática
2. `docs/02-Requisitos-do-App.md` — 8 RFs, 6 RNFs, modelo de dados, wireframes, plano de fases
3. `docs/03-Pesquisa-de-Naming.md` — Análise de mercado, competidores, justificativa do nome
4. `design/04-Design-System.md` — Tokens, componentes, layout, acessibilidade, 6 referências
5. `design/05-Identidade-Visual.docx` — Documento profissional da identidade visual
6. `prototype/06-Prototipo-Interativo.html` — Protótipo funcional (abrir no browser)

---

## 2. Stack Definitiva

```
Frontend:     React 19 + Vite + TypeScript (strict)
Styling:      Tailwind CSS 4
State:        Zustand
Routing:      React Router DOM v7
Icons:        Lucide React
Testing:      Vitest + Testing Library
Backend:      Supabase (PostgreSQL + Auth + Realtime) — Fase 2+
Deploy:       Vercel
i18n:         EN (primário) + PT-BR
```

### Dependências do MVP

```json
{
  "dependencies": {
    "react": "^19",
    "react-dom": "^19",
    "react-router-dom": "^7",
    "zustand": "^5",
    "lucide-react": "latest"
  },
  "devDependencies": {
    "typescript": "^5.7",
    "vite": "^6",
    "@vitejs/plugin-react": "latest",
    "tailwindcss": "^4",
    "@tailwindcss/vite": "latest",
    "vitest": "latest",
    "@testing-library/react": "latest",
    "@testing-library/jest-dom": "latest",
    "eslint": "latest",
    "prettier": "latest"
  }
}
```

---

## 3. Estrutura de Pastas

```
cutline/
├── CLAUDE.md                       ← Instruções para Claude Code
├── README.md                       ← Overview do projeto
├── docs/                           ← Documentação (não deployável)
├── design/                         ← Design system e identidade visual
├── prototype/                      ← Protótipos HTML standalone
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
│   ├── main.tsx                    ← Entry point
│   ├── App.tsx                     ← Router setup
│   ├── index.css                   ← Tailwind + CSS custom properties
│   │
│   ├── engine/                     ← Motor de cálculo (TS puro, zero React)
│   │   ├── types.ts
│   │   ├── points-table.ts
│   │   ├── ranking.ts
│   │   ├── elimination.ts
│   │   ├── simulator.ts
│   │   ├── scenarios.ts
│   │   ├── probability.ts
│   │   └── __tests__/              ← Testes unitários (100% coverage)
│   │
│   ├── data/                       ← JSON estático (MVP)
│   │   ├── surfers-ct-2026.json
│   │   ├── events-ct-2026.json
│   │   ├── results-ct-2026.json
│   │   └── points-table.json
│   │
│   ├── stores/                     ← Zustand
│   │   ├── ranking-store.ts
│   │   ├── simulator-store.ts
│   │   └── ui-store.ts
│   │
│   ├── components/                 ← Componentes UI
│   │   ├── layout/                 ← Header, BottomNav, Sidebar, PageContainer
│   │   ├── ranking/                ← PodiumTop3, RankingRow, RankingList, StatusBadge, PillFilters
│   │   ├── simulator/              ← ScenarioBuilder, ResultDropdown, SimulationResult, QuickScenarios
│   │   ├── surfer/                 ← SurferProfile, SurferModal, ResultsHistory, ScenarioCards
│   │   ├── calendar/               ← EventCard, EventList
│   │   └── ads/                    ← AdBanner, AdNative, AdSidebar
│   │
│   ├── pages/                      ← Rotas
│   │   ├── RankingsPage.tsx
│   │   ├── SimulatorPage.tsx
│   │   ├── CalendarPage.tsx
│   │   └── SurferPage.tsx
│   │
│   ├── hooks/                      ← Custom hooks
│   │   ├── useRanking.ts
│   │   ├── useSimulator.ts
│   │   └── useMediaQuery.ts
│   │
│   ├── lib/                        ← Utilidades
│   │   ├── cn.ts
│   │   ├── format.ts
│   │   └── constants.ts
│   │
│   └── i18n/                       ← Traduções
│       ├── en.json
│       └── pt-BR.json
│
└── supabase/                       ← Backend (Fase 2+)
    ├── migrations/
    └── seed.sql
```

---

## 4. Estratégia de Agentes em Paralelo (Team Feature)

O Claude Code suporta rodar múltiplos agentes em paralelo. Use essa capacidade para acelerar o desenvolvimento.

### Fase 0 — Setup (Sequencial, 1 agente)

```
Agente Principal:
  1. npm create vite@latest . -- --template react-ts
  2. npm install (todas as deps listadas acima)
  3. Configurar vite.config.ts (path aliases @ → src/)
  4. Configurar tailwind.config.ts com tokens do Design System
  5. Configurar tsconfig.json (strict: true, paths)
  6. Configurar vitest.config.ts
  7. Criar src/index.css com CSS custom properties do Design System
  8. Criar .env.example
  9. git commit: "chore: project setup with vite, tailwind, zustand, vitest"
```

### Fase 1 — Desenvolvimento Paralelo (3 agentes simultâneos)

```
┌──────────────────────────────┐
│     AGENTE 1: ENGINE         │
│     (core business logic)    │
│                              │
│  Ownership:                  │
│  └── src/engine/*            │
│  └── src/engine/__tests__/*  │
│                              │
│  Tarefas:                    │
│  1. types.ts — Interfaces    │
│     Surfer, Event, Result,   │
│     Tour, Season, Placement  │
│                              │
│  2. points-table.ts          │
│     Tabela de pontos CT/CS   │
│     Multiplicador Pipeline   │
│                              │
│  3. ranking.ts               │
│     calculateRanking()       │
│     applyDiscards()          │
│     sortWithTiebreaker()     │
│                              │
│  4. elimination.ts           │
│     isEliminated()           │
│     bestPossibleScore()      │
│     worstGuaranteedScore()   │
│                              │
│  5. simulator.ts             │
│     simulateScenario()       │
│     simulateMultiEvent()     │
│     compareRankings()        │
│                              │
│  6. scenarios.ts             │
│     whatNeedsToHappen()      │
│     crossImpact()            │
│     quickInsights()          │
│                              │
│  7. Testes unitários para    │
│     CADA função acima.       │
│     Validar contra dados     │
│     reais da WSL.            │
│     Meta: 100% coverage      │
│                              │
│  REGRA: Zero imports de      │
│  React. TypeScript puro.     │
└──────────────────────────────┘

┌──────────────────────────────┐
│     AGENTE 2: DATA           │
│     (dados reais WSL 2026)   │
│                              │
│  Ownership:                  │
│  └── src/data/*              │
│                              │
│  Tarefas:                    │
│  1. Pesquisar no site da WSL │
│     os dados atualizados:    │
│     worldsurfleague.com/     │
│     athletes/tour/mct        │
│                              │
│  2. surfers-ct-2026.json     │
│     Todos os 36 surfistas    │
│     masculinos do CT 2026    │
│     (id, nome, país, seed)   │
│                              │
│  3. events-ct-2026.json      │
│     12 eventos com nome,     │
│     local, datas, status,    │
│     multiplicador (1x/1.5x)  │
│                              │
│  4. results-ct-2026.json     │
│     Resultados de eventos    │
│     já finalizados           │
│     (surfista, evento,       │
│      colocação, pontos)      │
│                              │
│  5. points-table.json        │
│     Tabela oficial de        │
│     pontos por colocação     │
│     (validar com Rule Book)  │
│                              │
│  6. Validar TODOS os pontos  │
│     contra o ranking oficial │
│     publicado pela WSL       │
│                              │
│  REGRA: Dados REAIS, não     │
│  inventados. Se não achar,   │
│  documentar o gap.           │
└──────────────────────────────┘

┌──────────────────────────────┐
│     AGENTE 3: UI             │
│     (componentes visuais)    │
│                              │
│  Ownership:                  │
│  └── src/components/*        │
│  └── src/pages/*             │
│  └── src/hooks/*             │
│  └── src/lib/*               │
│                              │
│  Referência obrigatória:     │
│  design/04-Design-System.md  │
│  prototype/06-Prototipo.html │
│                              │
│  Tarefas:                    │
│  1. Layout components        │
│     Header, BottomNav,       │
│     Sidebar, PageContainer   │
│     (responsivo: mobile →    │
│      bottom nav, desktop →   │
│      top nav + sidebar)      │
│                              │
│  2. Ranking components       │
│     PodiumTop3 (visual com   │
│     medalhas gold/silver/    │
│     bronze), RankingRow,     │
│     RankingList, StatusBadge │
│     PillFilters (CT/CS,      │
│     Masc/Fem)                │
│                              │
│  3. Simulator components     │
│     ScenarioBuilder,         │
│     ResultDropdown,          │
│     SimulationResult         │
│                              │
│  4. Calendar components      │
│     EventCard, EventList     │
│                              │
│  5. Surfer components        │
│     SurferModal com cenários │
│                              │
│  6. Ad slot components       │
│     AdBanner, AdNative,      │
│     AdSidebar (placeholder)  │
│                              │
│  Pode usar DADOS MOCK até    │
│  que o Agente 2 termine os   │
│  JSONs reais. A estrutura    │
│  dos mocks deve seguir os    │
│  types do Agente 1.          │
│                              │
│  REGRA: Seguir Design System │
│  rigorosamente. Todas as     │
│  cores, fonts, spacing vêm   │
│  dos tokens definidos.       │
└──────────────────────────────┘
```

### Fase 2 — Integração (Sequencial, 1 agente)

Após os 3 agentes paralelos terminarem:

```
Agente Principal:
  1. Criar Zustand stores conectando engine + data
     - ranking-store.ts (rankings computados, filtros)
     - simulator-store.ts (cenários em edição)
     - ui-store.ts (tab ativa, modal, theme)

  2. Conectar UI components com stores
     - RankingsPage usa ranking-store
     - SimulatorPage usa simulator-store
     - SurferModal puxa dados do ranking-store

  3. Configurar React Router
     - / → RankingsPage
     - /simulator → SimulatorPage
     - /calendar → CalendarPage
     - /surfer/:id → SurferPage

  4. Testar fluxo completo
     - Rankings carregam com dados reais
     - Simulador recalcula ao mudar resultado
     - Status badges refletem eliminação real

  5. Responsividade final
     - Mobile: bottom nav, single column, podium
     - Desktop: top nav, main + sidebar

  6. Performance check
     - Dashboard < 2s load
     - Simulação < 500ms recálculo

  7. Deploy Vercel
     - Configurar domínio cutline.surf
     - OG meta tags para compartilhamento

  8. git tag v0.1.0-mvp
```

### Diagrama Visual do Fluxo

```
                    ┌──────────────┐
                    │  FASE 0      │
                    │  Setup       │
                    │  (sequencial)│
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
      ┌───────────┐ ┌───────────┐ ┌───────────┐
      │ AGENTE 1  │ │ AGENTE 2  │ │ AGENTE 3  │
      │ Engine    │ │ Data      │ │ UI        │
      │ + Tests   │ │ + JSON    │ │ + Pages   │
      │           │ │           │ │           │
      │ PARALELO  │ │ PARALELO  │ │ PARALELO  │
      └─────┬─────┘ └─────┬─────┘ └─────┬─────┘
            │              │              │
            └──────────────┼──────────────┘
                           │
                    ┌──────▼───────┐
                    │  FASE 2      │
                    │  Integração  │
                    │  + Deploy    │
                    │  (sequencial)│
                    └──────────────┘
```

---

## 5. Regras de Negócio Críticas

### Tabela de Pontos CT

```
Colocação  │  Evento Normal  │  Pipeline (×1.5)
───────────┼─────────────────┼──────────────────
1º         │  10,000         │  15,000
2º         │   7,800         │  11,700
Equal 3º   │   6,085         │   9,128
Equal 5º   │   4,745         │   7,118
Equal 9º   │   3,320         │   4,980
Equal 13º  │  ~2,590         │  ~3,885
Equal 17º  │  ~2,020         │  ~3,030
Equal 25º  │  ~1,575         │  ~2,363
Equal 33º  │  ~1,330         │  ~1,995
```

### Regras de Descarte

```
CT Título mundial:     best 9 of 12 resultados
CT Pós-temporada:      best 7 of 9 resultados (temporada regular apenas)
CS Qualificação CT:    best 5 of 7 resultados
```

### Eliminação Matemática — Pseudocódigo

```typescript
function isEliminated(surfer: Surfer, targetRank: number, season: Season): boolean {
  // 1. Calcular máximo possível do surfista
  const currentResults = surfer.results.sort((a, b) => b.points - a.points);
  const eventsRemaining = season.totalEvents - surfer.results.length;
  const maxPointsPerEvent = season.isLastEvent
    ? POINTS_TABLE[1] * 1.5  // Pipeline
    : POINTS_TABLE[1];       // 10,000

  // Simular vitória em TODOS os eventos restantes
  const bestCaseResults = [
    ...currentResults,
    ...Array(eventsRemaining).fill(maxPointsPerEvent)
  ];

  // Aplicar descarte (best N of M)
  const bestN = season.bestOf;
  const bestPossible = bestCaseResults
    .sort((a, b) => b - a)
    .slice(0, bestN)
    .reduce((sum, pts) => sum + pts, 0);

  // 2. Calcular mínimo garantido do surfista na posição-alvo
  const targetSurfer = getRankedSurfer(targetRank);
  const worstCaseTarget = calculateWorstCase(targetSurfer, season);

  // 3. Comparar
  return bestPossible < worstCaseTarget;
}
```

### Edge Cases Obrigatórios

1. **Pipeline vale 1.5×** — SEMPRE aplicar multiplicador no último evento
2. **Descarte dinâmico** — Com 6 eventos jogados descarta 0; com 12 descarta 3
3. **Empates** — Tiebreaker WSL: melhor resultado individual → segundo melhor → etc.
4. **Wildcards** — Resultados contam mas não afetam contagem de vagas fixas
5. **Não-participação** — 0 pontos, NÃO entra como "pior resultado" para descarte
6. **Equal positions** — "Equal 3rd" = dois surfistas empatados em 3º (não existe 4º)

---

## 6. Design System — Tokens Essenciais

> Referência completa em `design/04-Design-System.md`

### Cores

```css
/* Backgrounds (dark, tom azulado) */
--bg-primary:           #0B1120;
--bg-secondary:         #111827;
--bg-tertiary:          #1E293B;
--bg-elevated:          #1A2744;

/* Brand (azul oceano) */
--brand-500:            #0EA5E9;
--brand-400:            #38BDF8;
--brand-600:            #0284C7;

/* Accent */
--accent-primary:       #F97316;   /* Laranja — CTAs */
--accent-secondary:     #FBBF24;   /* Amarelo — wildcards */

/* Status */
--status-classified:    #10B981;   /* Verde */
--status-risk:          #F59E0B;   /* Amber */
--status-eliminated:    #EF4444;   /* Vermelho */

/* Ranking */
--rank-gold:            #FFD700;
--rank-silver:          #C0C0C0;
--rank-bronze:          #CD7F32;

/* Text */
--text-primary:         #F8FAFC;
--text-secondary:       #94A3B8;
--text-tertiary:        #64748B;
```

### Tipografia

```
Font: Inter (com font-feature-settings: 'tnum' para números tabulares)

Display:    700 32px/1.1  — títulos de página
Heading:    700 24px/1.2  — seções
Subheading: 600 18px/1.3  — subtítulos
Body:       400 15px/1.5  — texto corrido
Caption:    500 13px/1.4  — labels
Micro:      600 11px/1.3  — badges

Score LG:   700 28px/1    — score principal
Score MD:   600 20px/1    — score secundário
Score SM:   600 16px/1    — score em lista
Rank:       800 18px/1    — posição no ranking
```

### Componentes Principais

| Componente | Descrição |
|------------|-----------|
| **BottomNav** | 4 items: Rankings, Simulator, Calendar, More. Ativo = brand-500 + dot |
| **PodiumTop3** | 3 avatares com medalhas (1º maior no centro, 2º esquerda, 3º direita) |
| **RankingRow** | Grid: posição → avatar → nome/país → pontos → variação → status badge |
| **StatusBadge** | Classified (verde), Risk (amber), Eliminated (vermelho), Live (pulse) |
| **PillFilters** | Toggle buttons arredondados: CT/CS, Masculino/Feminino |
| **EventCard** | Nome, local, data, status (completed/live/upcoming), badge Pipeline |
| **SurferModal** | Perfil expandido com stats, resultados, cenários de classificação |
| **AdBanner** | 320×50 mobile / 728×90 desktop, fundo bg-secondary |
| **AdNative** | In-feed entre ranking rows, mesma aparência + label "Ad" |
| **AdSidebar** | 300×250 na coluna direita (desktop only) |

---

## 7. Convenções

### TypeScript

```typescript
// strict: true, no any, no @ts-ignore
// Type imports separados
import type { Surfer, Event } from '@/engine/types';

// Path aliases
@ → src/

// Naming
PascalCase  → Componentes, Interfaces, Types
camelCase   → Funções, variáveis, hooks
UPPER_SNAKE → Constantes
```

### Commits

```
feat:     Nova funcionalidade
fix:      Bug fix
refactor: Refatoração
test:     Testes
style:    CSS/formatação
docs:     Documentação
chore:    Setup, deps
data:     Atualização de dados WSL
```

### Branches

```
main           ← produção
develop        ← integração
feat/*         ← features
fix/*          ← correções
data/update-*  ← atualização de resultados
```

---

## 8. O que NÃO Fazer

- ❌ **Não usar Next.js** — MVP é SPA com Vite (simples e rápido)
- ❌ **Não criar backend no MVP** — Dados estáticos em JSON
- ❌ **Não usar CSS modules ou styled-components** — Tailwind only
- ❌ **Não ignorar mobile** — 70%+ dos usuários será mobile
- ❌ **Não inventar cores/fontes** — Seguir Design System rigorosamente
- ❌ **Não usar `any`** — TypeScript strict sem exceções
- ❌ **Não pular testes do engine** — É o core, bugs são inaceitáveis
- ❌ **Não fazer deploy sem validar** contra dados reais da WSL
- ❌ **Não misturar engine com React** — Engine é TS puro, testável isolado
- ❌ **Não editar o mesmo arquivo em agentes paralelos** — Cada agente tem ownership

---

## 9. Métricas de Sucesso do MVP

| Métrica | Target |
|---------|--------|
| Dashboard load time | < 2 segundos |
| Simulação recálculo | < 500ms |
| Precisão dos cálculos vs WSL oficial | 100% |
| Engine test coverage | 100% |
| Lighthouse mobile score | > 90 |
| WCAG contrast compliance | AA (4.5:1 mínimo) |

---

## 10. Dados Reais para Coletar

Para o MVP funcionar com dados reais:

| Dado | Fonte |
|------|-------|
| Lista de surfistas CT 2026 | worldsurfleague.com/athletes/tour/mct |
| Calendário de eventos 2026 | worldsurfleague.com/events |
| Resultados finalizados | worldsurfleague.com/athletes/rankings |
| Tabela de pontos oficial | WSL Rule Book 2025/2026 PDF |
| Regras de tiebreaker | WSL Rule Book seção de rankings |
| Formato de cada evento | worldsurfleague.com/posts (press releases) |

---

*Cutline — Where do you stand?*
*cutline.surf*
