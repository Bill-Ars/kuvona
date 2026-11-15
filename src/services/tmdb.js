// ===== Serviço TMDB: só faz pedidos e devolve dados =====
// Não mexe no ecrã. Quem mostra os dados são os componentes.

const URL_BASE = "https://api.themoviedb.org/3";
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const IDIOMA = "pt-BR"; // títulos e sinopses em português

// Função genérica: monta o URL, faz o fetch e trata os erros
async function pedir(caminho, parametros = {}) {
  const url = new URL(URL_BASE + caminho);
  url.searchParams.set("language", IDIOMA);

  // Acrescenta só os parâmetros que têm valor
  for (const [chave, valor] of Object.entries(parametros)) {
    if (valor !== "" && valor !== null && valor !== undefined) {
      url.searchParams.set(chave, valor);
    }
  }

  const resposta = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      accept: "application/json",
    },
  });

  // fetch só falha sozinho se não houver rede.
  // Para 401, 404, 429... temos de verificar resposta.ok
  if (!resposta.ok) {
    throw new Error(mensagemDeErro(resposta.status));
  }

  return await resposta.json();
}

function mensagemDeErro(estado) {
  if (estado === 401) return "Token da TMDB inválido. Verifica o ficheiro .env.local.";
  if (estado === 404) return "Não encontrámos o que procuras.";
  if (estado === 429) return "Muitos pedidos seguidos. Espera um pouco e tenta de novo.";
  return `Erro ${estado} ao falar com a TMDB.`;
}

// ===== Funções que os composables usam =====

export function obterPopulares(pagina = 1) {
  return pedir("/movie/popular", { page: pagina });
}

// Pesquisa por texto (só aceita filtrar por ano)
export function pesquisarFilmes(texto, pagina = 1, ano = "") {
  return pedir("/search/movie", {
    query: texto,
    page: pagina,
    primary_release_year: ano,
  });
}

// Lista com filtros: género, ano, nota mínima, país e ordem
export function descobrirFilmes(filtros = {}, pagina = 1) {
  const { genero, ano, notaMin, pais, ordem } = filtros;
  const porNota = ordem === "vote_average.desc" || notaMin;
  const hoje = new Date().toISOString().slice(0, 10);

  return pedir("/discover/movie", {
    page: pagina,
    with_genres: genero,
    primary_release_year: ano,
    with_origin_country: pais,
    "vote_average.gte": notaMin,
    // Evita filmes com nota 10 dada por 2 pessoas
    "vote_count.gte": porNota && !pais ? 200 : undefined,
    // Não mostra filmes que ainda não estrearam
    "primary_release_date.lte": hoje,
    sort_by: ordem || "popularity.desc",
  });
}

// A lista de géneros (Acção, Comédia...) já traduzida
export function obterGeneros() {
  return pedir("/genre/movie/list");
}

// Os filmes em alta esta semana (para a página Início)
export function obterTendencias() {
  return pedir("/trending/movie/week");
}

// Sugestão para o fim-de-semana: filmes bem classificados numa página
// aleatória de 1 a 10, para a sugestão mudar de cada vez
export function obterBemClassificados() {
  return pedir("/discover/movie", {
    page: Math.floor(Math.random() * 10) + 1,
    "vote_average.gte": 7.5,
    "vote_count.gte": 500,
    sort_by: "popularity.desc",
  });
}

// Um filme com tudo: elenco, vídeos, onde ver e recomendações.
// append_to_response junta vários pedidos num só (poupa dados)
export function obterFilme(id) {
  return pedir(`/movie/${id}`, {
    append_to_response: "credits,videos,watch/providers,recommendations",
    include_video_language: "pt,en,null", // trailers em português ou inglês
  });
}

// Endereço completo de uma imagem (póster ou fundo)
export function urlImagem(caminho, tamanho = "w342") {
  return caminho ? `https://image.tmdb.org/t/p/${tamanho}${caminho}` : null;
}