<template>
  <section>
    <h1>Filmes</h1>
    <p>Aqui vai aparecer a lista de filmes, com pesquisa e filtros (passos 3, 4 e 5).</p>

    <!-- Ligações de teste para a rota dinâmica /filme/:id -->
    <ul>
      <li><RouterLink :to="{ name: 'filme', params: { id: 550 } }">Filme 550</RouterLink></li>
      <li><RouterLink :to="{ name: 'filme', params: { id: 27205 } }">Filme 27205</RouterLink></li>
    </ul>
  </section>
</template>