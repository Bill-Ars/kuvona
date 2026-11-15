<script setup>
import { ExternalLink } from "@lucide/vue";
import { urlImagem } from "@/services/tmdb";
import { linkPlataforma } from "@/utils/plataformas";

const props = defineProps({
  titulo: { type: String, required: true },
  plataformas: { type: Array, required: true },
  tituloFilme: { type: String, required: true },
  // Página da TMDB com todas as opções: usada nas plataformas que não conhecemos
  linkGeral: { type: String, default: "" },
});

function link(p) {
  return linkPlataforma(p.provider_name, props.tituloFilme) ?? props.linkGeral;
}
</script>


<template>
  <div v-if="plataformas.length" class="grupo">
    <h4>{{ titulo }}</h4>
    <ul>
      <li v-for="p in plataformas" :key="p.provider_id">
        <a
          :href="link(p)"
          target="_blank"
          rel="noopener"
          :title="`Procurar «${tituloFilme}» na ${p.provider_name}`"
        >
          <img :src="urlImagem(p.logo_path, 'w92')" alt="" />
          <span>{{ p.provider_name }}</span>
          <span class="abrir">
            Abrir
            <ExternalLink :size="12" />
          </span>
        </a>
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
/* Cada plataforma é uma cápsula de vidro clicável */
a {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.3rem 0.85rem 0.3rem 0.3rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--texto);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.03));
  border: 1px solid var(--borda-vidro);
  box-shadow: var(--reflexo);
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
}
a:hover {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.06));
  border-color: var(--borda-vidro-forte);
  transform: translateY(-2px);
}
a:focus-visible {
  outline: 2px solid var(--laranja);
  outline-offset: 2px;
}
img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
/* Pequeno "Abrir" à direita, para se perceber que é um botão */
.abrir {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: 0.2rem;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  color: #fff;
  background: rgba(157, 107, 255, 0.35);
  border: 1px solid rgba(157, 107, 255, 0.5);
}
</style>
