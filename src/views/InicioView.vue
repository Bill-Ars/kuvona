<template>
  <section class="heroi">
    <h1>Bem-vindo ao <span class="destaque">Kuvona</span></h1>
    <p>
      <em>Ku vona</em> quer dizer <strong>"ver"</strong> em Changana. Descobre o
      filme certo para o teu fim-de-semana, estejas em Maputo, na Beira, em
      Nampula, ou em qualquer parte do mundo.
    </p>
    <RouterLink :to="{ name: 'filmes' }" class="botao">Explorar filmes →</RouterLink>
  </section>
</template>

<style scoped>
.heroi {
  text-align: center;
  padding: 4rem 1rem;
}
.heroi h1 {
  font-size: clamp(2rem, 5vw, 3.2rem);
  margin-bottom: 1rem;
}
.destaque {
  color: var(--cor-amarelo);
}
.heroi p {
  max-width: 560px;
  margin: 0 auto 2rem;
  color: var(--cor-texto-suave);
}
</style>