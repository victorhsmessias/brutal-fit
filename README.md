# Brutal-Fit

Aplicação SPA (Single Page Application) desenvolvida como Projeto 1 da disciplina

Permite buscar exercícios físicos a partir da API pública da **wger**, com filtros
por categoria, grupo muscular e equipamento. Clicar em um card abre um modal
(via `createPortal`) com os detalhes completos do exercício.

Os textos são exibidos em **português quando disponíveis**, com fallback para inglês. A busca por nome aceita termos em qualquer
idioma — buscar "squat" ou "agachamento" retorna os mesmos exercícios que tenham
qualquer tradução correspondente.

## Stack

- **React 19** + **Vite** (estrutura e bundler)
- **Context API** + `useReducer` (comunicação entre componentes e gerenciamento de estado)
- **react-hook-form** (biblioteca externa para formulário e validação)
- **DOMPurify** (sanitização do HTML retornado pela API)
- **Fetch API** (AJAX) para consumo da API JSON

## API utilizada

[wger REST API](https://wger.de/api/v2/) — base de dados aberta de exercícios físicos.

## Escolhas da equipe (conforme proposta)

| Item | Escolha |
|---|---|
| API JSON | wger |
| Hook/funcionalidade React | `useReducer` (principal), complementado por `createPortal` no modal de detalhes e `useMemo` para cruzar IDs de categorias/músculos/equipamentos |
| Biblioteca externa | `react-hook-form` |

## Estrutura (conforme exigido pela proposta)

```
src/
├── components/
│   ├── Header.jsx          # cabeçalho + contador de resultados
│   ├── SearchForm.jsx      # form principal + FormProvider do react-hook-form
│   ├── Filters.jsx         # selects de categoria, músculo e equipamento
│   ├── ExerciseList.jsx    # lista os resultados
│   ├── ExerciseCard.jsx    # card clicável de cada exercício
│   └── ExerciseModal.jsx   # modal de detalhes (via createPortal)
└── contexts/
    ├── WorkoutContext.js   # contexto (puro)
    └── WorkoutProvider.jsx # provider + reducer + fetch dos filtros
```

## Como rodar

```bash
npm install
npm run dev         # desenvolvimento
npm run build       # pacote de produção
npm run preview     # preview do build
npm run lint        # verificação de lint
```

## Deploy

URL de produção: `https://luiispaulo.github.io/Brutal-Fit/`
