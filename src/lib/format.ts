/** Aplica a máscara brasileira de telefone: (85) 99999-9999 */
export function formatarTelefone(valor: string): string {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  const corte = d.length > 10 ? 7 : 6;
  return `(${d.slice(0, 2)}) ${d.slice(2, corte)}-${d.slice(corte)}`;
}

/** Mantém apenas os dígitos de uma string. */
export function apenasDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}
