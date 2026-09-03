import { z } from "zod";

export const TAMANHOS = ["PP", "P", "M", "G", "GG", "XXG", "XXXG"] as const;
export type Tamanho = (typeof TAMANHOS)[number];

/**
 * Schema de validação compartilhado entre o cliente (React Hook Form)
 * e o servidor (route handler). Fonte única de verdade.
 */
export const inscricaoSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, "Informe seu nome completo.")
    .refine((v) => v.split(/\s+/).filter(Boolean).length >= 2, {
      message: "Informe nome e sobrenome.",
    })
    .transform((v) => v.replace(/\s+/g, " ")),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Informe um e-mail válido."),

  telefone: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length === 10 || v.length === 11, {
      message: "Informe um telefone com DDD.",
    }),

  tamanho: z.enum(TAMANHOS, {
    errorMap: () => ({ message: "Escolha o tamanho da sua camisa." }),
  }),

  consentimento: z.literal(true, {
    errorMap: () => ({ message: "É necessário autorizar o uso dos dados." }),
  }),
});

export type InscricaoInput = z.input<typeof inscricaoSchema>;
export type InscricaoData = z.output<typeof inscricaoSchema>;
