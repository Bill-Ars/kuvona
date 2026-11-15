<script setup>
import { computed } from "vue";
import { urlImagem } from "@/services/tmdb";
import { ano, nota } from "@/utils/formatacao";

// O pai (FilmesView) passa o filme por props
const props = defineProps({
  filme: { type: Object, required: true },
});

const poster = computed(() => urlImagem(props.filme.poster_path));
</script>

<template>
  <RouterLink :to="{ name: 'filme', params: { id: filme.id } }" class="cartao">
    <div class="poster">
      <img v-if="poster" :src="poster" :alt="filme.title" loading="lazy" />
      <div v-else class="sem-poster">🎬</div>

      <span class="nota">⭐ {{ nota(filme.vote_average) }}</span>
    </div>

    <div class="info">
      <h3>{{ filme.title }}</h3>
      <p>{{ ano(filme.release_date) }}</p>
    </div>
  </RouterLink>
</template>

<style scoped>
.cartao {
  display: block;
  background: var(--cor-cartao);
  border-radius: var(--raio);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}
.cartao:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}
.poster {
  position: relative;
  aspect-ratio: 2 / 3;
  background: var(--cor-borda);
}
.poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.sem-poster {
  display: grid;
  place-items: center;
  height: 100%;
  font-size: 3rem;
}
.nota {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background: rgba(0, 0, 0, 0.75);
  color: var(--cor-amarelo);
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
}
.info {
  padding: 0.75rem;
}
.info h3 {
  font-size: 0.95rem;
  line-height: 1.3;
  /* corta títulos longos em 2 linhas */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.info p {
  color: var(--cor-texto-suave);
  font-size: 0.85rem;
}
</style>