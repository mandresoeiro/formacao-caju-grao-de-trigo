# Estratégia multiusuário — Formação CAJU - Grão de Trigo

## O que a versão atual faz

A V4 continua 100% estática e compatível com GitHub Pages.

Ela permite criar **perfis locais de alunos** no mesmo navegador. Cada perfil mantém separados:

- progresso de leitura;
- aulas concluídas;
- última seção estudada;
- anotações por seção;
- reflexão da aula;
- dúvidas;
- rascunho de sugestão.

Isso resolve bem dois cenários:

1. cada aluno usa o próprio celular/computador;
2. vários alunos compartilham o mesmo computador e selecionam um perfil local diferente.

## Limitação importante

`localStorage` pertence ao navegador e ao aparelho.

Por isso, o GitHub Pages sozinho **não consegue**:

- autenticar alunos;
- sincronizar uma anotação entre celular e computador;
- permitir ao professor ver o progresso da turma;
- receber sugestões em um painel administrativo;
- recuperar anotações depois de limpar os dados do navegador.

Para isso é necessário um serviço de dados/autenticação.

## Arquitetura recomendada quando a turma crescer

Manter o site no GitHub Pages e adicionar **Supabase** apenas para a parte multiusuário.

```text
GitHub Pages
HTML + CSS + JavaScript
        │
        ├── aulas públicas
        ├── PDFs e imagens
        │
        ▼
Supabase
├── Auth
├── PostgreSQL
├── Row Level Security
└── API
```

### Estrutura sugerida de dados

```text
profiles
- id
- user_id
- display_name
- role              aluno | formador | admin

lesson_progress
- id
- user_id
- lesson_number
- percent
- section_id
- completed
- updated_at

lesson_notes
- id
- user_id
- lesson_number
- section_id
- note_type         section | reflexao | duvida
- content
- updated_at

lesson_suggestions
- id
- user_id
- lesson_number
- content
- status            nova | em_analise | respondida | arquivada
- created_at

lessons
- id
- number
- slug
- title
- published
```

### Regras de privacidade recomendadas

- O aluno lê e altera somente as próprias anotações e progresso.
- O formador não deve ler anotações privadas por padrão.
- Sugestões enviadas à equipe são separadas das anotações privadas.
- Formadores/admins podem acessar somente o que a política da plataforma permitir.
- Use Row Level Security no banco para garantir as regras no servidor, não apenas na interface.

## Migração futura

A interface já separa os dados por perfil e por aula. Isso facilita substituir futuramente o `localStorage` por chamadas ao Supabase sem refazer o design da plataforma.

Sugestão de evolução:

1. **V4 atual:** perfis e caderno locais.
2. **V5:** login com Supabase Auth.
3. **V6:** sincronização de progresso/anotações.
4. **V7:** painel do formador e recebimento de sugestões.

