# Spotify — colocar somente uma playlist católica

O site foi preparado para exibir **uma única playlist**.

Você não precisa criar aplicação no Spotify e não precisa de chave de API para o player incorporado.

## PASSO 1 — Copiar o link da playlist

No Spotify:

1. abra a sua playlist católica;
2. clique em **Compartilhar**;
3. escolha **Copiar link da playlist**.

O link será parecido com:

`https://open.spotify.com/playlist/xxxxxxxxxxxx`

## PASSO 2 — Colar no site

Abra:

`js/config.js`

Procure:

```js
spotifyPlaylistUrl: '',
```

Cole o link entre as aspas:

```js
spotifyPlaylistUrl: 'https://open.spotify.com/playlist/xxxxxxxxxxxx',
```

Também pode alterar:

```js
spotifyTitle: 'Playlist Católica',
spotifySubtitle: 'Música para rezar, estudar e permanecer em Deus.',
```

## Como o site foi otimizado

O Spotify não é carregado imediatamente.

Primeiro aparece um cartão bonito com o botão:

**▶ Ouvir minha playlist**

Somente depois do clique o iframe oficial do Spotify é carregado.

Isso mantém a página inicial muito mais leve.
