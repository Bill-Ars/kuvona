import { ref, computed, watch } from "vue";

// ===== Favoritos guardados no navegador (localStorage) =====
// Estado PARTILHADO: o ref fica fora da função, como no useGeneros.
// O cartão, a página do filme, a barra e a página de favoritos
// vêem todos a MESMA lista. Muda num sítio, muda em todos.

const CHAVE = "kuvona:favoritos";

// Lê o que estava guardado. O try/catch protege contra JSON estragado
// ou navegadores que bloqueiam o localStorage (modo privado).
function ler() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CHAVE));
    return Array.isArray(guardado) ? guardado : [];
  } catch {
    return [];
  }
}

const favoritos = ref(ler());

// Sempre que a lista muda, grava-a
watch(
  favoritos,
  (lista) => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(lista));
    } catch {
      // Sem espaço ou bloqueado: a app continua a funcionar, só não grava
    }
  },
  { deep: true }
);

// Se o utilizador tiver o Kuvona aberto em dois separadores,
// o evento "storage" mantém os dois sincronizados
window.addEventListener("storage", (evento) => {
  if (evento.key === CHAVE) favoritos.value = ler();
});

export function useFavoritos() {
  const total = computed(() => favoritos.value.length);

  function eFavorito(id) {
    return favoritos.value.some((f) => f.id === id);
  }

  // Guardamos só o que o CartaoFilme precisa, não a resposta inteira da TMDB
  function adicionar(filme) {
    if (eFavorito(filme.id)) return;
    favoritos.value.unshift({
      id: filme.id,
      title: filme.title,
      poster_path: filme.poster_path,
      vote_average: filme.vote_average,
      release_date: filme.release_date,
      adicionadoEm: Date.now(),
    });
  }

  function remover(id) {
    favoritos.value = favoritos.value.filter((f) => f.id !== id);
  }

  function alternar(filme) {
    eFavorito(filme.id) ? remover(filme.id) : adicionar(filme);
  }

  function limparTodos() {
    favoritos.value = [];
  }

  return { favoritos, total, eFavorito, adicionar, remover, alternar, limparTodos };
}
