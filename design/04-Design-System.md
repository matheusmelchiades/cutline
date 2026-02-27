# Cutline — Design System & Identidade Visual v2

> **App:** Cutline — WSL Scenario Calculator
> **Versão:** 2.0
> **Data:** 2026-02-28

---

## 1. Referências Reais & Inspirações

### 1.1 Referências Coletadas (Dribbble + Behance)

| # | Projeto | Plataforma | Designer | O que extraímos |
|---|---------|------------|----------|-----------------|
| 1 | **Leaderboard Dashboard** | Dribbble | Nasir Uddin | Padrão de pódio mobile com Top 3 em destaque (avatares circulares com medalha, 1º maior no centro). Lista de ranking abaixo com linhas alternadas. |
| 2 | **Live Football & Scoring App** | Dribbble | Panze Studio | Dark theme com gradientes vibrantes (laranja→rosa). Score cards bold com tipografia grande. Bottom nav clean com 4 ícones. Tabs de filtro arredondadas. |
| 3 | **Surfee — Surf Forecast App** | Dribbble | RonDesignLab | Light theme com tons naturais (areia, verde-mar, amarelo-sol). Ícones orgânicos. Cards arredondados com fotos de ondas. Sensação premium sem ser corporativa. |
| 4 | **Surfisticate — Surfing School** | Behance | Gergö Bartha | Paleta de azuis oceânicos (#1D75BD → #0EBBF3 → #159CDC). Fonte Satoshi Variable. Sidebar dashboard para desktop. Tabelas de dados com badges de status. Ícones outline simples. |
| 5 | **Pro Surf // APP (Moche)** | Behance | Márcia Galrao | App real de competição de surf! Scoreboard live com ranking numerado (1º, 2º, 3º, 4º). Coluna "needs X.XX" (precisa de nota). Menu: Live, Etapas, Rankings, Surfistas. Cores vibrantes (turquesa + amarelo + roxo). |
| 6 | **Athlevo — Athletic App** | Behance | Nataraj M | Dark theme sofisticado com acento roxo/lilás. Pill-shaped filters para categorias. Bottom nav minimalista. Cards com cantos arredondados grandes (16px+). Tipografia bold para headings. |

### 1.2 Padrões Identificados

**Convergências entre as referências:**

1. **Dark theme é dominante** em apps esportivos (4 de 6 usam dark)
2. **Bottom navigation** com 4-5 itens é padrão mobile
3. **Ranking em lista** com número de posição à esquerda, nome no centro, pontos à direita
4. **Top 3 em destaque** com tratamento visual diferenciado (pódio ou cards maiores)
5. **Pill/chip filters** para alternar entre categorias (CT/CS, Masculino/Feminino)
6. **Cores de acento vibrantes** sobre fundo escuro (azul, turquesa, ou laranja)
7. **Tipografia bold** para scores e rankings — números precisam ser muito legíveis
8. **Cantos arredondados** em cards (12-16px radius)

---

## 2. Conceito Visual

### 2.1 Filosofia — "Ocean Dark"

Inspirado pela estética da WSL oficial (preto + branco limpo) combinada com acentos oceânicos retirados do Surfisticate (azul profundo → turquesa). O resultado é um app que parece pertencer ao ecossistema surf, não a um dashboard genérico.

**Princípios:**
- **Dark-first com personalidade** — Não é só cinza escuro genérico; o fundo tem um leve tom azulado que remete ao oceano à noite
- **Dados são o protagonista** — Tipografia bold para scores, hierarquia clara entre nome/pontos/status
- **Surf culture, not corporate** — Cantos arredondados, transições suaves, icons com personality
- **Mobile-native** — Pensado primeiro para o fã assistindo ao evento no celular

### 2.2 Nome & Logo

**Nome:** Cutline
**Tagline:** "Every scenario. Every wave."

**Logo concept:** Ícone de onda estilizada formando um "S" + calculadora/gráfico minimalista. Cores: turquesa (#0EBBF3) sobre fundo escuro. Inspirado na simplicidade do logo do Surfisticate mas com DNA de dados.

---

## 3. Design Tokens

### 3.1 Cores

#### Core Palette (inspirada no Surfisticate + Panze Studio)
```css
/* Background Layers — tom azulado sutil, não cinza puro */
--bg-primary: #0B1120;        /* Fundo principal — azul muito escuro */
--bg-secondary: #111827;      /* Cards e superfícies elevadas */
--bg-tertiary: #1E293B;       /* Inputs, hover states, secondary cards */
--bg-elevated: #1A2744;       /* Modais, dropdowns, tooltips */

/* Brand — extraído do Surfisticate (#1D75BD → #0EBBF3) */
--brand-500: #0EA5E9;         /* Primary action — azul oceano */
--brand-400: #38BDF8;         /* Hover — mais claro */
--brand-600: #0284C7;         /* Active/pressed */
--brand-300: #7DD3FC;         /* Texto sobre dark bg para links */

/* Accent — inspirado no Panze Studio (gradiente vibrante) */
--accent-primary: #F97316;    /* Laranja — CTAs, destaques, "HOT" scenarios */
--accent-secondary: #FBBF24;  /* Amarelo — sol, badges de wildcard */

/* Semantic — padrão Pro Surf scoreboard */
--status-classified: #10B981;  /* Verde — classificado, positivo */
--status-risk: #F59E0B;        /* Amber — em risco, bubble */
--status-eliminated: #EF4444;  /* Vermelho — eliminado */
--status-live: #EF4444;        /* Vermelho pulsante — ao vivo */
--status-locked: #6B7280;      /* Cinza — matematicamente garantido/travado */

/* Text */
--text-primary: #F8FAFC;       /* Branco quase-puro para headings */
--text-secondary: #94A3B8;     /* Cinza claro para labels */
--text-tertiary: #64748B;      /* Cinza médio para placeholders */
--text-muted: #475569;         /* Cinza escuro para disabled */

/* Ranking position colors — inspirado no pódio do Nasir Uddin */
--rank-gold: #FFD700;          /* 1º lugar */
--rank-silver: #C0C0C0;        /* 2º lugar */
--rank-bronze: #CD7F32;        /* 3º lugar */
```

#### Gradientes
```css
/* Hero gradient — inspirado no Panze Studio */
--gradient-brand: linear-gradient(135deg, #0EA5E9 0%, #06B6D4 50%, #0EBBF3 100%);
--gradient-hot: linear-gradient(135deg, #F97316 0%, #EF4444 100%);
--gradient-card: linear-gradient(180deg, #1A2744 0%, #111827 100%);
--gradient-podium: linear-gradient(180deg, rgba(14,165,233,0.15) 0%, transparent 100%);
```

### 3.2 Tipografia

**Font family:** Inter (fallback: system-ui) — escolhida por ser excelente para números e dados tabulares, com variante tabular-nums nativa.

```css
/* Scale — inspirada na hierarquia bold do Athlevo */
--font-display: 700 2rem/1.1 'Inter', system-ui;        /* 32px — títulos de página */
--font-heading: 700 1.5rem/1.2 'Inter', system-ui;      /* 24px — seções */
--font-subheading: 600 1.125rem/1.3 'Inter', system-ui;  /* 18px — subtítulos */
--font-body: 400 0.9375rem/1.5 'Inter', system-ui;      /* 15px — texto corrido */
--font-caption: 500 0.8125rem/1.4 'Inter', system-ui;   /* 13px — labels, metadata */
--font-micro: 600 0.6875rem/1.3 'Inter', system-ui;     /* 11px — badges, tags */

/* Scores — precisam ser MUITO legíveis (inspiração Pro Surf) */
--font-score-lg: 700 1.75rem/1 'Inter', system-ui;      /* 28px — score principal */
--font-score-md: 600 1.25rem/1 'Inter', system-ui;      /* 20px — score secundário */
--font-score-sm: 600 1rem/1 'Inter', system-ui;          /* 16px — score em lista */

/* Ranking position — extra bold */
--font-rank: 800 1.125rem/1 'Inter', system-ui;          /* 18px — #1, #2, #3... */
```

### 3.3 Spacing & Layout

```css
/* Base unit: 4px */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */

/* Radius — cantos arredondados (Athlevo-style, 12-16px) */
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
--radius-full: 9999px;  /* Pills, avatares */

/* Shadows — elevação sutil sobre dark bg */
--shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
--shadow-md: 0 4px 12px rgba(0,0,0,0.4);
--shadow-lg: 0 8px 24px rgba(0,0,0,0.5);
--shadow-glow: 0 0 20px rgba(14,165,233,0.15);  /* Glow azul sutil */
```

### 3.4 Breakpoints

```css
/* Mobile-first */
--bp-sm: 640px;    /* Mobile landscape */
--bp-md: 768px;    /* Tablet portrait */
--bp-lg: 1024px;   /* Tablet landscape / desktop small */
--bp-xl: 1280px;   /* Desktop */
--bp-2xl: 1536px;  /* Desktop large */
```

---

## 4. Componentes

### 4.1 Bottom Navigation (Mobile) — 4 items
Inspirado no Panze Studio + Athlevo:
- **Rankings** (trophy icon) — Padrão, abre primeiro
- **Simulator** (sliders icon) — "E se..."
- **Calendar** (calendar icon) — Eventos
- **More** (grid/dots icon) — Settings, about, share

Visual: fundo `--bg-secondary`, item ativo com ícone `--brand-500` + dot indicator abaixo, inativo `--text-tertiary`.

### 4.2 Ranking Row — item de lista
Inspirado no Nasir Uddin + Pro Surf:
```
[#1 🥇] [Avatar] [Nome do Surfista   ] [85,420 pts] [▲ +2] [🟢 Classificado]
         [      ] [País • Flag        ] [           ] [     ] [               ]
```
- Posição com cor (gold/silver/bronze para Top 3)
- Avatar circular 40px
- Nome bold, país em caption
- Pontos em `--font-score-sm` com `tabular-nums`
- Variação de posição (seta verde ▲ ou vermelha ▼)
- Badge de status (classificado/risco/eliminado)

### 4.3 Surfer Profile Card (Expandido)
Inspirado nos cards do Athlevo:
- Header com foto hero + nome grande
- Stats grid: Pontos | Posição | Melhor resultado | Pior resultado
- Seção "Cenários": barras de progresso mostrando probabilidade de classificação
- Mini chart sparkline mostrando evolução de pontos ao longo dos eventos

### 4.4 Scenario Simulator
Inspirado no Pro Surf "needs X.XX":
- Dropdown por evento para selecionar resultado hipotético
- Resultado ao vivo: recalcula ranking em tempo real
- Highlight visual: quem sobe ▲ e quem desce ▼
- Badge especial para Pipeline (1.5×) — com ícone de onda

### 4.5 Status Badges
```css
.badge-classified { background: rgba(16,185,129,0.15); color: #10B981; border: 1px solid rgba(16,185,129,0.3); }
.badge-risk       { background: rgba(245,158,11,0.15); color: #F59E0B; border: 1px solid rgba(245,158,11,0.3); }
.badge-eliminated { background: rgba(239,68,68,0.15);  color: #EF4444; border: 1px solid rgba(239,68,68,0.3); }
.badge-locked     { background: rgba(107,114,128,0.15); color: #6B7280; border: 1px solid rgba(107,114,128,0.3); }
.badge-live       { background: rgba(239,68,68,0.15);  color: #EF4444; animation: pulse 2s infinite; }
```

### 4.6 Pill Filters (Tab switcher)
Inspirado no Athlevo:
- Background: `--bg-tertiary`
- Item ativo: `--brand-500` com text white
- Item inativo: transparent com `--text-secondary`
- Radius: `--radius-full`
- Usos: CT / CS toggle, Masculino / Feminino, Evento dropdown

### 4.7 Ad Slots
Posições estratégicas sem quebrar a UX:
- **Banner top (mobile):** 320×50 abaixo do header, fundo `--bg-secondary`
- **In-feed (mobile):** Card nativo entre rankings, mesma aparência de um ranking row mas com label "Ad" discreta
- **Sidebar (desktop):** 300×250 na coluna lateral direita
- **Interstitial:** Entre mudanças de tab (com frequency cap)

---

## 5. Layout Patterns

### 5.1 Mobile (< 768px)
```
┌──────────────────────────┐
│ Header: Logo + Tour + ⚙️  │
│ [Ad Banner 320×50]       │
│ [Pill Filters: CT | CS]  │
│ [Pill: Masc | Fem]       │
├──────────────────────────┤
│ 🏆 Podium Top 3          │
│ ┌──┐ ┌────┐ ┌──┐        │
│ │#2│ │ #1 │ │#3│        │
│ └──┘ └────┘ └──┘        │
├──────────────────────────┤
│ #4  Gabriel Medina  pts  │
│ #5  Filipe Toledo   pts  │
│ [Ad Nativo In-Feed]     │
│ #6  Ethan Ewing     pts  │
│ #7  ...                  │
├──────────────────────────┤
│ 🏆  📊  📅  ⋯            │
│ Bottom Navigation        │
└──────────────────────────┘
```

### 5.2 Desktop (≥ 1024px)
```
┌─────────────────────────────────────────────────┐
│ Header: Logo │ Rankings │ Simulator │ Calendar   │
├───────────────────────────────────┬──────────────┤
│                                   │ Sidebar      │
│ [Pill Filters]                    │ [Ad 300×250] │
│                                   │              │
│ Ranking Table (full)              │ Quick Stats  │
│ # │ Surfer │ Pts │ Δ │ Status    │ • Leader     │
│ 1 │ JJF    │ 85k │ - │ 🟢       │ • Cutoff     │
│ 2 │ Medina │ 78k │ ▲ │ 🟢       │ • Eliminated │
│ ...                               │              │
│                                   │ Cenário Rápido│
│                                   │ [Dropdown]   │
│                                   │ [Resultado]  │
└───────────────────────────────────┴──────────────┘
```

---

## 6. Iconografia

**Estilo:** Outline, 1.5px stroke, rounded caps — consistente com Surfisticate/Athlevo

| Ícone | Uso |
|-------|-----|
| 🏆 Trophy | Rankings tab, campeão |
| 📊 Chart bars | Simulator tab |
| 📅 Calendar | Events tab |
| 🌊 Wave | Pipeline/evento especial, logo |
| ⚡ Lightning | Live/ao vivo |
| 🔥 Fire | Hot scenario, tendência |
| ▲▼ Arrows | Variação de posição |
| 🎯 Target | "Needs X pts" / objetivo |

---

## 7. Motion & Transitions

```css
--transition-fast: 150ms ease-out;    /* Hover, focus */
--transition-base: 250ms ease-in-out; /* Tab switch, expand */
--transition-slow: 400ms ease-in-out; /* Page transitions, modais */

/* Animações especiais */
@keyframes pulse-live {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes rank-change {
  0% { transform: translateY(10px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes score-count {
  /* Contagem de pontos animada quando simulador recalcula */
  from { opacity: 0.5; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

---

## 8. Acessibilidade

- Contrast ratio mínimo 4.5:1 para texto normal, 3:1 para texto grande
- `--text-primary` (#F8FAFC) sobre `--bg-primary` (#0B1120) = ratio 15.8:1 ✅
- `--brand-500` (#0EA5E9) sobre `--bg-primary` (#0B1120) = ratio 7.2:1 ✅
- `--status-classified` (#10B981) sobre `--bg-secondary` (#111827) = ratio 5.1:1 ✅
- `--status-eliminated` (#EF4444) sobre `--bg-secondary` (#111827) = ratio 4.6:1 ✅
- Focus visible com outline `--brand-400` 2px offset
- Todas as cores semânticas têm ícone/texto redundante (não apenas cor)
- Touch targets mínimo 44×44px em mobile

---

## Fontes das Inspirações

- [Nasir Uddin — Leaderboard Dashboard](https://dribbble.com/shots/22050680-Leaderboard-Dashboard)
- [Panze Studio — Live Football & Scoring Mobile App](https://dribbble.com/shots/24018276-Live-Football-and-Scoring-Mobile-App)
- [RonDesignLab — Surfee Mobile UI](https://dribbble.com/shots/21756204-Surfee-Mobile-UI-Surf-Forecast-App)
- [Gergö Bartha — Surfisticate Surfing School Web App](https://www.behance.net/gallery/155407223/Surfisticate-Surfing-School-Web-App)
- [Márcia Galrao — Pro Surf // APP (Moche)](https://www.behance.net/gallery/13423287/Pro-Surf-APP)
- [Nataraj M — Athlevo Athletic App](https://www.behance.net/gallery/215604685/Athlevo-Athletic-App-UXUI-Case-study)
