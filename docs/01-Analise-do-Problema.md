# WSL Ranking Scenarios Calculator — Análise do Problema

## 1. O Problema

Na WSL (World Surf League), fãs e analistas precisam calcular manualmente — geralmente em planilhas Excel — se um surfista ainda tem chances matemáticas de se classificar para o Championship Tour (CT), ganhar o título mundial, ou se já está matematicamente eliminado. **Não existe uma ferramenta web dedicada para isso.**

O cálculo é complexo porque envolve múltiplas variáveis interconectadas: resultados de vários surfistas se influenciam mutuamente (se A perde, pode ajudar B a classificar), existem descarte de piores resultados, e o último evento vale mais pontos que os demais.

---

## 2. Estrutura Competitiva da WSL (2026)

A WSL opera em 3 níveis hierárquicos:

### 2.1 Qualifying Series (QS) — Base da Pirâmide
- Eventos regionais com tiers: QS2000, QS4000, QS6000
- **Graduação:** 80 homens e 48 mulheres avançam para o Challenger Series

### 2.2 Challenger Series (CS) — Segundo Nível
- 7 eventos por temporada
- Vencedor recebe **10.000 pontos** por evento
- Contam os **melhores 5 de 7 resultados**
- **Classificação para o CT:** Top 10 homens e Top 7 mulheres

### 2.3 Championship Tour (CT) — Elite / Primeiro Nível
- **12 eventos** na temporada 2026
- Formato dividido em 3 fases (detalhado abaixo)
- Título mundial decidido pelo ranking acumulado da temporada

---

## 3. Formato do CT 2026 — Mudanças Importantes

O formato de 2026 tem mudanças significativas em relação a anos anteriores:

### 3.1 Temporada Regular (Eventos 1–9)
- **Field:** 36 homens / 24 mulheres (+ 2 wildcards masculinos e 2 femininos por evento)
- **Formato:** Apenas heats eliminatórios (sem rounds não-eliminatórios)
- Cada heat impacta diretamente o ranking

### 3.2 Pós-Temporada (Eventos 10–11: Abu Dhabi e Portugal)
- **Corte:** Apenas os **Top 24 homens** e **Top 16 mulheres** avançam
- Qualificação baseada nos **melhores 7 de 9 resultados** da temporada regular
- 22 classificados + 2 wildcards (homens) / 14 classificadas + 2 wildcards (mulheres)

### 3.3 Pipe Masters — Grande Final (Evento 12)
- O evento vale **15.000 pontos** para o vencedor (1.5× um evento normal de 10.000)
- Todos os pontos de outras colocações também multiplicados por 1.5×
- Top 8 homens e Top 8 mulheres recebem seeding avançado
- **Título mundial decidido aqui**

### 3.4 Contagem Final de Resultados
- Rankings finais e títulos mundiais: **melhores 9 de 12 resultados**
- Isso significa que cada surfista pode descartar 3 piores resultados

---

## 4. Tabela de Pontos por Colocação

### CT — Evento Padrão (10.000 pts para 1º)

| Colocação | Pontos |
|-----------|--------|
| 1º | 10.000 |
| 2º | 7.800 |
| Equal 3º | 6.085 |
| Equal 5º | 4.745 |
| Equal 9º | 3.320 |
| Equal 13º | ~2.590* |
| Equal 17º | ~2.020* |
| Equal 25º | ~1.575* |
| Equal 33º | ~1.330* |

### CT — Pipe Masters (15.000 pts para 1º — multiplicador 1.5×)

| Colocação | Pontos |
|-----------|--------|
| 1º | 15.000 |
| 2º | 11.700 |
| Equal 3º | 9.128 |
| Equal 5º | 7.118 |
| Equal 9º | 4.980 |
| (demais × 1.5) | ... |

### Challenger Series (10.000 pts para 1º)
Mesma estrutura de pontos que o CT padrão.

> **Nota:** Os valores marcados com * são estimativas baseadas na progressão geométrica observada (fator ~0.78 entre tiers). Os valores exatos estão no WSL Rule Book oficial. O app final deve usar os valores oficiais do Rule Book.

---

## 5. As Perguntas que o App Precisa Responder

### 5.1 Cenário: Título Mundial (CT)
> "O surfista X ainda pode ganhar o título mundial?"

**Variáveis envolvidas:**
- Pontuação atual de todos os surfistas
- Eventos restantes na temporada
- Máximo de pontos possíveis para X nos eventos restantes
- Mínimo de pontos possíveis para o líder/concorrentes
- Regra de descarte (melhores 9 de 12)

**Lógica de eliminação matemática:**
```
pontos_maximos_possiveis(X) = pontos_atuais(X)
  - piores_resultados_descartaveis(X)
  + maximo_pontos_eventos_restantes

Se pontos_maximos_possiveis(X) < pontos_minimos_garantidos(Líder):
  → X está MATEMATICAMENTE ELIMINADO do título
```

### 5.2 Cenário: Classificação para Pós-Temporada
> "O surfista X vai conseguir entrar no Top 24 (homens) ou Top 16 (mulheres)?"

**Variáveis:**
- Ranking atual após N eventos
- Eventos restantes até o corte (evento 9)
- Resultados possíveis de todos os surfistas
- Regra: melhores 7 de 9 resultados

### 5.3 Cenário: Classificação para o CT via Challenger Series
> "O surfista X vai conseguir entrar no Top 10 (homens) ou Top 7 (mulheres) do CS?"

**Variáveis:**
- Ranking atual do CS
- Eventos restantes
- Melhores 5 de 7 resultados

### 5.4 Cenário: Requalificação para o CT do ano seguinte
> "O surfista X vai manter a vaga no CT para 2027?"

