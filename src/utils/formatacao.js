// "2024-07-10" → "2024"
export function ano(data) {
  return data ? data.slice(0, 4) : "—";
}

// 7.8456 → "7.8"
export function nota(valor) {
  return valor ? valor.toFixed(1) : "—";
}