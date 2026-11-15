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



export function pesquisarFilmes(texto, pagina = 1) {
  return pedir("/search/movie", { query: texto, page: pagina });
}


// Endereço completo de uma imagem (póster ou fundo)
export function urlImagem(caminho, tamanho = "w342") {
  return caminho ? `https://image.tmdb.org/t/p/${tamanho}${caminho}` : null;
}