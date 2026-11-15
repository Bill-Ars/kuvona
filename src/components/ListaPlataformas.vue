<script setup>
import { urlImagem } from "@/services/tmdb";

defineProps({
  titulo: { type: String, required: true },
  plataformas: { type: Array, required: true },
});
</script>

<template>
  <div v-if="plataformas.length" class="grupo">
    <h4>{{ titulo }}</h4>
    <ul>
      <li v-for="p in plataformas" :key="p.provider_id" :title="p.provider_name">
        <img :src="urlImagem(p.logo_path, 'w92')" :alt="p.provider_name" />
        <span>{{ p.provider_name }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.grupo + .grupo {
  margin-top: 1.1rem;
}
h4 {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--texto-suave);
  margin-bottom: 0.6rem;
}
ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}
/* Cada plataforma é uma cápsula de vidro */
li {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.3rem 0.85rem 0.3rem 0.3rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 500;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.03));
  border: 1px solid var(--borda-vidro);
  box-shadow: var(--reflexo);
}
img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
</style>
