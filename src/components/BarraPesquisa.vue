<script setup>
import { ref, watch, onUnmounted } from "vue";
import { Search, X } from "@lucide/vue";

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
  <div class="pesquisa vidro">
    <Search :size="20" class="icone" />
    <input
      v-model="texto"
      type="search"
      placeholder="Pesquisar um filme... ex.: O Rei Leão"
      aria-label="Pesquisar filmes"
    />
    <button v-if="texto" class="limpar" @click="limpar" aria-label="Limpar pesquisa">
      <X :size="16" />
    </button>
  </div>
</template>

<style scoped>
.pesquisa {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 999px;
  padding: 0.85rem 1.25rem;
  margin-bottom: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.pesquisa:focus-within {
  border-color: rgba(157, 107, 255, 0.6);
  box-shadow: var(--reflexo), 0 0 0 4px rgba(157, 107, 255, 0.15), 0 12px 40px -12px rgba(157, 107, 255, 0.5);
}
.icone {
  color: var(--texto-suave);
}
.pesquisa:focus-within .icone {
  color: var(--violeta);
}
.pesquisa input {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  color: var(--texto);
  font-family: inherit;
  font-size: 1rem;
}
.pesquisa input::placeholder {
  color: var(--texto-suave);
  opacity: 0.8;
}
.pesquisa input::-webkit-search-cancel-button {
  display: none;
}
.limpar {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--vidro-forte);
  border: 1px solid var(--borda-vidro);
  color: var(--texto-suave);
  cursor: pointer;
}
.limpar:hover {
  color: var(--texto);
}
</style>
