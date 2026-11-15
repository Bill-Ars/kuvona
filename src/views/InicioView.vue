<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import {
  Search,
  ArrowRight,
  Flame,
  Shuffle,
  Star,
  Swords,
  Laugh,
  WandSparkles,
  Drama,
  Ghost,
  Rocket,
  HeartHandshake,
  Baby,
  LoaderCircle,
  RotateCcw,
  ChevronRight,
} from "@lucide/vue";
import CartaoFilme from "@/components/CartaoFilme.vue";
import { useInicio } from "@/composables/useInicio";
import { urlImagem } from "@/services/tmdb";
import { ano, nota } from "@/utils/formatacao";

const router = useRouter();

const {
  tendencias,
  aCarregarTendencias,
  erroTendencias,
  carregarTendencias,
  sugestao,
  aCarregarSugestao,
  erroSugestao,
  novaSugestao,
} = useInicio();

// Pesquisa rápida: leva para /filmes?q=...
const textoPesquisa = ref("");
function pesquisar() {
  const q = textoPesquisa.value.trim();
  router.push({ name: "filmes", query: q ? { q } : {} });
}

const fundoSugestao = computed(() => urlImagem(sugestao.value?.backdrop_path, "w1280"));

// Atalhos de género (os ids são os da TMDB)
const atalhosGenero = [
  { id: 28, nome: "Acção", icone: Swords },
  { id: 35, nome: "Comédia", icone: Laugh },
  { id: 16, nome: "Animação", icone: WandSparkles },
  { id: 18, nome: "Drama", icone: Drama },
  { id: 27, nome: "Terror", icone: Ghost },
  { id: 878, nome: "Ficção científica", icone: Rocket },
  { id: 10749, nome: "Romance", icone: HeartHandshake },
  { id: 10751, nome: "Família", icone: Baby },
];
</script>

