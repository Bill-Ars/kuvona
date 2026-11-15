<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  ArrowLeft,
  Star,
  CalendarDays,
  Clock,
  Play,
  X,
  MonitorPlay,
  Users,
  Sparkles,
  ExternalLink,
  User,
  Clapperboard,
  LoaderCircle,
  CircleExclamationPoint,
  RotateCcw,
  Search,
} from "@lucide/vue";
import { outrasFontes } from "@/utils/plataformas";
import { useFilme } from "@/composables/useFilme";
import { urlImagem } from "@/services/tmdb";
import { ano, nota, duracao, dataPorExtenso } from "@/utils/formatacao";
import CartaoFilme from "@/components/CartaoFilme.vue";
import ListaPlataformas from "@/components/ListaPlataformas.vue";
import BotaoFavorito from "@/components/BotaoFavorito.vue";

const route = useRoute();
const router = useRouter();

// O id vem do URL: #/filme/550 → "550"
const id = computed(() => route.params.id);

const { filme, aCarregar, erro, carregar, elenco, realizador, trailer, ondeVer, recomendacoes } =
  useFilme(id);

const fundo = computed(() => urlImagem(filme.value?.backdrop_path, "w1280"));
const poster = computed(() => urlImagem(filme.value?.poster_path, "w500"));

// Links de pesquisa: Netflix, YouTube, Prime Video e Google.
// Usa o título original, que as plataformas encontram melhor
const fontes = computed(() =>
  filme.value ? outrasFontes(filme.value.original_title, filme.value.release_date?.slice(0, 4)) : []
);

// O trailer só carrega quando se carrega no botão (poupa dados móveis)
const verTrailer = ref(false);
watch(id, () => (verTrailer.value = false)); // fecha o trailer ao mudar de filme

// Se o filme foi aberto por um link directo, não há página para onde "voltar"
function voltar() {
  if (window.history.state?.back) router.back();
  else router.push({ name: "filmes" });
}
</script>

