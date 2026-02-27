# WSL Scenario Calculator — Documento de Requisitos

> **Nome provisório:** WSL Scenario Calculator (ou "SurfMath", "WaveCalc" — a definir)
> **Versão:** 0.1 — MVP
> **Data:** 2026-02-28
> **Referência:** [WSL-Analise-do-Problema.md](./WSL-Analise-do-Problema.md)

---

## 1. Visão do Produto

Uma aplicação web que permite fãs, jornalistas e analistas de surf simularem cenários de classificação da WSL de forma interativa — substituindo as planilhas Excel manuais que são usadas hoje. O usuário deve conseguir responder em segundos perguntas como "o surfista X ainda tem chance de título?" ou "se A perder, B classifica?".

---

## 2. Público-Alvo

| Persona | Descrição | Necessidade Principal |
|---------|-----------|----------------------|
| **Fã hardcore** | Acompanha todo evento ao vivo | Saber em tempo real quem ainda tem chance |
| **Jornalista/Comentarista** | Cobre WSL profissionalmente | Dados rápidos para matérias e transmissões |
| **Surfista competidor** | Compete no CS ou QS | Saber o que precisa fazer para classificar |
| **Apostador** | Usa dados para informar apostas | Probabilidades e cenários detalhados |
| **Fã casual** | Assiste alguns eventos por ano | Entender a situação de forma simples e visual |

---

## 3. Escopo do MVP

### 3.1 O que ENTRA no MVP

- **Championship Tour (CT) 2026** — Foco principal
- **Challenger Series (CS) 2025-26** — Segundo foco
- Rankings masculino e feminino
- Simulador de cenários básico
- Calculadora de eliminação matemática

### 3.2 O que NÃO entra no MVP

- Qualifying Series (QS) — complexidade menor, público menor
- Longboard Tour / Big Wave Tour
- Dados históricos de temporadas anteriores
- App mobile nativo (PWA é suficiente)
- Sistema de usuários/contas
- Notificações push
- Integração com apostas

---

## 4. Requisitos Funcionais

### RF-01: Dashboard de Rankings

**Descrição:** Exibir o ranking atualizado do CT e CS com pontuação detalhada.

**Critérios de Aceite:**
- Exibir tabela de ranking com posição, nome, país, pontuação total
- Mostrar pontuação de cada evento individual em colunas
- Indicar visualmente quais resultados estão sendo descartados (regra best-of)
- Destacar zona de classificação (verde), zona de risco (amarelo), zona de eliminação (vermelho)
- Filtrar por masculino / feminino
- Filtrar por CT / CS
- Ordenar por ranking, nome ou país

**Dados exibidos por surfista:**
- Posição no ranking
- Nome e país (bandeira)
- Pontuação total (com descartes aplicados)
- Resultado em cada evento (pontos + colocação)
- Indicador de descarte nos piores resultados
- Status: classificado / em risco / eliminado matematicamente
- Máximo de pontos possíveis (melhor cenário)

---

### RF-02: Calculadora de Eliminação Matemática

**Descrição:** Calcular automaticamente quais surfistas estão matematicamente eliminados de cada objetivo.

**Objetivos calculáveis:**
- Título mundial (CT)
- Classificação para pós-temporada (Top 24 H / Top 16 M)
- Classificação para o CT via CS (Top 10 H / Top 7 M)
- Requalificação para CT do ano seguinte

**Critérios de Aceite:**
- Para cada surfista, exibir se está: ✅ Classificado | ⚠️ Em disputa | ❌ Eliminado
- Exibir o cálculo: "Máximo possível: X pts | Precisa superar: Y pts"
- Atualizar automaticamente conforme novos resultados são inseridos
- Mostrar quantos eventos restam
- Considerar corretamente o multiplicador 1.5× do Pipe Masters

