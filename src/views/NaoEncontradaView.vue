<script setup>
import { Film, House } from "@lucide/vue";
</script>

<template>
  <section class="vazio">
    <Film :size="48" :stroke-width="1.25" class="icone" />
    <p class="codigo texto-gradiente">404</p>
    <h1>Eish! Página não encontrada</h1>
    <p>Este filme não está em cartaz. Volta ao início e escolhe outro.</p>
    <RouterLink to="/" class="botao">
      <House :size="16" />
      Voltar ao início
    </RouterLink>
  </section>
</template>

<style scoped>
.vazio {
  text-align: center;
  padding: 4rem 1rem;
}
.icone {
  margin: 0 auto 0.5rem;
  color: var(--violeta);
}
.codigo {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 0.5rem;
}
.vazio > p:not(.codigo) {
  color: var(--texto-suave);
  margin-bottom: 1.75rem;
}
</style>
