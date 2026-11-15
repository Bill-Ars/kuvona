<script setup>
import { ref, watch, onUnmounted } from "vue";

const props = defineProps({
  valor: { type: String, default: "" }, // o texto que vem do URL
});
const emit = defineEmits(["pesquisar"]);

const texto = ref(props.valor); // ligado ao input com v-model
let temporizador = null;

// Espera 400 ms depois da última tecla antes de avisar o pai.
// Assim não fazemos um pedido à API por cada letra.
watch(texto, (novo) => {
  clearTimeout(temporizador);
  temporizador = setTimeout(() => emit("pesquisar", novo.trim()), 400);
});

// Se o URL mudar por fora (botão voltar), actualiza o campo
watch(
  () => props.valor,
  (novo) => {
    if (novo !== texto.value.trim()) texto.value = novo;
  }
);

function limpar() {
  texto.value = "";
}

onUnmounted(() => clearTimeout(temporizador));
</script>

<template>
  <div class="pesquisa">
    <span class="icone">🔍</span>
    <input
      v-model="texto"
      type="search"
      placeholder="Pesquisar um filme... ex.: O Rei Leão"
      aria-label="Pesquisar filmes"
    />
    <button v-if="texto" class="limpar" @click="limpar" aria-label="Limpar">✕</button>
  </div>
</template>

<style scoped>
.pesquisa {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--cor-cartao);
  border: 1px solid var(--cor-borda);
  border-radius: 999px;
  padding: 0.6rem 1rem;
  margin-bottom: 1.5rem;
  transition: border-color 0.2s;
}
.pesquisa:focus-within {
  border-color: var(--cor-amarelo);
}
.pesquisa input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--cor-texto);
  font-size: 1rem;
}
.pesquisa input::-webkit-search-cancel-button {
  display: none;
}
.limpar {
  background: none;
  border: none;
  color: var(--cor-texto-suave);
  cursor: pointer;
  font-size: 1rem;
}
</style>