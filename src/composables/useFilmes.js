import { ref, computed, watch } from "vue";
import { pesquisarFilmes, descobrirFilmes } from "@/services/tmdb";

// criterios: computed com { pesquisa, genero, ano, notaMin, pais, ordem }
export function useFilmes(criterios) {
  const filmes = ref([]);
  const aCarregar = ref(false);
  const erro = ref("");

  const pagina = ref(1);
  const totalPaginas = ref(1);
  const totalResultados = ref(null);

  // Conta os pedidos para ignorar respostas antigas
  let pedidoActual = 0;

  // Escolhe o endpoint certo conforme os critérios
  async function pedirPagina(numero) {
    const { pesquisa, genero, ano, notaMin } = criterios.value;

    // Sem texto: a TMDB filtra tudo por nós
    if (!pesquisa) return descobrirFilmes(criterios.value, numero);

    // Com texto: a pesquisa da TMDB só filtra por ano,
    // por isso o género e a nota são filtrados aqui, no navegador
    const dados = await pesquisarFilmes(pesquisa, numero, ano);
    if (genero || notaMin) {
      dados.results = dados.results.filter(
        (f) =>
          (!genero || f.genre_ids.includes(Number(genero))) &&
          (!notaMin || f.vote_average >= Number(notaMin))
      );
      dados.total_results = null; // o total da TMDB já não é exacto
    }
    return dados;
  }

  async function carregar(novaPagina = 1) {
    const estePedido = ++pedidoActual;
    aCarregar.value = true;
    erro.value = "";
    if (novaPagina === 1) filmes.value = [];

    try {
      const dados = await pedirPagina(novaPagina);
      if (estePedido !== pedidoActual) return; // chegou tarde: ignorar

      const ids = new Set(filmes.value.map((f) => f.id));
      const novos = dados.results.filter((f) => !ids.has(f.id));
      filmes.value = [...filmes.value, ...novos];

      pagina.value = dados.page;
      totalPaginas.value = Math.min(dados.total_pages, 500);
      totalResultados.value = dados.total_results;
    } catch (e) {
      if (estePedido === pedidoActual) erro.value = e.message;
    } finally {
      if (estePedido === pedidoActual) aCarregar.value = false;
    }
  }

  const temMais = computed(() => pagina.value < totalPaginas.value);

  function carregarMais() {
    carregar(pagina.value + 1);
  }

  // Sempre que os critérios mudam, recomeça da página 1
  watch(criterios, () => carregar(1), { immediate: true, deep: true });

  return { filmes, aCarregar, erro, temMais, totalResultados, carregar, carregarMais };
}