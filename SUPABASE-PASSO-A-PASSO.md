# Supabase — passo a passo para leigo

## O que o Supabase fará neste site

Pense assim:

- GitHub Pages = mostra o site e as aulas;
- Supabase = guarda a conta e os dados particulares de cada aluno.

Cada aluno poderá usar o mesmo site, mas verá somente:

- o próprio progresso;
- as próprias anotações;
- as próprias dúvidas;
- as próprias sugestões enviadas.

As anotações privadas **não ficam abertas para outros alunos**.

---

## PASSO 1 — Criar sua conta no Supabase

1. Entre em `https://supabase.com`.
2. Clique para criar sua conta ou entrar.
3. No painel, crie um **New project**.
4. Escolha uma organização.
5. Nome sugerido do projeto:

`formacao-caju`

6. Crie uma senha forte para o banco e guarde essa senha.
7. Escolha uma região próxima dos usuários quando o Supabase pedir.
8. Crie o projeto e aguarde ele ficar pronto.

---

## PASSO 2 — Criar as tabelas e a segurança

No painel do seu projeto:

1. Abra **SQL Editor**.
2. Clique para criar uma nova consulta.
3. No projeto baixado, abra:

`supabase/schema.sql`

4. Copie **todo** o conteúdo desse arquivo.
5. Cole no SQL Editor.
6. Clique em **Run**.

Pronto.

Esse arquivo cria:

- `profiles`
- `lesson_progress`
- `lesson_notes`
- `lesson_suggestions`

Ele também ativa o **Row Level Security (RLS)**.

RLS é o que impede um aluno de ler as anotações de outro aluno.

---

## PASSO 3 — Copiar a URL e a Publishable Key

No Supabase, abra o botão **Connect** do projeto.

Copie:

- **Project URL**
- **Publishable key**

A Publishable Key costuma começar com algo semelhante a:

`sb_publishable_...`

Você também pode encontrar as chaves em:

**Settings → API Keys**

### MUITO IMPORTANTE

Use a **Publishable key**.

Nunca coloque no site:

- Secret key;
- `service_role`;
- qualquer chave marcada como secreta.

---

## PASSO 4 — Colocar os dados no site

Abra:

`js/config.js`

Você verá:

```js
window.CAJU_CONFIG = {
  supabaseUrl: '',
  supabasePublishableKey: '',
  spotifyPlaylistUrl: ''
};
```

Troque somente o que está entre aspas.

Exemplo fictício:

```js
window.CAJU_CONFIG = {
  supabaseUrl: 'https://abcdefgh.supabase.co',
  supabasePublishableKey: 'sb_publishable_EXEMPLO',
  spotifyPlaylistUrl: ''
};
```

Não apague as vírgulas.

---

## PASSO 5 — Configurar o e-mail de confirmação

No Supabase, abra a área de autenticação e procure **URL Configuration**.

Quando o site já estiver no GitHub Pages, configure:

### Site URL

A URL pública do seu site. Exemplo:

`https://seuusuario.github.io/formacao-caju/`

### Redirect URLs

Adicione também a URL pública do site.

Para testar no computador, você pode acrescentar:

`http://localhost:8000/**`

Assim, o link de confirmação enviado por e-mail poderá voltar ao site correto.

---

## PASSO 6 — Testar localmente

Não recomendo testar o login apenas clicando duas vezes no `index.html`.

Abra o terminal dentro da pasta do projeto e execute:

```bash
python -m http.server 8000
```

Depois abra:

`http://localhost:8000`

No site:

1. clique em **Entrar**;
2. clique em **Criar conta**;
3. informe nome, e-mail e senha;
4. se o Supabase pedir confirmação por e-mail, abra seu e-mail e confirme;
5. volte ao site e faça login.

Quando a conta estiver conectada, a sidebar mostrará:

`Sincronização online ativa`

---

## Como os vários alunos funcionarão

Não crie um perfil manual para cada pessoa no seu computador.

Cada aluno deverá criar a própria conta.

Exemplo:

- Ana entra com o e-mail da Ana;
- João entra com o e-mail do João;
- Carlos entra com o e-mail do Carlos.

O Supabase usa o identificador interno de cada conta para separar os dados.

Mesmo que todos estudem a Aula 04, cada um terá progresso e anotações próprios.

---

## O que é privado e o que é enviado

### Privado

- anotação de cada seção;
- minha reflexão;
- minhas dúvidas;
- progresso.

### Compartilhado somente por decisão do aluno

- campo **Sugestão para a formação**.

O aluno escreve o texto e precisa clicar em:

**Enviar sugestão à equipe**

Sem esse clique, o rascunho fica apenas no aparelho.

---

## Se algo der errado

### “Supabase ainda não foi configurado”

Confira `js/config.js`.

### O aluno entra, mas os dados não salvam

Confira se você executou `supabase/schema.sql` inteiro.

### O cadastro pede confirmação por e-mail

Isso é normal quando a confirmação está ativada no projeto.

### O site continua funcionando sem internet?

A parte pública continua sendo site estático. As anotações ainda são guardadas localmente no navegador e tentam sincronizar quando a conta está conectada.
