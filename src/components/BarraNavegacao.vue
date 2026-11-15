<template>
  <header class="barra">
    <nav class="contentor nav">
      <RouterLink to="/" class="logo">🎬 Kuvona</RouterLink>

      <div class="ligacoes">
        <RouterLink to="/">Início</RouterLink>
        <RouterLink :to="{ name: 'filmes' }">Filmes</RouterLink>
        <RouterLink :to="{ name: 'favoritos' }">Favoritos</RouterLink>
      </div>
    </nav>

    <!-- Faixa com as cores da bandeira, como uma capulana -->
    <div class="faixa-capulana"></div>
  </header>
</template>

<style scoped>
.barra {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--cor-fundo-barra);
  backdrop-filter: blur(8px);
}
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: 1rem;
  gap: 1rem;
  flex-wrap: wrap;
}
.logo {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--cor-amarelo);
}
.ligacoes {
  display: flex;
  gap: 0.5rem;
}
.ligacoes a {
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  color: var(--cor-texto);
}
.ligacoes a:hover {
  background: var(--cor-cartao);
}
/* O RouterLink da página actual recebe esta classe sozinho */
.ligacoes a.router-link-exact-active {
  background: var(--cor-vermelho);
  color: #fff;
}
.faixa-capulana {
  height: 5px;
  background: linear-gradient(
    to right,
    var(--cor-verde) 0 33%,
    #000 33% 40%,
    var(--cor-amarelo) 40% 60%,
    #000 60% 67%,
    var(--cor-vermelho) 67% 100%
  );
}
</style>