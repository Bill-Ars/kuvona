<script setup>
import { Clapperboard, FolderGit2, BriefcaseBusiness } from "@lucide/vue";
import BarraNavegacao from "@/components/BarraNavegacao.vue";

// Links externos do autor (usam <a href>, porque saem da app)
const ligacoesAutor = [
  { texto: "GitHub", url: "https://github.com/Bill-Ars", icone: FolderGit2 },
  { texto: "Portfólio", url: "https://portfolio-v2-x01e.onrender.com/", icone: BriefcaseBusiness },
];
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
      Desenvolvido por <strong>Bill Arsénio Ndayisaba</strong> · LECC31 · ISUTC ·
      {{ new Date().getFullYear() }}
    </p>

    <ul class="ligacoes-autor">
      <li v-for="l in ligacoesAutor" :key="l.texto">
        <a :href="l.url" target="_blank" rel="noopener">
          <component :is="l.icone" :size="15" />
          {{ l.texto }}
        </a>
      </li>
    </ul>

    <p class="atribuicao">
      Dados e imagens fornecidos pela
      <a href="https://www.themoviedb.org" target="_blank" rel="noopener">TMDB</a>.
      Este produto usa a API da TMDB, mas não é endossado nem certificado pela TMDB.
    </p>
  </footer>
</template>

<style scoped>
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
.autor {
  margin-top: 0.5rem;
  font-size: 0.85rem;
}
.autor strong {
  color: var(--texto);
}

/* GitHub e Portfólio: cápsulas de vidro */
.ligacoes-autor {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin: 1rem 0;
}
.ligacoes-autor a {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 1rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--texto);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.03));
  border: 1px solid var(--borda-vidro);
  box-shadow: var(--reflexo);
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
}
.ligacoes-autor a:hover {
  transform: translateY(-2px);
  border-color: rgba(157, 107, 255, 0.5);
  box-shadow: var(--reflexo), 0 8px 20px -8px rgba(157, 107, 255, 0.6);
}
.ligacoes-autor svg {
  color: var(--violeta);
}

.atribuicao {
  font-size: 0.8rem;
  margin-top: 0.5rem;
}
.atribuicao a {
  color: var(--laranja);
}
</style>
