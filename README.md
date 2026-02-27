# Cutline

**Where do you stand?** | **Qual é seu cenário?**

🌊 App de cenários de classificação/eliminação da WSL (World Surf League).

🔗 [cutline.surf](http://cutline.surf)

---

## O que é o Cutline?

Cutline é um web app que calcula cenários de classificação e eliminação matemática no Championship Tour da WSL. Hoje, fãs usam planilhas Excel complexas para responder "meu surfista ainda pode se classificar?". O Cutline automatiza isso com uma interface intuitiva, rankings ao vivo e simulações interativas.

## Estrutura do Projeto

```
cutline/
├── README.md                              ← Você está aqui
├── docs/
│   ├── 01-Analise-do-Problema.md          ← Pesquisa e análise do problema
│   ├── 02-Requisitos-do-App.md            ← Requisitos funcionais e técnicos
│   └── 03-Pesquisa-de-Naming.md           ← Pesquisa de mercado e naming
├── design/
│   ├── 04-Design-System.md                ← Design tokens, componentes, padrões
│   └── 05-Identidade-Visual.docx          ← Documento profissional da identidade visual
└── prototype/
    └── 06-Prototipo-Interativo.html       ← Protótipo funcional (abrir no navegador)
```

## Stack Planejada

- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Backend**: Supabase (auth + DB + realtime)
- **Deploy**: Vercel
- **Domínio**: cutline.surf

## Features Principais

- 📊 **Rankings ao vivo** com status de classificação
- 🧮 **Simulador de cenários** ("E se Filipe ganha em Pipeline?")
- 🏆 **Pódio Top 3** visual
- 📅 **Calendário de eventos** com status
- 📱 **Multi-device** (mobile-first + desktop)
- 💰 **Ad slots** integrados sem quebrar UX

## Público-Alvo

- Fãs hardcore da WSL (Brasil, Austrália, EUA, Havaí)
- Jornalistas e comentaristas de surf
- Apostadores esportivos
- Surfistas profissionais e suas equipes

---

*Cutline — Saiba onde você está no ranking.*
