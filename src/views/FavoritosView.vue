<script setup>
import { ref, computed } from "vue";
import { Heart, ArrowRight, Trash2, ArrowUpDown } from "@lucide/vue";
import CartaoFilme from "@/components/CartaoFilme.vue";
import SeletorVidro from "@/components/SeletorVidro.vue";
import { useFavoritos } from "@/composables/useFavoritos";

const { favoritos, total, limparTodos } = useFavoritos();

// Ordenar: é só um estado desta página, não precisa de ir para o URL
const ordem = ref("recentes");
const opcoesOrdem = [
  { valor: "recentes", texto: "Adicionados recentemente" },
  { valor: "nota", texto: "Melhor classificados" },
  { valor: "titulo", texto: "Título (A–Z)" },
];

// [...lista] faz uma cópia: o .sort() não pode mexer no estado partilhado
const ordenados = computed(() => {
  const lista = [...favoritos.value];
  if (ordem.value === "nota") return lista.sort((a, b) => b.vote_average - a.vote_average);
  if (ordem.value === "titulo") return lista.sort((a, b) => a.title.localeCompare(b.title, "pt"));
  return lista.sort((a, b) => b.adicionadoEm - a.adicionadoEm);
});

function confirmarLimpar() {
  if (window.confirm(`Remover os ${total.value} filmes dos favoritos?`)) limparTodos();
}
</script>

<template>
  <section>
    <header class="topo">
      <div>
        <p class="etiqueta">A tua lista</p>
        <h1>Os meus favoritos</h1>
        <p class="subtitulo">
          <template v-if="total">{{ total }} filme(s) guardado(s) neste navegador.</template>
          <template v-else>Guarda aqui os filmes que queres ver.</template>
        </p>
      </div>

      <div v-if="total" class="controlos">
        <SeletorVidro
          rotulo="Ordenar por"
          :icone="ArrowUpDown"
          :valor="ordem"
          :opcoes="opcoesOrdem"
          @mudar="ordem = $event"
        />
        <button class="botao-secundario limpar" @click="confirmarLimpar">
          <Trash2 :size="15" />
          Limpar todos
        </button>
      </div>
    </header>

    <!-- Vazio -->
    <div v-if="!total" class="vazio vidro">
      <span class="chip-icone"><Heart :size="26" /></span>
      <h2>Ainda não tens favoritos</h2>
      <p>Carrega no coração de qualquer filme para o guardares aqui.</p>
      <RouterLink :to="{ name: 'filmes' }" class="botao">
        Explorar filmes
        <ArrowRight :size="17" />
      </RouterLink>
    </div>

    <!-- A grelha: TransitionGroup anima os cartões que saem -->
    <TransitionGroup v-else tag="div" name="cartao" class="grelha">
      <CartaoFilme v-for="filme in ordenados" :key="filme.id" :filme="filme" />
    </TransitionGroup>
  </section>
</template>

<style scoped>
.topo {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.25rem;
  margin-bottom: 2rem;
}
.etiqueta {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--laranja);
  margin-bottom: 0.35rem;
}
.subtitulo {
  color: var(--texto-suave);
}
.controlos {
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.controlos .seletor {
  flex: 0 1 240px;
}
.limpar {
  padding-block: 0.7rem;
}
.limpar:hover {
  border-color: rgba(255, 93, 115, 0.5);
  color: var(--perigo);
}

.vazio {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 3.5rem 1.5rem;
  border-radius: var(--raio-grande);
  text-align: center;
}
.vazio h2 {
  font-size: 1.3rem;
  margin-top: 0.5rem;
}
.vazio p {
  color: var(--texto-suave);
  margin-bottom: 1rem;
}
.chip-icone {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 18px;
  color: #fff;
  background:
    linear-gradient(160deg, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0) 50%),
    linear-gradient(160deg, #b18aff, #6a3df0);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -5px 12px rgba(40, 10, 120, 0.5),
    0 12px 28px -8px rgba(157, 107, 255, 0.8);
}

.grelha {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 1.1rem;
}

/* Animações do TransitionGroup */
.cartao-move {
  transition: transform 0.35s;
}
.cartao-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}
.cartao-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
