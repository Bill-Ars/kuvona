<script setup>
import { Clapperboard } from "@lucide/vue";
import BarraNavegacao from "@/components/BarraNavegacao.vue";
</script>

<template>
  <BarraNavegacao />

  <main class="contentor">
    <!-- Aqui aparece a view da rota actual -->
    <RouterView />
  </main>

  <footer class="rodape contentor">
  <p class="marca">
    <Clapperboard :size="16" />
    Kuvona · feito em Maputo, para o mundo
  </p>

  <p class="autor">
    Desenvolvido por
    <a href="https://github.com/Bill-Ars" target="_blank" rel="noopener">
      Bill Arsénio Ndayisaba
    </a>
    · LECC31 · ISUTC · {{ new Date().getFullYear() }}
  </p>

  <p class="atribuicao">
    Dados e imagens fornecidos pela
    <a href="https://www.themoviedb.org" target="_blank" rel="noopener">TMDB</a>.
    Este produto usa a API da TMDB, mas não é endossado nem certificado pela TMDB.
  </p>
</footer>
</template>

<style scoped>

.autor {
  margin-top: 0.5rem;
  font-size: 0.85rem;
}
.autor a {
  font-weight: 600;
}


.rodape {
  margin-top: 5rem;
  padding: 2rem 0 2.5rem;
  text-align: center;
  border-top: 1px solid var(--borda-vidro);
  color: var(--texto-suave);
  font-size: 0.9rem;
}
.marca {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--texto);
  font-weight: 600;
}
.atribuicao {
  font-size: 0.8rem;
  margin-top: 0.5rem;
}
.rodape a {
  color: var(--laranja);
}
</style>
