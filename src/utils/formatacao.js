// "2024-07-10" → "2024"
export function ano(data) {
  return data ? data.slice(0, 4) : "—";
}

// 7.8456 → "7.8"
export function nota(valor) {
  return valor ? valor.toFixed(1) : "—";
}

// 135 → "2h 15min"
export function duracao(minutos) {
  if (!minutos) return "";
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return h ? `${h}h ${m}min` : `${m}min`;
}

// "2024-07-10" → "10 de julho de 2024"
export function dataPorExtenso(data) {
  if (!data) return "Data desconhecida";
  // "T00:00" faz a data ser lida na hora local (sem isto, pode mostrar o dia anterior)
  return new Date(`${data}T00:00`).toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
