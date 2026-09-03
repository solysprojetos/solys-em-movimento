import { RegistrationCard } from "@/components/RegistrationCard";

export default function Home() {
  const ano = new Date().getFullYear();

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center px-4 py-10 sm:py-14">
      <div className="w-full flex-1 flex items-center justify-center">
        <RegistrationCard />
      </div>

      <footer className="mt-8 text-center text-xs leading-relaxed text-slate-400/80">
        <p className="font-medium text-slate-300/80">
          Solys — Gestão Administrativa
        </p>
        <p className="mt-1">
          © {ano} Solys em Movimento. Todos os direitos reservados.
        </p>
      </footer>
    </main>
  );
}
