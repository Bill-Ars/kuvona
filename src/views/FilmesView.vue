<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { CircleExclamationPoint, SearchX, LoaderCircle, RotateCcw } from "@lucide/vue";
import CartaoFilme from "@/components/CartaoFilme.vue";
import BarraPesquisa from "@/components/BarraPesquisa.vue";
import PainelFiltros from "@/components/PainelFiltros.vue";
import { useFilmes } from "@/composables/useFilmes";
import { useGeneros } from "@/composables/useGeneros";

const route = useRoute();
const router = useRouter();
const { nomeGenero } = useGeneros();

// Tudo vive no URL: #/filmes?q=matrix&genero=28&ano=1999&nota=7
const pesquisa = computed(() => route.query.q ?? "");
const filtros = computed(() => ({
  genero: route.query.genero ?? "",
  ano: route.query.ano ?? "",
  notaMin: route.query.nota ?? "",
  pais: route.query.pais ?? "",
  ordem: route.query.ordem ?? "",
}));

// Os critérios que o composable observa
const criterios = computed(() => ({ pesquisa: pesquisa.value, ...filtros.value }));

const { filmes, aCarregar, erro, temMais, totalResultados, carregar, carregarMais } =
  useFilmes(criterios);

// Tira do objecto os campos vazios, para o URL ficar limpo
function limparVazios(objecto) {
  return Object.fromEntries(Object.entries(objecto).filter(([, v]) => v));
}

// Nomes dos filtros no URL (notaMin aparece como "nota")
function paraQuery(f) {
  return limparVazios({
    genero: f.genero,
    ano: f.ano,
    nota: f.notaMin,
    pais: f.pais,
    ordem: f.ordem,
  });
}

// Pesquisa: replace (não enche o histórico enquanto se escreve)
function aoPesquisar(texto) {
  router.replace({
    name: "filmes",
    query: limparVazios({ ...route.query, q: texto }),
  });
}

// Filtros: push (o botão voltar desfaz o último filtro)
function aoMudarFiltros(novos) {
  router.push({
    name: "filmes",
    query: limparVazios({ q: pesquisa.value, ...paraQuery({ ...filtros.value, ...novos }) }),
  });
}

function aoLimparFiltros() {
  router.push({ name: "filmes", query: limparVazios({ q: pesquisa.value }) });
}

const temFiltros = computed(() => Object.values(filtros.value).some((v) => v));

const titulo = computed(() => {
  if (pesquisa.value) return `Resultados para "${pesquisa.value}"`;
  if (filtros.value.pais === "MZ") return "Cinema moçambicano";
  if (filtros.value.genero) return `Filmes de ${nomeGenero(filtros.value.genero)}`;
  if (temFiltros.value) return "Filmes filtrados";
  return "Filmes em alta";
});
</script>

<template>
  <section>
    <header class="topo">
      <p class="etiqueta">Explorar</p>
      <h1>{{ titulo }}</h1>
      <p class="subtitulo">
        <template v-if="!aCarregar && totalResultados !== null && (pesquisa || temFiltros)">
          {{ totalResultados.toLocaleString("pt-PT") }} filme(s) encontrado(s)
        </template>
        <template v-else-if="!pesquisa && !temFiltros">
          Os filmes mais vistos do momento, em todo o mundo.
        </template>
      </p>
    </header>

    <BarraPesquisa :valor="pesquisa" @pesquisar="aoPesquisar" />

    <PainelFiltros
      :filtros="filtros"
      :com-pesquisa="!!pesquisa"
      @mudar="aoMudarFiltros"
      @limpar="aoLimparFiltros"
    />

    <div class="espaco"></div>

    <!-- Erro -->
    <div v-if="erro" class="aviso vidro erro">
      <CircleExclamationPoint :size="36" :stroke-width="1.5" class="aviso-icone" />
      <p>{{ erro }}</p>
      <button class="botao" @click="carregar()">
        <RotateCcw :size="16" />
        Tentar de novo
      </button>
    </div>

    <!-- Sem resultados -->
    <div v-else-if="!aCarregar && filmes.length === 0" class="aviso vidro">
      <SearchX :size="36" :stroke-width="1.5" class="aviso-icone" />
      <p>Nenhum filme encontrado com estes critérios.</p>
      <p class="texto-suave">
        Experimenta tirar um filtro ou pesquisar o título original, em inglês.
      </p>
    </div>

    <!-- Sucesso: a grelha de cartões -->
    <div class="grelha">
      <CartaoFilme v-for="filme in filmes" :key="filme.id" :filme="filme" />
    </div>

    <!-- A carregar -->
    <p v-if="aCarregar" class="a-carregar">
      <LoaderCircle :size="20" class="a-rodar" />
      A carregar filmes...
    </p>

    <!-- Navegar pela lista: mais páginas -->
    <div v-if="temMais && !aCarregar && !erro" class="mais">
      <button class="botao" @click="carregarMais">Carregar mais filmes</button>
    </div>
  </section>
</template>

<style scoped>
.topo {
  margin-bottom: 1.75rem;
}
.etiqueta {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--laranja);
  margin-bottom: 0.35rem;
}
.subtitulo {
  color: var(--texto-suave);
  min-height: 1.6em;
}
.espaco {
  height: 2rem;
}
.grelha {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 1.1rem;
}
.a-carregar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 2.5rem;
  color: var(--texto-suave);
}
.aviso {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  padding: 2.5rem 1.5rem;
  border-radius: var(--raio-grande);
  margin-bottom: 1.5rem;
}
.aviso-icone {
  color: var(--violeta);
  margin-bottom: 0.25rem;
}
.aviso.erro {
  border-color: rgba(255, 93, 115, 0.4);
}
.aviso.erro .aviso-icone {
  color: var(--perigo);
}
.aviso .botao {
  margin-top: 0.75rem;
}
.texto-suave {
  color: var(--texto-suave);
  font-size: 0.9rem;
}
.mais {
  text-align: center;
  margin-top: 2.5rem;
}
</style>
