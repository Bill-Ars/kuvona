<script setup>
import { computed } from "vue";
import { Heart } from "@lucide/vue";
import { useFavoritos } from "@/composables/useFavoritos";

const props = defineProps({
  filme: { type: Object, required: true },
  // "icone": só o coração (no cartão) · "completo": com texto (na página do filme)
  variante: { type: String, default: "icone" },
});

const { eFavorito, alternar } = useFavoritos();

const activo = computed(() => eFavorito(props.filme.id));
const rotulo = computed(() =>
  activo.value ? "Remover dos favoritos" : "Adicionar aos favoritos"
);
</script>

<template>
  <button
    type="button"
    class="favorito"
    :class="[variante, { activo }]"
    :aria-pressed="activo"
    :aria-label="rotulo"
    :title="rotulo"
    @click="alternar(filme)"
  >
    <Heart :size="variante === 'icone' ? 17 : 18" :fill="activo ? 'currentColor' : 'none'" />
    <span v-if="variante === 'completo'">{{ activo ? "Nos favoritos" : "Favorito" }}</span>
  </button>
</template>

<style scoped>
.favorito {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: inherit;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.04));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 6px 18px -6px rgba(0, 0, 0, 0.6);
  transition: transform 0.15s, background 0.2s, box-shadow 0.2s, color 0.2s;
}
.favorito:hover {
  transform: scale(1.06);
}
.favorito:active {
  transform: scale(0.94);
}
.favorito:focus-visible {
  outline: 2px solid var(--violeta);
  outline-offset: 2px;
}

/* Só o ícone: círculo pequeno por cima do póster */
.icone {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(10, 10, 16, 0.35);
}

/* Com texto: cápsula ao lado do botão do trailer */
.completo {
  padding: 0.8rem 1.4rem;
  border-radius: 999px;
  font-size: 0.95rem;
}

/* Activo: vidro cor-de-rosa/violeta a brilhar */
.activo {
  color: #ff7aa8;
  border-color: rgba(255, 122, 168, 0.55);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0) 55%),
    linear-gradient(160deg, rgba(255, 122, 168, 0.35), rgba(157, 107, 255, 0.35));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 8px 22px -6px rgba(255, 122, 168, 0.7);
}
.activo svg {
  animation: pulsar 0.35s ease-out;
}
@keyframes pulsar {
  50% {
    transform: scale(1.3);
  }
}
</style>
