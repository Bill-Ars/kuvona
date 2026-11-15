import { ref, computed, watch } from "vue";
import { obterFilme } from "@/services/tmdb";

// Países onde procurar "onde ver", por ordem de preferência.
// A TMDB tem poucos dados de Moçambique, por isso usamos vizinhos.
const PAISES_ONDE_VER = [
  { codigo: "MZ", nome: "Moçambique" },
  { codigo: "ZA", nome: "África do Sul" },
  { codigo: "PT", nome: "Portugal" },
  { codigo: "BR", nome: "Brasil" },
  { codigo: "US", nome: "Estados Unidos" },
  { codigo: "GB", nome: "Reino Unido" },
];

// Para os outros países, o próprio browser traduz o código: "FR" → "França"
const nomesPaises = new Intl.DisplayNames(["pt"], { type: "region" });

// Um país só conta se tiver pelo menos uma plataforma
function temPlataformas(dados) {
  return Boolean(dados && (dados.flatrate || dados.rent || dados.buy));
}

// id: um computed com o id do filme que vem do URL
export function useFilme(id) {
  const filme = ref(null);
  const aCarregar = ref(false);
  const erro = ref("");

  // Conta os pedidos para ignorar respostas antigas
  // (clicar depressa em duas recomendações seguidas)
  let pedidoActual = 0;

  async function carregar() {
    const estePedido = ++pedidoActual;
    filme.value = null;

    // route.params.id chega sempre como texto: "550"
    if (!Number(id.value)) {
      erro.value = "Este endereço não corresponde a nenhum filme.";
      return;
    }
    aCarregar.value = true;
    erro.value = "";
    try {
      const dados = await obterFilme(id.value);
      if (estePedido === pedidoActual) filme.value = dados;
    } catch (e) {
      if (estePedido === pedidoActual) erro.value = e.message;
    } finally {
      if (estePedido === pedidoActual) aCarregar.value = false;
    }
  }

  // Ao clicar num filme recomendado, o Vue REUTILIZA esta página:
  // só o :id muda. Por isso observamos o id em vez de usar só o onMounted.
  watch(id, carregar, { immediate: true });

  // ===== Dados derivados (computed) =====

  // Os 12 actores principais
  const elenco = computed(() => filme.value?.credits?.cast.slice(0, 12) ?? []);

  // O realizador
  const realizador = computed(
    () => filme.value?.credits?.crew.find((p) => p.job === "Director")?.name ?? ""
  );

  // O trailer oficial no YouTube (de preferência em português)
  const trailer = computed(() => {
    const videos = (filme.value?.videos?.results ?? []).filter(
      (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
    );
    return videos.find((v) => v.iso_639_1 === "pt") ?? videos[0] ?? null;
  });

  // Onde ver: o primeiro país da lista que tenha dados.
  // Se nenhum tiver, usa qualquer outro país com plataformas.
  const ondeVer = computed(() => {
    const resultados = filme.value?.["watch/providers"]?.results ?? {};

    let codigo = PAISES_ONDE_VER.find((p) => temPlataformas(resultados[p.codigo]))?.codigo;
    if (!codigo) {
      codigo = Object.keys(resultados).find((c) => temPlataformas(resultados[c]));
    }
    if (!codigo) return null;

    const dados = resultados[codigo];
    const nomeConhecido = PAISES_ONDE_VER.find((p) => p.codigo === codigo)?.nome;
    return {
      pais: nomeConhecido ?? nomesPaises.of(codigo),
      eMocambique: codigo === "MZ",
      link: dados.link,
      subscricao: dados.flatrate ?? [],
      alugar: dados.rent ?? [],
      comprar: dados.buy ?? [],
    };
  });

  const recomendacoes = computed(
    () => filme.value?.recommendations?.results.slice(0, 12) ?? []
  );

  return { filme, aCarregar, erro, carregar, elenco, realizador, trailer, ondeVer, recomendacoes };
}