**Regras de cálculo:**
```
CT Título:        best 9 of 12, último evento = 1.5×
CT Pós-temporada: best 7 of 9 (apenas temporada regular)
CS Qualificação:  best 5 of 7
```

---

### RF-03: Simulador de Cenários ("E se...")

**Descrição:** Permitir ao usuário simular resultados hipotéticos em eventos futuros e ver o impacto no ranking.

**Critérios de Aceite:**
- Selecionar um evento futuro do calendário
- Para cada surfista, escolher um resultado hipotético (1º, 2º, 3º, 5º, 9º, etc.)
- Recalcular o ranking completo com os resultados simulados
- Comparar visualmente o ranking atual vs. ranking simulado
- Permitir simular múltiplos eventos de uma vez (restante da temporada)
- Botão "resetar" para voltar ao cenário real
- Modo rápido: "Simular X vencendo todos os eventos restantes"

**Interface sugerida:**
- Dropdown por surfista com as colocações possíveis
- Ou arrastar surfistas para posições em um bracket visual
- Ranking atualiza em tempo real conforme o usuário faz alterações

---

### RF-04: Cenários Cruzados / Dependências

**Descrição:** Mostrar como o resultado de um surfista impacta as chances de outro.

**Critérios de Aceite:**
- Selecionar um surfista A e definir um resultado hipotético
- Ver automaticamente quais surfistas são impactados positiva ou negativamente
- Exemplo de output: "Se John Florence terminar em 5º em Portugal → Griffin Colapinto sobe para 2º no ranking e está classificado para a pós-temporada"
- Visualizar cadeia de impactos (A afeta B, que afeta C)
- Destacar cenários de "briga direta" (dois surfistas onde o resultado de um define o do outro)

---

### RF-05: Cenários Pré-Calculados / Quick Insights

**Descrição:** Oferecer cenários comuns já calculados, sem o usuário precisar simular manualmente.

**Cenários automáticos:**
- "O que [surfista] precisa para ser campeão mundial?"
- "O que [surfista] precisa para se classificar para a pós-temporada?"
- "Quem já está matematicamente classificado?"
- "Quem já está matematicamente eliminado?"
- "Quais são as brigas diretas mais importantes no próximo evento?"
- "Quantos cenários existem onde [surfista] é campeão?" (% de probabilidade)

**Critérios de Aceite:**
- Acessível com um clique no perfil de cada surfista
- Linguagem clara e direta ("precisa pelo menos um 3º lugar nos próximos 2 eventos")
- Atualizar automaticamente após cada evento

---

### RF-06: Gestão de Dados e Resultados

**Descrição:** Inserir e manter os dados de surfistas, eventos e resultados.

**MVP — Entrada Manual:**
- Interface admin para inserir/editar resultados de eventos
- Upload de resultados via CSV/JSON
- Tabela de pontos configurável por tour/temporada

**Futuro — Automação:**
- Scraping ou API da WSL para resultados em tempo real
- Atualização automática durante eventos ao vivo

**Dados a gerenciar:**

| Entidade | Campos |
|----------|--------|
| Surfista | id, nome, país, gênero, foto_url, tour_atual |
| Tour | id, nome, tipo (CT/CS/QS), temporada, gênero |
| Evento | id, nome, local, data, tour_id, status (futuro/em_andamento/finalizado), multiplicador_pontos |
| Resultado | surfista_id, evento_id, colocação, pontos |
| Tabela de Pontos | tour_tipo, colocação, pontos |
| Regra de Descarte | tour_tipo, temporada, best_of, total_eventos |

---

### RF-07: Página do Surfista

**Descrição:** Perfil individual com todas as informações e cenários de um surfista.

**Critérios de Aceite:**
- Foto, nome, país, ranking atual
- Histórico de resultados na temporada (tabela + gráfico de evolução)
- Status de classificação para cada objetivo
- Cenários rápidos: "o que precisa para..."
- Melhor e pior cenário possíveis
- Pontos descartados vs. contabilizados

