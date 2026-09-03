import { NextResponse } from "next/server";
import { inscricaoSchema } from "@/lib/schema";
import { getSupabaseAdmin, TABELA } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let corpo: unknown;
  try {
    corpo = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Requisição inválida." },
      { status: 400 },
    );
  }

  // Validação no backend (mesmo schema do frontend)
  const parsed = inscricaoSchema.safeParse(corpo);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Dados inválidos. Confira os campos e tente novamente.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const { nome, email, telefone, tamanho, consentimento } = parsed.data;

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from(TABELA).insert({
      nome_completo: nome,
      email,
      telefone,
      tamanho_camisa: tamanho,
      consentimento,
    });

    if (error) {
      // 23505 = violação de índice único (e-mail ou telefone já cadastrado)
      if (error.code === "23505") {
        return NextResponse.json(
          {
            ok: false,
            code: "DUPLICADO",
            message: "Sua inscrição já foi realizada anteriormente.",
          },
          { status: 409 },
        );
      }
      console.error("Erro ao inserir inscrição:", error);
      return NextResponse.json(
        {
          ok: false,
          message:
            "Não conseguimos registrar sua inscrição agora. Tente novamente em instantes.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("Falha inesperada na inscrição:", err);
    return NextResponse.json(
      {
        ok: false,
        message:
          "Não conseguimos registrar sua inscrição agora. Tente novamente em instantes.",
      },
      { status: 500 },
    );
  }
}
