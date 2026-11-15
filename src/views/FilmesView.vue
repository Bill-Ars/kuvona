<script setup>
import { onMounted } from "vue";
import CartaoFilme from "@/components/CartaoFilme.vue";
import { useFilmes } from "@/composables/useFilmes";

const { filmes, aCarregar, erro, temMais, carregar, carregarMais } = useFilmes();

// Pede os filmes quando a página aparece
onMounted(() => carregar());
</script>

<template>
  <section>
    <h1>Filmes em alta</h1>
    <p class="subtitulo">Os filmes mais vistos do momento, em todo o mundo.</p>

    <!-- Erro -->
    <div v-if="erro" class="aviso-erro">
      <p>😕 {{ erro }}</p>
      <button class="botao" @click="carregar()">Tentar de novo</button>
    </div>

    <!-- Sucesso: a grelha de cartões -->
    <div class="grelha">
      <CartaoFilme v-for="filme in filmes" :key="filme.id" :filme="filme" />
    </div>

    <!-- A carregar -->
    <p v-if="aCarregar" class="a-carregar">A carregar filmes...</p>

    <!-- Navegar pela lista: mais páginas -->
    <div v-if="temMais && !aCarregar && !erro" class="mais">
      <button class="botao" @click="carregarMais">Carregar mais filmes</button>
    </div>
  </section>
</template>

<style scoped>
.subtitulo {
  color: var(--cor-texto-suave);
  margin-bottom: 1.5rem;
}
.grelha {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1.25rem;
}
.a-carregar {
  text-align: center;
  padding: 2rem;
  color: var(--cor-texto-suave);
}
.aviso-erro {
  text-align: center;
  padding: 2rem;
  background: var(--cor-cartao);
  border: 1px solid var(--cor-vermelho);
  border-radius: var(--raio);
  margin-bottom: 1.5rem;
}
.aviso-erro p {
  margin-bottom: 1rem;
}
.mais {
  text-align: center;
  margin-top: 2rem;
}
</style>