<script setup>
import { computed } from "vue";
import { Tags, CalendarDays, Star, Earth, ArrowUpDown, RotateCcw, Info } from "@lucide/vue";
import SeletorVidro from "@/components/SeletorVidro.vue";
import { useGeneros } from "@/composables/useGeneros";

const props = defineProps({
  filtros: { type: Object, required: true }, // { genero, ano, notaMin, pais, ordem }
  comPesquisa: { type: Boolean, default: false },
});
const emit = defineEmits(["mudar", "limpar"]);

const { generos } = useGeneros();

// Géneros: a lista chega da API, por isso é um computed
const opcoesGenero = computed(() => [
  { valor: "", texto: "Todos os géneros" },
  ...generos.value.map((g) => ({ valor: String(g.id), texto: g.name })),
]);

// Anos: deste ano até 1950
const anoActual = new Date().getFullYear();
const opcoesAno = [
  { valor: "", texto: "Todos os anos" },
  ...Array.from({ length: anoActual - 1949 }, (_, i) => {
    const a = String(anoActual - i);
    return { valor: a, texto: a };
  }),
];

const opcoesNota = [
  { valor: "", texto: "Qualquer nota" },
  ...[5, 6, 7, 8].map((n) => ({ valor: String(n), texto: `${n} ou mais`, estrela: true })),
];

const opcoesPais = [
  { valor: "", texto: "Todos os países" },
  { valor: "MZ", codigo: "MZ", texto: "Moçambique" },
  { valor: "AO", codigo: "AO", texto: "Angola" },
  { valor: "ZA", codigo: "ZA", texto: "África do Sul" },
  { valor: "NG", codigo: "NG", texto: "Nigéria (Nollywood)" },
  { valor: "BR", codigo: "BR", texto: "Brasil" },
  { valor: "PT", codigo: "PT", texto: "Portugal" },
  { valor: "US", codigo: "US", texto: "Estados Unidos" },
  { valor: "IN", codigo: "IN", texto: "Índia (Bollywood)" },
];

const opcoesOrdem = [
  { valor: "", texto: "Mais populares" },
  { valor: "vote_average.desc", texto: "Melhor classificados" },
  { valor: "primary_release_date.desc", texto: "Mais recentes" },
  { valor: "revenue.desc", texto: "Maiores bilheteiras" },
];

// Há algum filtro activo? (para mostrar o botão "Limpar")
const temFiltros = computed(() => Object.values(props.filtros).some((v) => v));

// Avisa o pai: { genero: "16" }, { ano: "2024" }...
function mudar(campo, valor) {
  emit("mudar", { [campo]: valor });
}
</script>

<template>
  <div class="painel vidro">
    <div class="filtros">
      <SeletorVidro
        rotulo="Género"
        :icone="Tags"
        :valor="filtros.genero"
        :opcoes="opcoesGenero"
        @mudar="mudar('genero', $event)"
      />
      <SeletorVidro
        rotulo="Ano"
        :icone="CalendarDays"
        :valor="filtros.ano"
        :opcoes="opcoesAno"
        @mudar="mudar('ano', $event)"
      />
      <SeletorVidro
        rotulo="Classificação"
        :icone="Star"
        :valor="filtros.notaMin"
        :opcoes="opcoesNota"
        @mudar="mudar('notaMin', $event)"
      />
      <!-- A pesquisa por texto da TMDB não aceita país nem ordem -->
      <SeletorVidro
        rotulo="País de origem"
        :icone="Earth"
        :valor="filtros.pais"
        :opcoes="opcoesPais"
        :desactivado="comPesquisa"
        @mudar="mudar('pais', $event)"
      />
      <SeletorVidro
        rotulo="Ordenar por"
        :icone="ArrowUpDown"
        :valor="filtros.ordem"
        :opcoes="opcoesOrdem"
        :desactivado="comPesquisa"
        @mudar="mudar('ordem', $event)"
      />

      <button v-if="temFiltros" class="botao-secundario limpar" @click="emit('limpar')">
        <RotateCcw :size="15" />
        Limpar
      </button>
    </div>

    <p v-if="comPesquisa" class="nota-pesquisa">
      <Info :size="14" />
      Durante a pesquisa por nome, o país e a ordem não estão disponíveis.
    </p>
  </div>
</template>

<style scoped>
.painel {
  position: relative;
  z-index: 5; /* a lista aberta fica por cima da grelha */
  border-radius: var(--raio-grande);
  padding: 1rem 1.1rem;
}
.filtros {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: flex-end;
}
.limpar {
  flex: 0 0 auto;
  padding-block: 0.7rem;
}
.nota-pesquisa {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: var(--texto-suave);
}
</style>
