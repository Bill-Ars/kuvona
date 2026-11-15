<script setup>
import { Clapperboard, House, Film, Heart } from "@lucide/vue";
import { useFavoritos } from "@/composables/useFavoritos";

// O contador dos favoritos actualiza-se sozinho (estado partilhado)
const { total } = useFavoritos();

// As ligações da barra, geradas com v-for
const ligacoes = [
  { para: { name: "inicio" }, texto: "Início", icone: House },
  { para: { name: "filmes" }, texto: "Filmes", icone: Film },
  { para: { name: "favoritos" }, texto: "Favoritos", icone: Heart },
];
</script>

<template>
  <header class="barra">
    <nav class="contentor nav">
      <RouterLink to="/" class="logo">
        <span class="logo-icone"><Clapperboard :size="20" /></span>
        Kuvona
      </RouterLink>

      <div class="ligacoes vidro">
        <RouterLink v-for="l in ligacoes" :key="l.texto" :to="l.para">
          <component :is="l.icone" :size="17" />
          <span>{{ l.texto }}</span>
          <span v-if="l.texto === 'Favoritos' && total" class="contador">{{ total }}</span>
        </RouterLink>
      </div>
    </nav>

    <!-- Faixa com as cores da bandeira de Moçambique, como uma capulana -->
    <div class="faixa-capulana" aria-hidden="true"></div>
  </header>
</template>

<style scoped>
.barra {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(18, 12, 22, 0.55);
  backdrop-filter: blur(18px) saturate(160%);
  -webkit-backdrop-filter: blur(18px) saturate(160%);
}
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: 0.85rem;
  gap: 1rem;
}
.logo {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}
/* Ícone do logo em "vidro violeta", como os ícones da referência */
.logo-icone {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  color: #fff;
  background:
    linear-gradient(160deg, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0) 50%),
    linear-gradient(160deg, #b18aff, #6a3df0);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -4px 10px rgba(40, 10, 120, 0.5),
    0 8px 20px -6px rgba(157, 107, 255, 0.8);
}
.ligacoes {
  display: flex;
  gap: 0.25rem;
  padding: 0.3rem;
  border-radius: 999px;
}
.ligacoes a {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.95rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--texto-suave);
  transition: color 0.2s, background 0.2s;
}
.ligacoes a:hover {
  color: var(--texto);
  background: var(--vidro-forte);
}
/* O RouterLink da página actual recebe esta classe sozinho */
.ligacoes a.router-link-exact-active {
  color: #fff;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.04));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 4px 14px -4px rgba(157, 107, 255, 0.6);
}
.contador {
  display: inline-grid;
  place-items: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.3rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(160deg, #ff7aa8, var(--violeta));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
}
.faixa-capulana {
  height: 3px;
  background: linear-gradient(
    to right,
    #009a44 0 33%,
    #0b0b0f 33% 38%,
    #fcd116 38% 62%,
    #0b0b0f 62% 67%,
    #d21034 67% 100%
  );
  /* brilho suave por baixo, no estilo do vidro */
  box-shadow: 0 0 14px rgba(252, 209, 22, 0.35);
  opacity: 0.9;
}

/* Telemóvel: só os ícones */
@media (max-width: 560px) {
  .ligacoes a span:not(.contador) {
    display: none;
  }
  .ligacoes a {
    padding: 0.5rem 0.7rem;
  }
}
</style>
