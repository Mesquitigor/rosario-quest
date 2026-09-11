# Rosário Quest

Jogo católico, simples e sem login, para aprender a **ordem dos mistérios do Santo Rosário**. Feito para jovens: pontos, sequência diária, conquistas e um visual de vitral noturno.

O progresso fica só no navegador (`localStorage`). Pode mandar o link da Vercel para a catequese, o grupo de jovens ou a família.

## Como jogar

- **Desafio de hoje** — a dezena do dia da Igreja (gozosos, luminosos, dolorosos ou gloriosos), com XP extra.
- **Ordenar a dezena** — coloque os 5 mistérios de um conjunto na ordem certa.
- **Linha do tempo** — cinco cenas misturadas da vida de Cristo, da infância à glória.
- **Quiz relâmpago** — conjunto, “o que vem depois” e o primeiro mistério.

Toque numa carta e depois no espaço da conta (1 a 5), ou arraste. Há dica, embaralhar e uma tela para estudar os mistérios com versículo e fruto.

## Rodar localmente

```bash
npm install
npm run dev
```

## Publicar na Vercel

1. Suba este repositório para o GitHub.
2. Em [vercel.com](https://vercel.com), importe o projeto.
3. Framework preset: **Vite**. Build: `npm run build`. Pasta de saída: `dist`.
4. Deploy. Pronto — não precisa de banco nem de login.

Ou, com a CLI:

```bash
npx vercel
```

## Stack

Vite, Tailwind CSS v4 e JavaScript puro. Sem backend.