<template>
  <div>
    <button class="botao-secundario voltar" @click="voltar">
      <ArrowLeft :size="16" />
      Voltar
    </button>

    <!-- A carregar -->
    <p v-if="aCarregar" class="estado">
      <LoaderCircle :size="22" class="a-rodar" />
      A carregar o filme...
    </p>

    <!-- Erro -->
    <div v-else-if="erro" class="estado erro vidro">
      <CircleExclamationPoint :size="36" :stroke-width="1.5" />
      <p>{{ erro }}</p>
      <button class="botao" @click="carregar">
        <RotateCcw :size="16" />
        Tentar de novo
      </button>
    </div>

    <!-- Sucesso -->
    <article v-else-if="filme">
      <!-- ===== Topo com a imagem de fundo ===== -->
      <header class="heroi" :style="fundo ? { backgroundImage: `url(${fundo})` } : {}">
        <div class="heroi-conteudo">
          <div class="poster-moldura">
            <img v-if="poster" :src="poster" :alt="filme.title" class="poster" />
            <div v-else class="poster sem-poster"><Clapperboard :size="48" :stroke-width="1.25" /></div>
          </div>

          <div class="dados">
            <h1>
              {{ filme.title }}
              <span class="ano">{{ ano(filme.release_date) }}</span>
            </h1>
            <p v-if="filme.original_title !== filme.title" class="original">
              Título original: {{ filme.original_title }}
            </p>

            <ul class="meta">
              <li class="nota">
                <Star :size="15" fill="currentColor" />
                {{ nota(filme.vote_average) }}
              </li>
              <li>
                <CalendarDays :size="15" />
                {{ dataPorExtenso(filme.release_date) }}
              </li>
              <li v-if="filme.runtime">
                <Clock :size="15" />
                {{ duracao(filme.runtime) }}
              </li>
            </ul>

            <!-- Géneros clicáveis: levam à lista filtrada -->
            <ul class="generos">
              <li v-for="g in filme.genres" :key="g.id">
                <RouterLink :to="{ name: 'filmes', query: { genero: String(g.id) } }">
                  {{ g.name }}
                </RouterLink>
              </li>
            </ul>

            <p v-if="filme.tagline" class="tagline">“{{ filme.tagline }}”</p>

            <h2>Sinopse</h2>
            <p class="sinopse">
              {{ filme.overview || "Sinopse ainda não disponível em português." }}
            </p>

            <p v-if="realizador" class="realizador">
              <Clapperboard :size="15" />
              Realização: <strong>{{ realizador }}</strong>
            </p>

            <div class="accoes">
              <button v-if="trailer && !verTrailer" class="botao" @click="verTrailer = true">
                <Play :size="16" fill="currentColor" />
                Ver trailer
              </button>
              <BotaoFavorito :filme="filme" variante="completo" />
            </div>
          </div>
        </div>
      </header>

      <!-- ===== Trailer ===== -->
      <section v-if="verTrailer && trailer" class="bloco">
        <div class="video vidro">
          <iframe
            :src="`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1`"
            :title="trailer.name"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
        <button class="botao-secundario fechar-trailer" @click="verTrailer = false">
          <X :size="15" />
          Fechar trailer
        </button>
      </section>

      <!-- ===== Onde ver ===== -->
      <section class="bloco">
        <h2 class="titulo-bloco">
          <span class="chip-icone"><MonitorPlay :size="18" /></span>
          Onde ver
        </h2>
        <div v-if="ondeVer" class="cartao-bloco vidro">
          <p class="aviso-pais">
            <template v-if="ondeVer.eMocambique">Disponível em Moçambique:</template>
            <template v-else>
              Sem dados para Moçambique. Disponível em <strong>{{ ondeVer.pais }}</strong>
              (pode estar no mesmo serviço aqui):
            </template>
          </p>
          <ListaPlataformas
            titulo="Incluído na subscrição"
            :plataformas="ondeVer.subscricao"
            :titulo-filme="filme.original_title"
            :link-geral="ondeVer.link"
          />
          <ListaPlataformas
            titulo="Alugar"
            :plataformas="ondeVer.alugar"
            :titulo-filme="filme.original_title"
            :link-geral="ondeVer.link"
          />
          <ListaPlataformas
            titulo="Comprar"
            :plataformas="ondeVer.comprar"
            :titulo-filme="filme.original_title"
            :link-geral="ondeVer.link"
          />
          <p class="fonte">
            Dados de disponibilidade: JustWatch, via TMDB.
            <a :href="ondeVer.link" target="_blank" rel="noopener">
              Ver todas as opções <ExternalLink :size="13" />
            </a>
          </p>
        </div>
        <!-- Sem dados da TMDB: os botões de pesquisa passam a ser a resposta -->
        <div v-else class="cartao-bloco vidro">
          <p class="aviso-pais">
            Este filme ainda não tem plataformas indicadas (pode estar ainda no cinema).
            Procura-o directamente:
          </p>
          <ul class="lista-fontes">
            <li v-for="f in fontes" :key="f.nome">
              <a :href="f.link" target="_blank" rel="noopener" class="botao-secundario">
                <Search :size="14" />
                {{ f.nome }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Com dados: os botões de pesquisa ficam por baixo, como extra -->
        <div v-if="ondeVer" class="outras-fontes">
          <h4>Procurar noutras fontes</h4>
          <ul class="lista-fontes">
            <li v-for="f in fontes" :key="f.nome">
              <a :href="f.link" target="_blank" rel="noopener" class="botao-secundario">
                <Search :size="14" />
                {{ f.nome }}
              </a>
            </li>
          </ul>
        </div>
      </section>

      <!-- ===== Elenco ===== -->
      <section v-if="elenco.length" class="bloco">
        <h2 class="titulo-bloco">
          <span class="chip-icone"><Users :size="18" /></span>
          Elenco principal
        </h2>
        <ul class="elenco">
          <li v-for="actor in elenco" :key="actor.credit_id">
            <img
              v-if="actor.profile_path"
              :src="urlImagem(actor.profile_path, 'w185')"
              :alt="actor.name"
              loading="lazy"
            />
            <div v-else class="sem-foto"><User :size="34" :stroke-width="1.5" /></div>
            <strong>{{ actor.name }}</strong>
            <span>{{ actor.character }}</span>
          </li>
        </ul>
      </section>

      <!-- ===== Recomendações (reutiliza o CartaoFilme) ===== -->
      <section v-if="recomendacoes.length" class="bloco">
        <h2 class="titulo-bloco">
          <span class="chip-icone"><Sparkles :size="18" /></span>
          Se gostaste, vê também
        </h2>
        <div class="grelha">
          <CartaoFilme v-for="f in recomendacoes" :key="f.id" :filme="f" />
        </div>
      </section>
    </article>
  </div>
</template>

<style scoped>
.voltar {
  margin-bottom: 1.25rem;
}
.estado {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
  padding: 3rem 1rem;
  color: var(--texto-suave);
}
.estado.erro {
  border-radius: var(--raio-grande);
  border-color: rgba(255, 93, 115, 0.4);
  color: var(--texto);
}
.estado.erro svg {
  color: var(--perigo);
}

/* ===== Topo ===== */
.heroi {
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  background-color: var(--fundo-elevado);
  background-size: cover;
  background-position: center top;
  border: 1px solid var(--borda-vidro);
  box-shadow: var(--reflexo), 0 40px 80px -40px rgba(157, 107, 255, 0.45);
}
/* Escurece a imagem de fundo para o texto se ler bem */
.heroi::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to right, rgba(6, 7, 12, 0.96) 30%, rgba(6, 7, 12, 0.65)),
    linear-gradient(to top, rgba(6, 7, 12, 0.9), transparent 50%);
}
.heroi-conteudo {
  position: relative;
  display: flex;
  gap: 2.5rem;
  padding: 2.5rem;
}
/* Póster numa moldura de vidro */
.poster-moldura {
  flex-shrink: 0;
  align-self: flex-start;
  padding: 0.5rem;
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.03));
  border: 1px solid var(--borda-vidro-forte);
  box-shadow: var(--reflexo), 0 30px 60px -20px rgba(0, 0, 0, 0.9);
}
.poster {
  width: 260px;
  border-radius: 16px;
}
.sem-poster {
  display: grid;
  place-items: center;
  aspect-ratio: 2 / 3;
  background: var(--fundo-elevado);
  color: var(--texto-suave);
}
.dados {
  min-width: 0;
}
.dados h1 {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
}
.ano {
  font-weight: 500;
  color: var(--texto-suave);
}
.original {
  color: var(--texto-suave);
  font-size: 0.9rem;
}
.meta,
.generos {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.meta {
  margin: 1.1rem 0 0.9rem;
}
.meta li {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.88rem;
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--borda-vidro);
}
.meta .nota {
  color: #ffc46b;
  font-weight: 700;
}
.generos a {
  display: inline-block;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0.25rem 0.8rem;
  border-radius: 999px;
  color: #d9c8ff;
  background: rgba(157, 107, 255, 0.14);
  border: 1px solid rgba(157, 107, 255, 0.35);
  transition: background 0.2s;
}
.generos a:hover {
  background: rgba(157, 107, 255, 0.28);
}
.tagline {
  margin-top: 1.1rem;
  font-style: italic;
  color: var(--laranja);
}
.dados h2 {
  font-size: 1.1rem;
  margin: 1.25rem 0 0.4rem;
}
.sinopse {
  max-width: 68ch;
  color: #d2d4e0;
}
.realizador {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: 1rem;
  color: var(--texto-suave);
}
.realizador strong {
  color: var(--texto);
}
.accoes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

