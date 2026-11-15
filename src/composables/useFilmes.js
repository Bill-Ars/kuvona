import { ref, computed, watch } from "vue";
import { obterPopulares, pesquisarFilmes } from "@/services/tmdb";

// criterios: um computed com o que o utilizador escolheu (por agora, só a pesquisa)
export function useFilmes(criterios) {
  const filmes = ref([]);
  const aCarregar = ref(false);
  const erro = ref("");

  const pagina = ref(1);
  const totalPaginas = ref(1);
  const totalResultados = ref(0);

  // Conta os pedidos para ignorar respostas antigas
  // (quem escreve depressa faz vários pedidos seguidos)
  let pedidoActual = 0;

  // Escolhe o endpoint certo conforme os critérios
  function pedirPagina(numero) {
    const { pesquisa } = criterios.value;
    if (pesquisa) return pesquisarFilmes(pesquisa, numero);
    return obterPopulares(numero);
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

  // Sempre que os critérios mudam, recomeça da página 1.
  // immediate: true → também corre logo da primeira vez (substitui o onMounted)
  watch(criterios, () => carregar(1), { immediate: true, deep: true });

  return { filmes, aCarregar, erro, temMais, totalResultados, carregar, carregarMais };
}