import { ref, computed } from "vue";
import { obterPopulares } from "@/services/tmdb";

// Os três estados de um pedido: dados, a carregar, erro (aula 14, bloco 2)
export function useFilmes() {
  const filmes = ref([]);
  const aCarregar = ref(false);
  const erro = ref("");

  const pagina = ref(1);
  const totalPaginas = ref(1);

  async function carregar(novaPagina = 1) {
    aCarregar.value = true;
    erro.value = "";
    try {
      const dados = await obterPopulares(novaPagina);

      if (novaPagina === 1) {
        filmes.value = dados.results;
      } else {
        // Junta a nova página à lista, sem repetir filmes
        const ids = new Set(filmes.value.map((f) => f.id));
        const novos = dados.results.filter((f) => !ids.has(f.id));
        filmes.value = [...filmes.value, ...novos];
      }

      pagina.value = dados.page;
      totalPaginas.value = Math.min(dados.total_pages, 500); // a TMDB só deixa ir até à 500
    } catch (e) {
      erro.value = e.message;
    } finally {
      aCarregar.value = false;
    }
  }

  const temMais = computed(() => pagina.value < totalPaginas.value);

  function carregarMais() {
    carregar(pagina.value + 1);
  }

  return { filmes, aCarregar, erro, temMais, carregar, carregarMais };
}