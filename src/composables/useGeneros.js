import { ref } from "vue";
import { obterGeneros } from "@/services/tmdb";

// Estado PARTILHADO: o ref fica fora da função (aula 14, bloco 5).
// A lista de géneros é pedida à TMDB uma só vez, mesmo que vários
// componentes chamem useGeneros().
const generos = ref([]);
let jaPedido = false;

export function useGeneros() {
  if (!jaPedido) {
    jaPedido = true;
    obterGeneros()
      .then((dados) => (generos.value = dados.genres))
      .catch(() => (jaPedido = false)); // se falhar, tenta na próxima vez
  }

  function nomeGenero(id) {
    return generos.value.find((g) => g.id === Number(id))?.name ?? "";
  }

  return { generos, nomeGenero };
}