---

### RF-08: Calendário de Eventos

**Descrição:** Exibir calendário da temporada com status de cada evento.

**Critérios de Aceite:**
- Lista cronológica de eventos com nome, local, data, status
- Indicar próximo evento em destaque
- Clicar no evento mostra: resultados (se finalizado) ou permite simular (se futuro)
- Badge indicando se é evento regular ou Pipe Masters (1.5×)

---

## 5. Requisitos Não-Funcionais

### RNF-01: Performance
- Dashboard deve carregar em < 2 segundos
- Simulação de cenário deve recalcular em < 500ms
- Suportar até 10.000 usuários simultâneos

### RNF-02: Responsividade
- Funcionar em desktop, tablet e mobile
- Layout mobile-first (maioria dos fãs acompanha pelo celular)
- PWA instalável para acesso offline dos últimos dados

### RNF-03: Acessibilidade
- Contraste adequado (WCAG AA)
- Navegável por teclado
- Labels em inputs e tabelas acessíveis
- Indicações de status não dependem apenas de cor (ícones + texto)

### RNF-04: Internacionalização
- MVP em Português (BR) e Inglês
- Estrutura preparada para outros idiomas (surf é global)
- Bandeiras e nomes de países padronizados

### RNF-05: SEO e Compartilhamento
- URLs amigáveis (/ranking/ct/2026, /surfista/john-florence)
- Meta tags para compartilhamento social (Open Graph)
- Cenários simulados compartilháveis via link

### RNF-06: Disponibilidade
- 99.5% uptime (especialmente durante janelas de competição)
- Degradação graciosa se dados não estiverem disponíveis

---

## 6. Arquitetura Técnica Sugerida

### 6.1 Stack Recomendada

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| **Frontend** | Next.js (React) + TypeScript | SSR para SEO, boa DX, ecossistema rico |
| **Estilização** | Tailwind CSS | Prototipagem rápida, responsivo |
| **Estado** | Zustand ou Jotai | Leve, bom para cálculos derivados |
| **Backend/API** | Next.js API Routes ou tRPC | Full-stack no mesmo repo, type-safe |
| **Banco de Dados** | Supabase (PostgreSQL) | Free tier generoso, real-time, auth pronto |
| **Hosting** | Vercel | Deploy automático, edge functions, free tier |
| **Motor de Cálculo** | TypeScript puro (client-side) | Cálculos rápidos no browser, sem latência de API |

### 6.2 Alternativa Simplificada (MVP ultra-rápido)

| Camada | Tecnologia |
|--------|-----------|
| **Tudo-em-um** | Single Page App com React/Vite |
| **Dados** | JSON estático + localStorage |
| **Hosting** | Vercel / Netlify / GitHub Pages |
| **Cálculos** | Client-side JavaScript |

Nessa alternativa, os dados são atualizados manualmente via JSON e o app é puramente frontend. Mais rápido de construir, mas requer atualização manual de resultados.

### 6.3 Estrutura do Motor de Cálculo

```
src/
  engine/
    types.ts          → Interfaces: Surfista, Evento, Resultado, Tour
    points-table.ts   → Tabela de pontos por colocação
    ranking.ts        → Calcular ranking com descarte
    elimination.ts    → Verificar eliminação matemática
    simulator.ts      → Simular cenários hipotéticos
    scenarios.ts      → Cenários pré-calculados e cruzados
    probability.ts    → Cálculo de probabilidades (Monte Carlo simplificado)
```

---

## 7. Modelo de Dados

### 7.1 Diagrama ER Simplificado

```
[Tour] 1───N [Evento] 1───N [Resultado] N───1 [Surfista]
  │                                              │
  └── tipo (CT/CS)                               └── país, gênero
  └── best_of / total_eventos                    └── tour_atual

[TabelaPontos]
  └── tour_tipo
  └── colocação → pontos

[RegraDescarte]
  └── tour_tipo
  └── temporada
  └── best_of / total
```

