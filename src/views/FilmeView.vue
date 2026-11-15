<script setup>
import { useRoute, useRouter } from "vue-router";

const route = useRoute();   // ler a rota actual (params, query)
const router = useRouter(); // mudar de rota (push, back)
</script>

<template>
  <section>
    <button class="botao-secundario" @click="router.back()">← Voltar</button>
    <h1>Detalhe do filme</h1>
    <p>O id deste filme é: <strong>{{ route.params.id }}</strong></p>
    <p>No passo 6 vamos pedir à TMDB os dados deste filme.</p>
  </section>
</template>