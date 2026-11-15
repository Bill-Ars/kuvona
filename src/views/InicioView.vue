<script setup>
import { ArrowRight, Earth, MonitorPlay, Sparkles } from "@lucide/vue";

const destaques = [
  { icone: Earth, titulo: "Cinema de todo o mundo", texto: "Filtra por país: de Moçambique a Nollywood." },
  { icone: MonitorPlay, titulo: "Onde ver", texto: "Descobre em que plataforma está cada filme." },
  { icone: Sparkles, titulo: "Recomendações", texto: "Gostaste de um? Mostramos-te outros parecidos." },
];
</script>

<template>
  <section class="heroi">
    <!-- Rasto de luz, como na imagem de referência -->
    <div class="rasto" aria-hidden="true"></div>

    <p class="etiqueta vidro">Ku vona · "ver" em Changana</p>
    <h1>Bem-vindo ao <span class="texto-gradiente">Kuvona</span></h1>
    <p class="introducao">
      Descobre o filme certo para o teu fim-de-semana, estejas em Maputo, na Beira, em
      Nampula, ou em qualquer parte do mundo.
    </p>
    <RouterLink :to="{ name: 'filmes' }" class="botao">
      Explorar filmes
      <ArrowRight :size="17" />
    </RouterLink>
  </section>

  <ul class="destaques">
    <li v-for="d in destaques" :key="d.titulo" class="vidro">
      <span class="chip-icone"><component :is="d.icone" :size="22" /></span>
      <h3>{{ d.titulo }}</h3>
      <p>{{ d.texto }}</p>
    </li>
  </ul>
</template>

<style scoped>
.heroi {
  position: relative;
  text-align: center;
  padding: 4.5rem 1rem 3.5rem;
}
.rasto {
  position: absolute;
  inset: 10% -10% auto;
  height: 260px;
  z-index: -1;
  background:
    radial-gradient(ellipse 40% 30% at 30% 60%, rgba(255, 138, 61, 0.35), transparent 70%),
    radial-gradient(ellipse 40% 30% at 70% 40%, rgba(63, 167, 255, 0.3), transparent 70%);
  filter: blur(30px);
}
.etiqueta {
  display: inline-block;
  padding: 0.35rem 1rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--texto-suave);
  margin-bottom: 1.5rem;
}
.heroi h1 {
  font-size: clamp(2.4rem, 7vw, 4.2rem);
  margin-bottom: 1.1rem;
}
.introducao {
  max-width: 560px;
  margin: 0 auto 2.25rem;
  color: var(--texto-suave);
  font-size: 1.05rem;
}
.destaques {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}
.destaques li {
  padding: 1.5rem;
  border-radius: var(--raio-grande);
}
.destaques h3 {
  font-size: 1.05rem;
  margin: 1rem 0 0.35rem;
}
.destaques p {
  color: var(--texto-suave);
  font-size: 0.92rem;
}
.chip-icone {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 15px;
  color: #fff;
  background:
    linear-gradient(160deg, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0) 50%),
    linear-gradient(160deg, #b18aff, #6a3df0);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -5px 12px rgba(40, 10, 120, 0.5),
    0 10px 24px -8px rgba(157, 107, 255, 0.8);
}
</style>
