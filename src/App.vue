<script setup>
import BarraNavegacao from "@/components/BarraNavegacao.vue";
</script>

<template>
  <BarraNavegacao />

  <main class="contentor">
    <!-- Aqui aparece a view da rota actual -->
    <RouterView />
  </main>

  <footer class="rodape">
    <p>🎬 Kuvona · feito em Maputo, para o mundo!</p>
    <p class="atribuicao">
      Dados e imagens fornecidos pela
      <a href="https://www.themoviedb.org" target="_blank" rel="noopener">TMDB</a>.
      Este produto usa a API da TMDB, mas não é endossado nem certificado pela TMDB.
    </p>
  </footer>
</template>

<style scoped>
.rodape {
  margin-top: 4rem;
  padding: 2rem 1rem;
  text-align: center;
  border-top: 1px solid var(--cor-borda);
  color: var(--cor-texto-suave);
  font-size: 0.9rem;
}
.atribuicao {
  font-size: 0.8rem;
  margin-top: 0.5rem;
}
.rodape a {
  color: var(--cor-amarelo);
}
</style>