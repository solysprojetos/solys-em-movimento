/**
 * Prefixa um caminho de asset com o base path do deploy.
 *
 * Em GitHub Pages (project site) o base path é "/solys-em-movimento"; em
 * domínio próprio ele é vazio. O valor é injetado em build por next.config
 * (NEXT_PUBLIC_BASE_PATH), garantindo que imagens do /public carreguem
 * corretamente nos dois cenários.
 */
export function asset(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return `${base}${path}`;
}
