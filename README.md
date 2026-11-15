# Kuvona

> *Ku vona* quer dizer **"ver"** em Changana (Xitsonga).
> **Kuvona · feito em Maputo, para o mundo.**

Aplicação web em **Vue 3** para descobrir filmes: navegar, pesquisar, filtrar e ver os detalhes de cada filme, com destaque para o cinema moçambicano e africano. Os dados vêm da API da [TMDB](https://www.themoviedb.org).

**App publicada:** https://bill-ars.github.io/kuvona/

## Funcionalidades

- **Lista de filmes** em alta, com o botão "Carregar mais" (paginação)
- **Pesquisa por nome**, com debounce de 400 ms e o texto guardado no URL (`#/filmes?q=...`)
- **Filtros** por género, ano, classificação, país de origem (incluindo **Moçambique**, Angola, Nigéria…) e ordenação, também guardados no URL
- **Detalhe do filme**: sinopse, duração, géneros, realizador, trailer do YouTube (só carrega a pedido), elenco, "Onde ver" (procura primeiro Moçambique e depois os países vizinhos) e recomendações
- **Favoritos** guardados no navegador (`localStorage`)
- **Página inicial** com as tendências da semana, uma sugestão para o fim-de-semana e atalhos de género
- Interface em "vidro líquido", que se adapta ao telemóvel

## Tecnologias

- [Vue 3](https://vuejs.org) (Composition API, `<script setup>`) e [Vite](https://vite.dev)
- [Vue Router](https://router.vuejs.org) com hash history (compatível com o GitHub Pages)
- [Lucide](https://lucide.dev) para os ícones
- API da [TMDB](https://developer.themoviedb.org) v3
- GitHub Pages + GitHub Actions, para a publicação automática

## Como correr localmente

Precisas do Node.js 22 ou mais recente e de um token de leitura da API da TMDB (em *Settings → API*, no site da TMDB).

```sh
git clone https://github.com/Bill-Ars/kuvona.git
cd kuvona
npm install
```

Copia o ficheiro `.env.exemplo` para `.env.local` e coloca lá o teu token:

```
VITE_TMDB_TOKEN=o_teu_token
```

Depois:

```sh
npm run dev      # servidor de desenvolvimento
npm run build    # versão de produção, na pasta dist/
```

O `.env.local` está no `.gitignore` e nunca vai para o GitHub.

## Estrutura

```
src/
├─ services/tmdb.js      pedidos à API (fetch, async/await, tratamento de erros)
├─ composables/          useFilmes, useFilme, useGeneros, useFavoritos, useInicio
├─ components/           BarraNavegacao, BarraPesquisa, PainelFiltros, SeletorVidro,
│                        CartaoFilme, ListaPlataformas, BotaoFavorito
├─ views/                Inicio, Filmes, Filme, Favoritos, NaoEncontrada (404)
├─ router/index.js       rotas, incluindo a rota dinâmica /filme/:id
└─ utils/formatacao.js   ano, nota, duração, data por extenso
```

## Branches

- `main`: versão estável, publicada no GitHub Pages
- `develop`: trabalho diário

## Autor

**Bill Arsénio Ndayisaba** · [GitHub: Bill-Ars](https://github.com/Bill-Ars)


---

Este produto usa a API da TMDB, mas não é endossado nem certificado pela TMDB.
Os dados de disponibilidade ("Onde ver") são da JustWatch, via TMDB.
