<script setup>
const nomeApp = "Kuvona";
const slogan = "O teu cinema, de qualquer canto!";
</script>

<template>
  <header>
    <h1>🎬 {{ nomeApp }}</h1>
    <p>{{ slogan }}</p>
  </header>
</template>

<style scoped>
header {
  text-align: center;
  padding: 2rem;
  font-family: system-ui, sans-serif;
}
</style>