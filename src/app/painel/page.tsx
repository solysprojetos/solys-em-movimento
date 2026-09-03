import type { Metadata } from "next";
import { AdminPanel } from "@/components/AdminPanel";

export const metadata: Metadata = {
  title: "Painel — Solys em Movimento",
  robots: { index: false, follow: false },
};

export default function PainelPage() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center px-4 py-10">
      <AdminPanel />
    </main>
  );
}
