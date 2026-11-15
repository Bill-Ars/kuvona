<script setup>
import { computed } from "vue";
import { Star, Film } from "@lucide/vue";
import { urlImagem } from "@/services/tmdb";
import { ano, nota } from "@/utils/formatacao";
import BotaoFavorito from "@/components/BotaoFavorito.vue";

// O pai (FilmesView) passa o filme por props
const props = defineProps({
  filme: { type: Object, required: true },
});

const poster = computed(() => urlImagem(props.filme.poster_path));
</script>

<template>
  <!-- O botão fica FORA do link: um <button> dentro de um <a> não é HTML válido,
       e clicar no coração abriria o filme -->
  <div class="cartao">
    <RouterLink :to="{ name: 'filme', params: { id: filme.id } }" class="ligacao">
      <div class="poster">
        <img v-if="poster" :src="poster" :alt="filme.title" loading="lazy" />
        <div v-else class="sem-poster"><Film :size="40" :stroke-width="1.5" /></div>

        <span class="nota">
          <Star :size="12" fill="currentColor" />
          {{ nota(filme.vote_average) }}
        </span>
      </div>

      <div class="info">
        <h3>{{ filme.title }}</h3>
        <p>{{ ano(filme.release_date) }}</p>
      </div>
    </RouterLink>

    <BotaoFavorito :filme="filme" class="botao-favorito" />
  </div>
</template>

<style scoped>
.cartao {
  position: relative;
  border-radius: var(--raio-grande);
  padding: 0.5rem;
  background: linear-gradient(180deg, var(--vidro-forte), var(--vidro));
  border: 1px solid var(--borda-vidro);
  box-shadow: var(--reflexo);
  transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
}
.cartao:hover {
  transform: translateY(-6px);
  border-color: var(--borda-vidro-forte);
  box-shadow: var(--reflexo), 0 24px 40px -18px rgba(157, 107, 255, 0.55),
    0 10px 30px -12px rgba(255, 138, 61, 0.35);
}
.ligacao {
  display: block;
  border-radius: calc(var(--raio-grande) - 6px);
}
.ligacao:focus-visible {
  outline-offset: 4px;
}
/* O coração no canto do póster (0.5rem de padding + 0.5rem de margem) */
.botao-favorito {
  position: absolute;
  top: 1rem;
  right: 1rem;
}
.poster {
  position: relative;
  aspect-ratio: 2 / 3;
  border-radius: calc(var(--raio-grande) - 6px);
  overflow: hidden;
  background: var(--fundo-elevado);
}
.poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}
.cartao:hover .poster img {
  transform: scale(1.05);
}
.sem-poster {
  display: grid;
  place-items: center;
  height: 100%;
  color: var(--texto-suave);
}
.nota {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: rgba(10, 10, 16, 0.55);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffc46b;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
}
.info {
  padding: 0.7rem 0.4rem 0.35rem;
}
.info h3 {
  font-size: 0.92rem;
  font-weight: 600;
  line-height: 1.3;
  /* corta títulos longos em 2 linhas */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.info p {
  color: var(--texto-suave);
  font-size: 0.82rem;
  margin-top: 0.15rem;
}
</style>
