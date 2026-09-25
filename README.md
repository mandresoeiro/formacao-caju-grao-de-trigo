# Formação CAJU - Grão de Trigo — site estático acessível

Site leve para publicar aulas no GitHub Pages usando apenas HTML, CSS e JavaScript puro.

## Arquitetura de leitura

A página de cada aula agora possui três camadas complementares:

1. **Conteúdo descritivo em HTML** — é a versão principal para estudo, busca, zoom, leitores de tela e celulares.
2. **Artes e infográficos** — permanecem como apoio visual, convertidos para WebP responsivo e acompanhados por descrição textual.
3. **Texto em HTML** — a aula fica disponível de forma direta, pesquisável e confortável em celular, tablet e desktop.

## Sidebar

A **página inicial e as páginas de aula** possuem navegação lateral.

Na home, a sidebar fixa reúne atalhos, todas as aulas, status e indicação das formações concluídas. No celular, ela vira um painel acessível pelo botão **Menu**.

Na página de cada aula, a sidebar fixa reúne:

- lista automática de todas as aulas;
- indicação da aula atual;
- sumário da aula atual;
- destaque automático da seção que está sendo lida;

No celular, a mesma sidebar vira um painel acessível aberto pelo botão **Menu da aula**.

## O que já está pronto

- Home redesenhada com **sidebar fixa no desktop** e **menu lateral no celular**.
- Hero editorial com imagem de destaque da Aula 04, resumo da biblioteca e atalhos de estudo.
- Busca destacada, cards aprimorados, indicadores de progresso e seção preparada para novas aulas.
- Aulas 01–03 cadastradas como **estrutura proposta / em preparação**.
- Aulas 04–08 com conteúdo descritivo em HTML baseado nos materiais fornecidos.
- Aula 04 com as artes da formação convertidas para WebP responsivo e distribuídas junto às seções correspondentes.
- Aula 06 com o infográfico comparativo convertido para WebP.
- PDFs originais das aulas 04–08 preservados no próprio projeto.
- Sidebar automática e escalável.
- Tema claro/escuro.
- Controle de tamanho de texto.
- Navegação por teclado e foco visível.
- Link “Pular para o conteúdo”.
- `prefers-reduced-motion` respeitado.
- Progresso visual de leitura.
- Marcação de aula concluída via `localStorage`.
- Imagens com `alt`, legenda, descrição textual e carregamento lazy.
- Visualizador de PDF carregado somente quando solicitado.
- Sem frameworks e sem dependências externas.

## Como abrir localmente

Basta abrir `index.html` no navegador.

Para testar de forma mais próxima ao GitHub Pages:

```bash
python -m http.server 8000
```

Depois abra `http://localhost:8000`.

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie todo o conteúdo desta pasta para a raiz do repositório.
3. Abra **Settings → Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Selecione `main` e `/root`.
6. Salve.

## Como adicionar a Aula 09, 10, 11...

O site não exige um novo HTML para cada aula. A sidebar, a home e o sumário são montados automaticamente a partir de `js/data.js`.

Exemplo:

```js
{
  numero: '09',
  slug: 'nome-da-aula',
  titulo: 'Título da Aula',
  subtitulo: 'Subtítulo',
  eixo: 'VIVER',
  status: 'publicada',
  statusLabel: 'Aula disponível',
  resumo: 'Resumo curto da aula.',
  tema: 'dark',
  capa: {
    src640: 'assets/fotos/aula-09/capa-640.webp',
    src1280: 'assets/fotos/aula-09/capa-1280.webp',
    alt: 'Descrição objetiva da capa.'
  },
  imagens: [],
  secoes: [
    {
      id: 'primeiro-tema',
      titulo: 'Primeiro tema',
      blocos: [
        { tipo: 'p', texto: 'Parágrafo da aula.' },
        {
          tipo: 'ul',
          itens: ['Primeiro ponto.', 'Segundo ponto.']
        },
        {
          tipo: 'callout',
          titulo: 'Para refletir',
          texto: 'Uma reflexão ou observação importante.'
        }
      ]
    }
  ]
}
```

Assim que essa entrada for adicionada, a Aula 09 aparece automaticamente:

- na página inicial;
- na sidebar de todas as aulas;
- em `aula.html?id=09`;
- com seu próprio sumário.

## Blocos de conteúdo disponíveis

O campo `blocos` aceita atualmente:

```js
{ tipo: 'p', texto: '...' }
```

```js
{ tipo: 'ul', itens: ['...', '...'] }
```

```js
{ tipo: 'ol', itens: ['...', '...'] }
```

```js
{ tipo: 'callout', titulo: 'Destaque', texto: '...' }
```

```js
{ tipo: 'quote', texto: '...', autor: '...' }
```

Isso permite escrever a aula semanticamente sem misturar o conteúdo com o HTML da interface.

## Relacionar uma imagem a uma seção

As imagens ficam no array `imagens`. Para colocá-las junto ao trecho correto da aula, use os índices no campo `midia`:

```js
{
  id: 'tema',
  titulo: 'Tema',
  blocos: [...],
  midia: [0, 1]
}
```

A informação importante da imagem também deve estar presente no HTML. A arte serve como reforço visual, não como substituto do texto.

## Organização recomendada

```text
/
├── index.html
├── aula.html
├── css/
│   └── styles.css
├── js/
│   ├── data.js
│   └── app.js
└── assets/
    ├── docs/
    │   ├── aula-04-eucaristia.pdf
    │   └── ...
    ├── icons/
    └── img/
        └── aulas/
            ├── 04/
            ├── 06/
            └── 09/
```

## Princípio de acessibilidade

A ordem de prioridade é:

**HTML semântico → descrição textual → apoio visual.**

Isso significa que uma pessoa que não consiga visualizar as artes ainda consegue estudar a aula completa pelo texto do site.

---

## Novidades da V4 — caderno do aluno

A V4 acrescenta:

- perfis locais separados para vários alunos no mesmo navegador;
- sidebar agrupada por **CRER / CELEBRAR / VIVER / REZAR / SANTIDADE**;
- busca também dentro dos capítulos das aulas;
- barra de progresso por aluno;
- botão **Continuar de onde parei**;
- progresso visual em cada card da home;
- modo leitura;
- tempo estimado de leitura, capítulos e recursos visuais;
- anotação privada em cada seção da aula;
- área **Meu caderno da aula** com reflexão, dúvidas e sugestão;
- exportação das anotações para Markdown;
- botão para copiar a sugestão;
- descrição acessível expandível dos infográficos;
- navegação para aula anterior/próxima.

### Perfis locais não são contas online

Os perfis desta versão são armazenados em `localStorage`. Eles são ideais para estudo individual e também permitem separar alunos quando um computador é compartilhado.

Eles **não sincronizam entre aparelhos** e o formador não recebe automaticamente as sugestões.

Para uma turma com login, sincronização e painel do formador, consulte:

**`MULTIUSUARIO.md`**

A recomendação é manter o front-end estático no GitHub Pages e, quando necessário, acrescentar Supabase para autenticação e dados privados.
