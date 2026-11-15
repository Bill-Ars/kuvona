<script setup>
import { computed } from "vue";
import { useGeneros } from "@/composables/useGeneros";

const props = defineProps({
  filtros: { type: Object, required: true }, // { genero, ano, notaMin, pais, ordem }
  comPesquisa: { type: Boolean, default: false },
});
const emit = defineEmits(["mudar", "limpar"]);

const { generos } = useGeneros();

// Anos: deste ano até 1950
const anoActual = new Date().getFullYear();
const anos = Array.from({ length: anoActual - 1949 }, (_, i) => anoActual - i);

const notas = [
  { valor: "", texto: "Qualquer nota" },
  { valor: "5", texto: "⭐ 5 ou mais" },
  { valor: "6", texto: "⭐ 6 ou mais" },
  { valor: "7", texto: "⭐ 7 ou mais" },
  { valor: "8", texto: "⭐ 8 ou mais" },
];

const paises = [
  { valor: "", texto: "Todos os países" },
  { valor: "MZ", texto: "🇲🇿 Moçambique" },
  { valor: "AO", texto: "🇦🇴 Angola" },
  { valor: "ZA", texto: "🇿🇦 África do Sul" },
  { valor: "NG", texto: "🇳🇬 Nigéria (Nollywood)" },
  { valor: "BR", texto: "🇧🇷 Brasil" },
  { valor: "PT", texto: "🇵🇹 Portugal" },
  { valor: "US", texto: "🇺🇸 Estados Unidos" },
  { valor: "IN", texto: "🇮🇳 Índia (Bollywood)" },
];

const ordens = [
  { valor: "", texto: "Mais populares" },
  { valor: "vote_average.desc", texto: "Melhor classificados" },
  { valor: "primary_release_date.desc", texto: "Mais recentes" },
  { valor: "revenue.desc", texto: "Maiores bilheteiras" },
];

// Há algum filtro activo? (para mostrar o botão "Limpar")
const temFiltros = computed(() => Object.values(props.filtros).some((v) => v));

// Avisa o pai: { genero: "16" }, { ano: "2024" }...
function mudar(campo, evento) {
  emit("mudar", { [campo]: evento.target.value });
}
</script>

<template>
  <div class="filtros">
    <label>
      <span>Género</span>
      <!-- :key força o select a redesenhar quando a lista de géneros chega da API -->
      <select :key="generos.length" :value="filtros.genero" @change="mudar('genero', $event)">
        <option value="">Todos os géneros</option>
        <option v-for="g in generos" :key="g.id" :value="String(g.id)">
          {{ g.name }}
        </option>
      </select>
    </label>

    <label>
      <span>Ano</span>
      <select :value="filtros.ano" @change="mudar('ano', $event)">
        <option value="">Todos os anos</option>
        <option v-for="a in anos" :key="a" :value="String(a)">{{ a }}</option>
      </select>
    </label>

    <label>
      <span>Classificação</span>
      <select :value="filtros.notaMin" @change="mudar('notaMin', $event)">
        <option v-for="n in notas" :key="n.valor" :value="n.valor">{{ n.texto }}</option>
      </select>
    </label>

    <!-- A pesquisa por texto da TMDB não aceita país nem ordem -->
    <label :class="{ desactivado: comPesquisa }">
      <span>País de origem</span>
      <select :value="filtros.pais" :disabled="comPesquisa" @change="mudar('pais', $event)">
        <option v-for="p in paises" :key="p.valor" :value="p.valor">{{ p.texto }}</option>
      </select>
    </label>

    <label :class="{ desactivado: comPesquisa }">
      <span>Ordenar por</span>
      <select :value="filtros.ordem" :disabled="comPesquisa" @change="mudar('ordem', $event)">
        <option v-for="o in ordens" :key="o.valor" :value="o.valor">{{ o.texto }}</option>
      </select>
    </label>

    <button v-if="temFiltros" class="botao-secundario limpar" @click="emit('limpar')">
      ✕ Limpar filtros
    </button>
  </div>

  <p v-if="comPesquisa" class="nota-pesquisa">
    Durante a pesquisa por nome, o país e a ordem não estão disponíveis.
  </p>
</template>

<style scoped>
.filtros {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: flex-end;
  margin-bottom: 0.5rem;
}
label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1 1 150px;
}
label span {
  font-size: 0.8rem;
  color: var(--cor-texto-suave);
}
select {
  background: var(--cor-cartao);
  color: var(--cor-texto);
  border: 1px solid var(--cor-borda);
  border-radius: 8px;
  padding: 0.55rem 0.6rem;
  font-size: 0.95rem;
  cursor: pointer;
}
select:focus {
  outline: none;
  border-color: var(--cor-amarelo);
}
.desactivado {
  opacity: 0.45;
}
.limpar {
  margin-bottom: 0;
  flex: 0 0 auto;
}
.nota-pesquisa {
  font-size: 0.8rem;
  color: var(--cor-texto-suave);
}
</style>