// ===== Links de pesquisa nas plataformas de streaming =====
// A TMDB diz EM QUE plataforma está o filme, mas não dá o link directo.
// Por isso abrimos a pesquisa da plataforma já com o título escrito.

const PESQUISAS = [
  { nomes: ["netflix"], url: (t) => `https://www.netflix.com/search?q=${t}` },
  { nomes: ["youtube"], url: (t) => `https://www.youtube.com/results?search_query=${t}` },
  { nomes: ["amazon", "prime video"], url: (t) => `https://www.primevideo.com/search?phrase=${t}` },
  { nomes: ["disney"], url: (t) => `https://www.disneyplus.com/search?q=${t}` },
  { nomes: ["apple"], url: (t) => `https://tv.apple.com/search?term=${t}` },
  { nomes: ["google play"], url: (t) => `https://play.google.com/store/search?q=${t}&c=movies` },
];

// Devolve o link de pesquisa para uma plataforma, ou null se não a conhecermos.
// Ex.: linkPlataforma("Netflix", "Duna") → "https://www.netflix.com/search?q=Duna"
export function linkPlataforma(nomePlataforma, tituloFilme) {
  const nome = nomePlataforma.toLowerCase();
  const encontrada = PESQUISAS.find((p) => p.nomes.some((n) => nome.includes(n)));
  return encontrada ? encontrada.url(encodeURIComponent(tituloFilme)) : null;
}

// Fontes que mostramos sempre, mesmo quando a TMDB não tem dados
export function outrasFontes(tituloFilme, anoFilme = "") {
  const t = encodeURIComponent(tituloFilme);
  const comAno = encodeURIComponent(`onde assistir ${tituloFilme} ${anoFilme}`.trim());
  return [
    { nome: "Netflix", link: `https://www.netflix.com/search?q=${t}` },
    { nome: "YouTube", link: `https://www.youtube.com/results?search_query=${t}` },
    { nome: "Prime Video", link: `https://www.primevideo.com/search?phrase=${t}` },
    { nome: "Google", link: `https://www.google.com/search?q=${comAno}` },
  ];
}