**Variáveis:**
- Ranking final do CT (Top 22 homens requalificam automaticamente)
- Ou ranking do CS (Top 10 homens / Top 7 mulheres)

### 5.5 Cenários Cruzados / Dependências (O Mais Complexo)
> "Se o surfista A perder na semifinal, isso ajuda o surfista B a classificar?"

**Variáveis:**
- Resultado hipotético de A em um evento
- Impacto no ranking de A
- Como isso muda a posição relativa de B
- Cascata de efeitos em outros surfistas

---

## 6. Lógica Matemática Central

### 6.1 Cálculo de Pontuação com Descarte

```
ranking_score(surfista) = soma(melhores N resultados de M eventos)

Onde:
- CT: N=9, M=12 (para título)
- CT Corte: N=7, M=9 (para pós-temporada)
- CS: N=5, M=7 (para qualificação CT)
```

### 6.2 Melhor Cenário Possível (Best Case)

```
melhor_cenario(X) = soma(
  melhores N resultados de [resultados_atuais + (vitória em cada evento restante)]
)
```

### 6.3 Pior Cenário Possível (Worst Case)

```
pior_cenario(X) = soma(
  melhores N resultados de [resultados_atuais + (eliminação_na_1a_rodada em cada evento restante)]
)
```

### 6.4 Eliminação Matemática

```
surfista_eliminado(X, posicao_alvo) =
  melhor_cenario(X) < pior_cenario(surfista_na_posicao_alvo)
```

### 6.5 Cenários "Se-Então" (Simulação)

```
Para cada combinação de resultados possíveis nos eventos restantes:
  1. Calcular ranking final de todos os surfistas
  2. Verificar quem classifica
  3. Agregar: "Em X% dos cenários, surfista Y classifica"
```

---

## 7. Complexidade e Desafios

### 7.1 Explosão Combinatória
Com 36 surfistas e múltiplas colocações possíveis por evento, o número de cenários possíveis é astronômico. O app precisa usar heurísticas inteligentes, não força bruta.

### 7.2 Dados em Tempo Real
- Resultados precisam ser atualizados conforme os eventos acontecem
- Ideal: integrar com a API da WSL ou fazer scraping dos rankings oficiais

### 7.3 Múltiplos Tours Simultâneos
- CT, CS e QS funcionam em paralelo
- Alguns surfistas competem em mais de um

### 7.4 Wildcards
- Wildcards de evento e de temporada complicam as previsões
- Seus resultados contam para o ranking mas a vaga não é "fixa"

---

## 8. O que Existe Hoje

| Ferramenta | Limitações |
|------------|-----------|
| Planilhas Excel caseiras | Manuais, sem atualização automática, difíceis de compartilhar |
| WSL Fantasy Surfing | Foco em fantasy game, não em análise de cenários |
| WSL Stats (site oficial) | Mostra probabilidades de título mas não é interativo |
| Casas de apostas | Focam em odds, não em cenários matemáticos detalhados |

**Gap no mercado:** Nenhuma ferramenta permite que o fã simule cenários interativamente ("e se X vencer e Y perder, quem classifica?").

---

## 9. Proposta Inicial do App

### Funcionalidades Core:
1. **Dashboard de Rankings** — Ranking atual de CT e CS com pontos
2. **Calculadora de Eliminação** — Quem já está matematicamente eliminado?
3. **Simulador de Cenários** — "E se..." com inputs do usuário
4. **Predictions** — Probabilidades de classificação/título baseadas em simulações
5. **Cenários Cruzados** — "Se A perder, B classifica?" com visualização clara

### Tours Suportados:
- Championship Tour (CT)
- Challenger Series (CS)
- Qualifying Series (QS) — fase futura

### Dados Necessários:
- Lista de surfistas por tour
- Resultados de cada evento (colocação + pontos)
- Calendário de eventos restantes
- Tabela oficial de pontos por colocação

---

## 10. Próximos Passos

1. **Validar a tabela de pontos** — Obter valores oficiais completos do WSL Rule Book
2. **Definir escopo MVP** — Começar pelo CT 2026 ou CS 2025?
3. **Escolher stack técnica** — React + API? App mobile? PWA?
4. **Fonte de dados** — API WSL, scraping, ou entrada manual?
5. **Design da interface** — Como tornar os cenários visualmente claros?

---

## Fontes da Pesquisa

- [WSL 2026 CT Schedule and Formats](https://www.worldsurfleague.com/posts/546281/2026-championship-tour-schedule-and-formats)
- [WSL Introduces Updated Points Scale for QS](https://www.worldsurfleague.com/posts/539539/wsl-introduces-updated-points-scale-for-regional-qualifying-series)
- [2025 World Surf League — Wikipedia](https://en.wikipedia.org/wiki/2025_World_Surf_League)
- [WSL CT Format Changes — BoardCovers](https://boardcovers.com.au/blog/wsl-2026-championship-tour-schedule-format-changes-pipeline-finale-returns/)
- [11 CT Qualification Scenarios — The Inertia](https://www.theinertia.com/surf/wsl-lexus-pipe-challenger-championship-tour-qualification/)
- [WSL Stats: Title Probabilities](https://www.worldsurfleague.com/posts/365503/wsl-stats-world-title-probabilities)
- [WSL Rules and Regulations](https://www.worldsurfleague.com/pages/rules-and-regulations)
- [Red Bull — Guide to WSL](https://www.redbull.com/int-en/users-guide-to-the-world-surf-league)
- [WSL Rule Book 2025 (PDF)](https://www.worldsurfleague.com/asset/41088/2025_WSL_Rule_Book_clean_06012025.pdf)