### 7.2 Exemplos de Dados

**Surfista:**
```json
{
  "id": "john-florence",
  "nome": "John John Florence",
  "pais": "US",
  "genero": "M",
  "foto": "/athletes/john-florence.jpg"
}
```

**Resultado:**
```json
{
  "surfista_id": "john-florence",
  "evento_id": "ct-2026-01-gold-coast",
  "colocacao": 1,
  "pontos": 10000
}
```

**Cenário Simulado (client-side):**
```json
{
  "evento_id": "ct-2026-10-portugal",
  "resultados_simulados": [
    { "surfista_id": "john-florence", "colocacao": 1 },
    { "surfista_id": "griffin-colapinto", "colocacao": 3 },
    { "surfista_id": "italo-ferreira", "colocacao": 9 }
  ]
}
```

---

## 8. Interface — Wireframes Conceituais

### 8.1 Tela Principal: Dashboard de Rankings

```
┌─────────────────────────────────────────────────┐
│  🏄 WSL Scenario Calculator          [CT] [CS]  │
│  ─────────────────────────────────────────────── │
│  [Masculino ▼]  [2026 ▼]  Próximo: Portugal 🇵🇹 │
│  ─────────────────────────────────────────────── │
│  #  Surfista        Total   E1   E2   E3 ... E9 │
│  ── ─────────────── ─────  ──── ──── ────     ── │
│  1  🇺🇸 J.Florence   52340  10K  7.8K (3.3K)    │
│  2  🇧🇷 Italo F.     48200  6.0K 10K  7.8K      │
│  3  🇦🇺 E.Ewing      45100  4.7K 6.0K 10K       │
│  ...                                             │
│  ─── Zona de Corte (Top 24) ──────────────────── │
│  24 🇿🇦 M.February   21400  ⚠️ Em risco          │
│  25 🇫🇷 J.Duru       20800  ❌ Eliminado         │
│  ─────────────────────────────────────────────── │
│  (3.3K) = resultado descartado                   │
└─────────────────────────────────────────────────┘
```

### 8.2 Tela: Simulador de Cenários

```
┌─────────────────────────────────────────────────┐
│  📊 Simulador — Portugal Pro (Evento 10)         │
│  ─────────────────────────────────────────────── │
│  Defina resultados hipotéticos:                  │
│                                                  │
│  🇺🇸 J.Florence    [1º lugar ▼]  → +10.000 pts  │
│  🇧🇷 Italo F.      [Equal 5º ▼] → +4.745 pts   │
│  🇦🇺 E.Ewing       [Equal 3º ▼] → +6.085 pts   │
│  ...                                             │
│  ─────────────────────────────────────────────── │
│  [Simular]  [Resetar]  [Compartilhar link]       │
│  ─────────────────────────────────────────────── │
│  RESULTADO DA SIMULAÇÃO:                         │
│  #  Surfista     Antes  →  Depois    Δ           │
│  1  J.Florence   52340  →  55255   (+2915) ↑0    │
│  2  E.Ewing      45100  →  51185   (+6085) ↑1    │
│  3  Italo F.     48200  →  49620   (+1420) ↓1    │
└─────────────────────────────────────────────────┘
```

### 8.3 Tela: Perfil do Surfista

```
┌─────────────────────────────────────────────────┐
│  🇧🇷 Italo Ferreira                              │
│  #2 no ranking CT 2026 — 48.200 pts              │
│  ─────────────────────────────────────────────── │
│  📈 [Gráfico de evolução do ranking]             │
│  ─────────────────────────────────────────────── │
│  RESULTADOS 2026:                                │
│  E1 Gold Coast:  3º (6.085)                      │
│  E2 Margaret R:  1º (10.000)                     │
│  E3 Bells:       2º (7.800)                      │
│  ...                                             │
│  ─────────────────────────────────────────────── │
│  🎯 CENÁRIOS:                                    │
│  Título Mundial:    ⚠️ Possível (37% de chance)  │
│  Pós-temporada:     ✅ Classificado               │
│  Precisa de:        pelo menos 2× Top 5 nos      │
│                     próximos 3 eventos para       │
│                     ultrapassar Florence          │
└─────────────────────────────────────────────────┘
```

