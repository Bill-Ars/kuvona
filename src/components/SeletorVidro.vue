<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from "vue";
import { ChevronDown, Check, Star } from "@lucide/vue";

// Um <select> feito por nós, em "vidro líquido".
// O <select> nativo não aceita ícones nem estilos dentro da lista.
const props = defineProps({
  rotulo: { type: String, required: true },
  icone: { type: [Object, Function], default: null },
  valor: { type: String, default: "" },
  // [{ valor: "MZ", texto: "Moçambique", codigo: "MZ" }, { valor: "7", texto: "7 ou mais", estrela: true }]
  opcoes: { type: Array, required: true },
  desactivado: { type: Boolean, default: false },
});
const emit = defineEmits(["mudar"]);

const aberto = ref(false);
const destacado = ref(0); // índice da opção destacada pelo teclado
const raiz = ref(null);
const lista = ref(null);
const idLista = `lista-${Math.random().toString(36).slice(2, 9)}`;

const escolhida = computed(
  () => props.opcoes.find((o) => o.valor === props.valor) ?? props.opcoes[0]
);

async function abrir() {
  if (props.desactivado) return;
  aberto.value = true;
  destacado.value = Math.max(0, props.opcoes.findIndex((o) => o.valor === props.valor));
  await nextTick();
  lista.value?.focus();
  mostrarDestacada();
}

function fechar() {
  aberto.value = false;
}

function alternar() {
  aberto.value ? fechar() : abrir();
}

function escolher(opcao) {
  emit("mudar", opcao.valor);
  fechar();
  raiz.value?.querySelector("button")?.focus();
}

// Garante que a opção destacada está visível (a lista dos anos é longa)
function mostrarDestacada() {
  lista.value?.children[destacado.value]?.scrollIntoView({ block: "nearest" });
}

function teclado(evento) {
  const ultimo = props.opcoes.length - 1;
  if (evento.key === "ArrowDown") destacado.value = Math.min(ultimo, destacado.value + 1);
  else if (evento.key === "ArrowUp") destacado.value = Math.max(0, destacado.value - 1);
  else if (evento.key === "Home") destacado.value = 0;
  else if (evento.key === "End") destacado.value = ultimo;
  else if (evento.key === "Enter" || evento.key === " ") escolher(props.opcoes[destacado.value]);
  else if (evento.key === "Escape" || evento.key === "Tab") return fechar();
  else return;
  evento.preventDefault();
  mostrarDestacada();
}

// Fecha ao clicar fora do componente
function cliqueFora(evento) {
  if (aberto.value && !raiz.value?.contains(evento.target)) fechar();
}
onMounted(() => document.addEventListener("pointerdown", cliqueFora));
onUnmounted(() => document.removeEventListener("pointerdown", cliqueFora));
</script>

<template>
  <div ref="raiz" class="seletor" :class="{ aberto, desactivado }">
    <span class="rotulo">{{ rotulo }}</span>

    <button
      type="button"
      class="campo"
      :disabled="desactivado"
      aria-haspopup="listbox"
      :aria-expanded="aberto"
      :aria-controls="idLista"
      @click="alternar"
      @keydown.down.prevent="abrir"
    >
      <component :is="icone" v-if="icone" :size="17" class="icone" />
      <span class="texto">{{ escolhida?.texto }}</span>
      <ChevronDown :size="16" class="seta" />
    </button>

    <Transition name="lista">
      <ul
        v-if="aberto"
        :id="idLista"
        ref="lista"
        class="lista"
        role="listbox"
        tabindex="-1"
        :aria-label="rotulo"
        :aria-activedescendant="`${idLista}-${destacado}`"
        @keydown="teclado"
      >
        <li
          v-for="(opcao, i) in opcoes"
          :id="`${idLista}-${i}`"
          :key="opcao.valor"
          role="option"
          :aria-selected="opcao.valor === valor"
          :class="{ destacada: i === destacado, escolhida: opcao.valor === valor }"
          @click="escolher(opcao)"
          @pointermove="destacado = i"
        >
          <span v-if="opcao.codigo" class="codigo">{{ opcao.codigo }}</span>
          <Star v-if="opcao.estrela" :size="14" fill="currentColor" class="estrela" />
          <span class="texto">{{ opcao.texto }}</span>
          <Check v-if="opcao.valor === valor" :size="16" class="certo" />
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.seletor {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1 1 170px;
  min-width: 0;
}
.rotulo {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--texto-suave);
  padding-left: 0.9rem;
}

/* O campo fechado: cápsula de vidro */
.campo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.7rem 0.9rem;
  border-radius: 999px;
  font-family: inherit;
  font-size: 0.92rem;
  color: var(--texto);
  text-align: left;
  cursor: pointer;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.025));
  border: 1px solid var(--borda-vidro);
  box-shadow: var(--reflexo);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.campo:hover:not(:disabled) {
  border-color: var(--borda-vidro-forte);
}
.campo:focus-visible,
.aberto .campo {
  outline: none;
  border-color: rgba(157, 107, 255, 0.6);
  box-shadow: var(--reflexo), 0 0 0 4px rgba(157, 107, 255, 0.14);
}
.campo:disabled {
  cursor: not-allowed;
}
.icone {
  color: var(--violeta);
}
.texto {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.seta {
  color: var(--texto-suave);
  transition: transform 0.2s;
}
.aberto .seta {
  transform: rotate(180deg);
}
.desactivado {
  opacity: 0.4;
}

/* A lista aberta: painel de vidro escuro */
.lista {
  position: absolute;
  top: calc(100% + 0.4rem);
  left: 0;
  right: 0;
  z-index: 30;
  min-width: 200px;
  max-height: 290px;
  overflow-y: auto;
  list-style: none;
  padding: 0.35rem;
  border-radius: 18px;
  background: rgba(16, 17, 27, 0.82);
  border: 1px solid var(--borda-vidro-forte);
  box-shadow: var(--reflexo), 0 24px 50px -12px rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(22px) saturate(160%);
  -webkit-backdrop-filter: blur(22px) saturate(160%);
  outline: none;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}
.lista li {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.75rem;
  border-radius: 12px;
  font-size: 0.9rem;
  color: var(--texto-suave);
  cursor: pointer;
}
.lista li.destacada {
  background: var(--vidro-forte);
  color: var(--texto);
}
.lista li.escolhida {
  color: var(--texto);
  font-weight: 600;
}
.codigo {
  display: inline-grid;
  place-items: center;
  min-width: 2rem;
  padding: 0.05rem 0.35rem;
  border-radius: 6px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--texto);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.05));
  border: 1px solid var(--borda-vidro);
}
.estrela {
  color: #ffc46b;
}
.certo {
  color: var(--violeta);
}

/* Animação ao abrir e fechar */
.lista-enter-active,
.lista-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}
.lista-enter-from,
.lista-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>
