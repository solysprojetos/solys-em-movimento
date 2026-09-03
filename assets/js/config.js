/* ------------------------------------------------------------------
   Configuração do Supabase (projeto confraternize-2026)

   A anon key é PÚBLICA por natureza — ela apenas identifica o projeto.
   A segurança vem das políticas de Row Level Security (RLS):
   qualquer visitante pode INSERIR uma inscrição, mas ninguém consegue
   LER a lista sem estar autenticado como admin (solysprojetos@gmail.com).
   ------------------------------------------------------------------ */
window.APP_CONFIG = {
  SUPABASE_URL: "https://qozuvdhqhpzpreusvkkr.supabase.co",
  SUPABASE_ANON_KEY:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvenV2ZGhxaHB6cHJldXN2a2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNDc2NTMsImV4cCI6MjEwMzkyMzY1M30.T--K-q8NEMyMnwe2zZEliE2fVGGC4gzR1CnGaXhBSco",
  SUPABASE_TABLE: "inscricoes_movimento",
};