---

## 9. Plano de Fases

### Fase 1 — MVP (4-6 semanas)
- Dashboard de ranking CT com dados manuais (JSON)
- Calculadora de eliminação matemática
- Simulador básico (um evento por vez)
- Página do surfista simples
- Deploy em Vercel

### Fase 2 — Enriquecimento (4-6 semanas)
- Challenger Series
- Simulação multi-evento
- Cenários cruzados
- Cenários pré-calculados ("o que precisa para...")
- Compartilhamento de cenários via URL

### Fase 3 — Automação (4-6 semanas)
- Scraping/API para resultados em tempo real
- PWA com modo offline
- Cálculo de probabilidades (Monte Carlo)
- i18n (Inglês + Português)

### Fase 4 — Expansão (futuro)
- QS regional
- Dados históricos e comparações entre temporadas
- Notificações ("Italo foi eliminado do título!")
- Longboard Tour / Big Wave Tour
- App mobile nativo (se demanda justificar)

---

## 10. Métricas de Sucesso

| Métrica | Alvo MVP |
|---------|----------|
| Tempo de carga do dashboard | < 2s |
| Tempo de recálculo de simulação | < 500ms |
| Precisão dos cálculos vs. WSL oficial | 100% |
| Usuários ativos durante evento | 500+ |
| Sessões por evento | 3+ por usuário |
| Cenários simulados por sessão | 5+ |
| Bounce rate | < 40% |

---

## 11. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Tabela de pontos incompleta/incorreta | Alta | Crítico | Validar com Rule Book oficial antes do launch |
| WSL muda regras mid-season | Média | Alto | Arquitetura flexível, regras configuráveis no DB |
| Sem API pública da WSL | Alta | Médio | MVP com dados manuais, scraping como fallback |
| Complexidade do cálculo de probabilidades | Média | Médio | Usar heurísticas simples no MVP, Monte Carlo depois |
| Poucos usuários iniciais | Alta | Médio | Lançar antes de evento grande, divulgar em comunidades de surf |
| Questões legais (dados da WSL) | Baixa | Alto | Usar apenas dados públicos, dar crédito à WSL |

---

## 12. Definições em Aberto (Precisa Decisão)

| # | Questão | Opções | Recomendação |
|---|---------|--------|-------------|
| 1 | Nome do app | SurfMath / WaveCalc / WSL Scenarios / outro | Definir com branding |
| 2 | Stack MVP | Next.js full-stack vs. SPA pura (Vite+React) | SPA pura para velocidade de dev |
| 3 | Fonte de dados MVP | JSON manual vs. Supabase | JSON manual (mais simples) |
| 4 | Tour prioritário | Começar pelo CT ou CS? | CT (mais visibilidade) |
| 5 | Idioma MVP | Português, Inglês ou ambos? | Inglês primeiro (público global) |
| 6 | Design | Usar componentes prontos ou custom? | shadcn/ui + Tailwind |
| 7 | Monetização futura | Ads / premium / sponsorship? | Definir depois do MVP |

---

## Referências

- [Documento de Análise do Problema](./WSL-Analise-do-Problema.md)
- [WSL Rules and Regulations](https://www.worldsurfleague.com/pages/rules-and-regulations)
- [WSL 2026 CT Format](https://www.worldsurfleague.com/posts/546281/2026-championship-tour-schedule-and-formats)
- [WSL Rule Book 2025](https://www.worldsurfleague.com/asset/41088/2025_WSL_Rule_Book_clean_06012025.pdf)