<template>
  <!-- ===== Topo ===== -->
  <section class="heroi">
    <div class="rasto" aria-hidden="true"></div>

    <p class="etiqueta vidro">Ku vona · "ver" em Changana</p>
    <h1>Bem-vindo ao <span class="texto-gradiente">Kuvona</span></h1>
    <p class="introducao">
      Descobre o filme certo para o teu fim-de-semana, estejas em Maputo, na Beira, em
      Nampula, ou em qualquer parte do mundo.
    </p>

    <!-- @submit.prevent: impede o formulário de recarregar a página -->
    <form class="pesquisa-rapida vidro" role="search" @submit.prevent="pesquisar">
      <Search :size="20" class="icone" />
      <input
        v-model="textoPesquisa"
        type="search"
        placeholder="Que filme queres ver hoje?"
        aria-label="Pesquisar filmes"
      />
      <button type="submit" class="botao">
        Pesquisar
        <ArrowRight :size="16" />
      </button>
    </form>
  </section>

  <!-- ===== Em alta esta semana ===== -->
  <section class="bloco">
    <div class="cabecalho-bloco">
      <h2 class="titulo-bloco">
        <span class="chip-icone laranja"><Flame :size="18" /></span>
        Em alta esta semana
      </h2>
      <RouterLink :to="{ name: 'filmes' }" class="ver-todos">
        Ver todos <ChevronRight :size="16" />
      </RouterLink>
    </div>

    <p v-if="aCarregarTendencias" class="estado">
      <LoaderCircle :size="20" class="a-rodar" /> A carregar...
    </p>
    <div v-else-if="erroTendencias" class="estado">
      <p>{{ erroTendencias }}</p>
      <button class="botao-secundario" @click="carregarTendencias">
        <RotateCcw :size="15" /> Tentar de novo
      </button>
    </div>
    <div v-else class="fila">
      <CartaoFilme v-for="filme in tendencias" :key="filme.id" :filme="filme" />
    </div>
  </section>

  <!-- ===== Cinema moçambicano + sugestão ===== -->
  <section class="bloco duas-colunas">
    <!-- Atalho em destaque: cinema moçambicano -->
    <RouterLink :to="{ name: 'filmes', query: { pais: 'MZ' } }" class="mocambique vidro">
      <div class="bandeira" aria-hidden="true"></div>
      <p class="etiqueta-pequena">Em destaque</p>
      <h2>Cinema moçambicano</h2>
      <p>
        De Licínio Azevedo a novas vozes: filmes feitos em Moçambique, que quase nenhuma app
        destaca.
      </p>
      <span class="ligacao-seta">Explorar <ArrowRight :size="16" /></span>
    </RouterLink>

    <!-- Sugestão para o fim-de-semana -->
    <div class="sugestao" :style="fundoSugestao ? { backgroundImage: `url(${fundoSugestao})` } : {}">
      <div class="sugestao-conteudo">
        <p class="etiqueta-pequena">Sugestão para o fim-de-semana</p>

        <p v-if="aCarregarSugestao && !sugestao" class="estado">
          <LoaderCircle :size="20" class="a-rodar" /> A escolher um filme...
        </p>
        <p v-else-if="erroSugestao" class="estado">{{ erroSugestao }}</p>

        <template v-if="sugestao">
          <h2>{{ sugestao.title }}</h2>
          <p class="meta">
            <span class="nota"><Star :size="14" fill="currentColor" /> {{ nota(sugestao.vote_average) }}</span>
            <span>{{ ano(sugestao.release_date) }}</span>
          </p>
          <p class="sinopse">{{ sugestao.overview }}</p>
        </template>

        <div class="accoes">
          <RouterLink
            v-if="sugestao"
            :to="{ name: 'filme', params: { id: sugestao.id } }"
            class="botao"
          >
            Ver detalhes
          </RouterLink>
          <button class="botao-secundario" :disabled="aCarregarSugestao" @click="novaSugestao">
            <Shuffle :size="15" :class="{ 'a-rodar': aCarregarSugestao }" />
            Outra sugestão
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== Atalhos de género ===== -->
  <section class="bloco">
    <h2 class="titulo-bloco">
      <span class="chip-icone"><WandSparkles :size="18" /></span>
      Explorar por género
    </h2>
    <ul class="generos">
      <li v-for="g in atalhosGenero" :key="g.id">
        <RouterLink :to="{ name: 'filmes', query: { genero: String(g.id) } }" class="vidro">
          <component :is="g.icone" :size="22" class="icone-genero" />
          {{ g.nome }}
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<style scoped>
/* ===== Topo ===== */
.heroi {
  position: relative;
  text-align: center;
  padding: 3.5rem 0 1rem;
}
.rasto {
  position: absolute;
  inset: 5% -10% auto;
  height: 260px;
  z-index: -1;
  background:
    radial-gradient(ellipse 40% 30% at 30% 60%, rgba(255, 138, 61, 0.35), transparent 70%),
    radial-gradient(ellipse 40% 30% at 70% 40%, rgba(63, 167, 255, 0.3), transparent 70%);
  filter: blur(30px);
}
.etiqueta {
  display: inline-block;
  padding: 0.35rem 1rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--texto-suave);
  margin-bottom: 1.5rem;
}
.heroi h1 {
  font-size: clamp(2.4rem, 7vw, 4.2rem);
  margin-bottom: 1.1rem;
}
.introducao {
  max-width: 560px;
  margin: 0 auto 2rem;
  color: var(--texto-suave);
  font-size: 1.05rem;
}
.pesquisa-rapida {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  max-width: 620px;
  margin: 0 auto;
  padding: 0.4rem 0.4rem 0.4rem 1.25rem;
  border-radius: 999px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.pesquisa-rapida:focus-within {
  border-color: rgba(157, 107, 255, 0.6);
  box-shadow: var(--reflexo), 0 0 0 4px rgba(157, 107, 255, 0.15);
}
.pesquisa-rapida .icone {
  color: var(--texto-suave);
}
.pesquisa-rapida input {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  color: var(--texto);
  font-family: inherit;
  font-size: 1rem;
}
.pesquisa-rapida input::-webkit-search-cancel-button {
  display: none;
}

/* ===== Blocos ===== */
.bloco {
  margin-top: 3.5rem;
}
.cabecalho-bloco {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.titulo-bloco {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1.35rem;
  margin-bottom: 1.1rem;
}
.ver-todos {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.9rem;
  color: var(--texto-suave);
  margin-bottom: 1.1rem;
}
.ver-todos:hover {
  color: var(--texto);
}
.chip-icone {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  color: #fff;
  background:
    linear-gradient(160deg, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0) 50%),
    linear-gradient(160deg, #b18aff, #6a3df0);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -4px 10px rgba(40, 10, 120, 0.5),
    0 8px 20px -6px rgba(157, 107, 255, 0.7);
}
.chip-icone.laranja {
  background:
    linear-gradient(160deg, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0) 50%),
    linear-gradient(160deg, #ffad6b, #f0602a);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -4px 10px rgba(120, 40, 10, 0.5),
    0 8px 20px -6px rgba(255, 138, 61, 0.7);
}
.estado {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
  color: var(--texto-suave);
  padding: 1rem 0;
}

/* Fila horizontal de cartões */
.fila {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 170px;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.5rem 0.25rem 1rem;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}
.fila > * {
  scroll-snap-align: start;
}

/* ===== Duas colunas: Moçambique + sugestão ===== */
.duas-colunas {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr);
  gap: 1.25rem;
}
.etiqueta-pequena {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--laranja);
  margin-bottom: 0.5rem;
}
.mocambique {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1.75rem;
  border-radius: var(--raio-grande);
  overflow: hidden;
  transition: transform 0.25s, border-color 0.25s;
}
.mocambique:hover {
  transform: translateY(-4px);
  border-color: rgba(252, 209, 22, 0.4);
}
/* Brilhos com as cores da bandeira */
.mocambique::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(circle at 0% 0%, rgba(0, 154, 68, 0.35), transparent 55%),
    radial-gradient(circle at 100% 100%, rgba(210, 16, 52, 0.3), transparent 55%),
    radial-gradient(circle at 100% 0%, rgba(252, 209, 22, 0.18), transparent 50%);
}
.bandeira {
  width: 56px;
  height: 6px;
  border-radius: 999px;
  margin-bottom: 1.25rem;
  background: linear-gradient(to right, #009a44 0 33%, #fcd116 33% 66%, #d21034 66%);
  box-shadow: 0 0 12px rgba(252, 209, 22, 0.4);
}
.mocambique h2 {
  font-size: 1.6rem;
  margin-bottom: 0.6rem;
}
.mocambique p:not(.etiqueta-pequena) {
  color: var(--texto-suave);
  flex: 1;
}
.ligacao-seta {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 1.25rem;
  font-weight: 600;
  color: #fcd116;
}

.sugestao {
  position: relative;
  border-radius: var(--raio-grande);
  overflow: hidden;
  min-height: 300px;
  background-color: var(--fundo-elevado);
  background-size: cover;
  background-position: center;
  border: 1px solid var(--borda-vidro);
  box-shadow: var(--reflexo), 0 30px 60px -30px rgba(63, 167, 255, 0.45);
}
.sugestao::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to right, rgba(6, 7, 12, 0.95) 35%, rgba(6, 7, 12, 0.5)),
    linear-gradient(to top, rgba(6, 7, 12, 0.85), transparent 60%);
}
.sugestao-conteudo {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.75rem;
  max-width: 560px;
}
.sugestao h2 {
  font-size: 1.7rem;
}
.meta {
  display: flex;
  gap: 0.75rem;
  margin: 0.5rem 0 0.75rem;
  color: var(--texto-suave);
  font-size: 0.9rem;
}
.meta .nota {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  color: #ffc46b;
  font-weight: 700;
}
.sinopse {
  color: #d2d4e0;
  font-size: 0.95rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.accoes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 1.25rem;
}
.accoes .botao-secundario:disabled {
  opacity: 0.6;
  cursor: wait;
}

/* ===== Géneros ===== */
.generos {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
}
.generos a {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 1rem 1.1rem;
  border-radius: var(--raio);
  font-weight: 600;
  font-size: 0.95rem;
  transition: transform 0.2s, border-color 0.2s;
}
.generos a:hover {
  transform: translateY(-3px);
  border-color: rgba(157, 107, 255, 0.5);
}
.icone-genero {
  color: var(--violeta);
}

/* ===== Telemóvel ===== */
@media (max-width: 760px) {
  .duas-colunas {
    grid-template-columns: 1fr;
  }
  .pesquisa-rapida .botao {
    padding: 0.7rem 1rem;
  }
}
@media (max-width: 420px) {
  .pesquisa-rapida .botao {
    font-size: 0;
    gap: 0;
  }
}
</style>
