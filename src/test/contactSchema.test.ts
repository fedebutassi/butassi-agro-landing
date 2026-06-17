import { describe, it, expect } from "vitest";
import { z } from "zod";

const contactSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().email("El email no es válido"),
  mensaje: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
  telefono: z.string().optional(),
  tipoConsulta: z.string().optional(),
});

describe("contactSchema", () => {
  it("acepta datos válidos", () => {
    const result = contactSchema.safeParse({
      nombre: "Juan Pérez",
      email: "juan@example.com",
      mensaje: "Quiero consultar sobre precios de agroquímicos",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza email inválido", () => {
    const result = contactSchema.safeParse({
      nombre: "Juan",
      email: "no-es-un-email",
      mensaje: "Mensaje largo suficiente",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("El email no es válido");
  });

  it("rechaza nombre vacío", () => {
    const result = contactSchema.safeParse({
      nombre: "",
      email: "juan@example.com",
      mensaje: "Mensaje largo suficiente",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("El nombre es obligatorio");
  });

  it("rechaza mensaje muy corto", () => {
    const result = contactSchema.safeParse({
      nombre: "Juan",
      email: "juan@example.com",
      mensaje: "Hola",
    });
    expect(result.success).toBe(false);
  });

  it("acepta teléfono opcional", () => {
    const result = contactSchema.safeParse({
      nombre: "Juan",
      email: "juan@example.com",
      mensaje: "Mensaje largo suficiente",
      telefono: "+54 9 3571 000000",
    });
    expect(result.success).toBe(true);
  });
});
