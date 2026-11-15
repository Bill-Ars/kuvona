<template>
  <section class="vazio">
    <h1>Eish! Página não encontrada 🎞️</h1>
    <p>Este filme não está em cartaz. Volta ao início e escolhe outro.</p>
    <RouterLink to="/" class="botao">Voltar ao início</RouterLink>
  </section>
</template>

<style scoped>
.vazio {
  text-align: center;
  padding: 4rem 1rem;
}
.vazio p {
  color: var(--cor-texto-suave);
  margin-bottom: 1.5rem;
}
</style>