/* ===== Blocos ===== */
.bloco {
  margin-top: 3rem;
}
.titulo-bloco {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1.35rem;
  margin-bottom: 1.1rem;
}
/* Ícone em "vidro violeta", como os ícones da referência */
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
.cartao-bloco {
  border-radius: var(--raio-grande);
  padding: 1.5rem;
}
.aviso-pais {
  margin-bottom: 1.1rem;
  color: var(--texto-suave);
}
.aviso-pais strong {
  color: var(--texto);
}
.fonte {
  margin-top: 1.25rem;
  font-size: 0.8rem;
  color: var(--texto-suave);
}
.fonte a {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--laranja);
  margin-left: 0.25rem;
}
.texto-suave {
  color: var(--texto-suave);
}
.outras-fontes {
  margin-top: 1.25rem;
}
.outras-fontes h4 {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--texto-suave);
  margin-bottom: 0.6rem;
}
.lista-fontes {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}
.lista-fontes a {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

/* Trailer: vídeo 16:9 numa moldura de vidro */
.video {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: var(--raio-grande);
  overflow: hidden;
  padding: 0;
}
.video iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
.fechar-trailer {
  margin-top: 0.85rem;
}

/* Elenco: fila horizontal com scroll */
.elenco {
  list-style: none;
  padding: 0 0 0.75rem;
  display: flex;
  gap: 0.9rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}
.elenco li {
  flex: 0 0 130px;
  scroll-snap-align: start;
  padding: 0.45rem;
  border-radius: 18px;
  background: linear-gradient(180deg, var(--vidro-forte), var(--vidro));
  border: 1px solid var(--borda-vidro);
  box-shadow: var(--reflexo);
}
.elenco img,
.sem-foto {
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border-radius: 13px;
  margin-bottom: 0.5rem;
}
.sem-foto {
  display: grid;
  place-items: center;
  background: var(--fundo-elevado);
  color: var(--texto-suave);
}
.elenco strong,
.elenco span {
  display: block;
  padding-inline: 0.25rem;
  line-height: 1.3;
}
.elenco strong {
  font-size: 0.85rem;
}
.elenco span {
  font-size: 0.78rem;
  color: var(--texto-suave);
  padding-bottom: 0.3rem;
}

.grelha {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1.1rem;
}

/* ===== Telemóvel: póster por cima do texto ===== */
@media (max-width: 720px) {
  .heroi-conteudo {
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.25rem;
  }
  .poster {
    width: 170px;
  }
  .heroi::before {
    background: linear-gradient(to bottom, rgba(6, 7, 12, 0.75), rgba(6, 7, 12, 0.97) 45%);
  }
}
</style>
