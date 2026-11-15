import { ref } from "vue";
import { obterTendencias, obterBemClassificados } from "@/services/tmdb";

// Os dados da página Início: tendências da semana e uma sugestão aleatória.
// Cada bloco tem os seus 3 estados (a carregar, sucesso, erro),
// para um não estragar o outro se falhar.
export function useInicio() {
  const tendencias = ref([]);
  const aCarregarTendencias = ref(false);
  const erroTendencias = ref("");

  const sugestao = ref(null);
  const aCarregarSugestao = ref(false);
  const erroSugestao = ref("");

  async function carregarTendencias() {
    aCarregarTendencias.value = true;
    erroTendencias.value = "";
    try {
      const dados = await obterTendencias();
      tendencias.value = dados.results.slice(0, 10);
    } catch (e) {
      erroTendencias.value = e.message;
    } finally {
      aCarregarTendencias.value = false;
    }
  }

  async function novaSugestao() {
    aCarregarSugestao.value = true;
    erroSugestao.value = "";
    try {
      const dados = await obterBemClassificados();
      // Só filmes com imagem de fundo, para o cartão ficar bonito
      const comImagem = dados.results.filter((f) => f.backdrop_path && f.overview);
      const lista = comImagem.length ? comImagem : dados.results;
      sugestao.value = lista[Math.floor(Math.random() * lista.length)] ?? null;
    } catch (e) {
      erroSugestao.value = e.message;
    } finally {
      aCarregarSugestao.value = false;
    }
  }

  carregarTendencias();
  novaSugestao();

  return {
    tendencias,
    aCarregarTendencias,
    erroTendencias,
    carregarTendencias,
    sugestao,
    aCarregarSugestao,
    erroSugestao,
    novaSugestao,
  };
}
