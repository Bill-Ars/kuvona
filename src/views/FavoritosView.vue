<script setup>
import { Heart } from "@lucide/vue";
</script>

<template>
  <section>
    <h1>Os meus favoritos</h1>
    <div class="vazio vidro">
      <Heart :size="36" :stroke-width="1.5" class="icone" />
      <p>Ainda não tens favoritos. (Vamos construir isto no passo 7.)</p>
    </div>
  </section>
</template>

<style scoped>
.vazio {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding: 3rem 1.5rem;
  border-radius: var(--raio-grande);
  text-align: center;
  color: var(--texto-suave);
}
.icone {
  color: var(--violeta);
}
</style>
