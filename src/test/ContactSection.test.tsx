import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactSection from "@/components/ContactSection";
import { toast } from "sonner";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/lib/analytics", () => ({
  track: vi.fn(),
}));

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

const fillForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText("Nombre *"), "Juan Pérez");
  await user.type(screen.getByLabelText("Email *"), "juan@example.com");
  await user.type(screen.getByLabelText("Mensaje *"), "Quiero cotizar una compra de cereales.");
};

describe("ContactSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza los campos del formulario", () => {
    render(<ContactSection />);
    expect(screen.getByLabelText("Nombre *")).toBeInTheDocument();
    expect(screen.getByLabelText("Email *")).toBeInTheDocument();
    expect(screen.getByLabelText("Teléfono")).toBeInTheDocument();
    expect(screen.getByLabelText("Mensaje *")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /enviar mensaje/i })).toBeInTheDocument();
  });

  it("muestra error de validación si el formulario está incompleto", async () => {
    const user = userEvent.setup();
    render(<ContactSection />);

    await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

    expect(toast.error).toHaveBeenCalledWith("El nombre es obligatorio");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("muestra error si el mensaje es demasiado corto", async () => {
    const user = userEvent.setup();
    render(<ContactSection />);

    await user.type(screen.getByLabelText("Nombre *"), "Juan");
    await user.type(screen.getByLabelText("Email *"), "juan@example.com");
    await user.type(screen.getByLabelText("Mensaje *"), "corto");
    await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

    expect(toast.error).toHaveBeenCalledWith("El mensaje debe tener al menos 10 caracteres");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("envía el formulario válido a Web3Forms y resetea los campos", async () => {
    mockFetch.mockResolvedValueOnce({ json: () => Promise.resolve({ success: true }) });
    const user = userEvent.setup();
    render(<ContactSection />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

    await waitFor(() => expect(toast.success).toHaveBeenCalled());
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.web3forms.com/submit",
      expect.objectContaining({ method: "POST" })
    );
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.from_name).toBe("Juan Pérez");
    expect(body.email).toBe("juan@example.com");
    expect(screen.getByLabelText("Nombre *")).toHaveValue("");
  });

  it("muestra error si Web3Forms falla", async () => {
    mockFetch.mockResolvedValueOnce({ json: () => Promise.resolve({ success: false }) });
    const user = userEvent.setup();
    render(<ContactSection />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Hubo un error al enviar. Intentá de nuevo.")
    );
  });

  it("no envía nada si el honeypot está completo", async () => {
    const user = userEvent.setup();
    const { container } = render(<ContactSection />);

    await fillForm(user);
    // El campo está oculto: se completa programáticamente como lo haría un bot
    const honeypot = container.querySelector('input[name="company"]') as HTMLInputElement;
    fireEvent.change(honeypot, { target: { value: "SpamBot Inc" } });
    await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

    expect(mockFetch).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });
});
