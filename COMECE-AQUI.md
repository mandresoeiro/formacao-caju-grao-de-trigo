# Formação CAJU - Grão de Trigo V5.1 — Comece aqui

Esta versão já está preparada para:

- GitHub Pages;
- várias aulas;
- uma conta diferente para cada aluno;
- progresso sincronizado entre aparelhos;
- anotações privadas;
- sugestões enviadas conscientemente pelo aluno;
- uma única playlist católica do Spotify;
- PDF original + aula acessível em HTML + imagens otimizadas.

## O que ainda depende de você

Há somente duas informações que eu não posso inventar:

1. os dados do **seu projeto Supabase**;
2. o link exato da **sua playlist católica do Spotify**.

Você vai colar essas informações em:

`js/config.js`

O arquivo já está pronto e explica onde colar.

## Ordem recomendada

1. Leia `SUPABASE-PASSO-A-PASSO.md`.
2. Crie o projeto gratuito no Supabase.
3. Rode `supabase/schema.sql` no SQL Editor.
4. Copie a URL e a Publishable Key para `js/config.js`.
5. Leia `SPOTIFY-PASSO-A-PASSO.md`.
6. Cole o link da sua playlist em `js/config.js`.
7. Teste localmente com `python -m http.server 8000`.
8. Publique no GitHub Pages.

Você não precisa entender banco de dados para fazer esses passos.
