import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminLoginDialog from "@/components/AdminLoginDialog";

const mockToast = vi.fn();
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

const mockUseAuth = vi.fn();
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

const baseAuth = {
  user: null,
  isAdmin: false,
  loading: false,
  signIn: vi.fn().mockResolvedValue({ error: null }),
  signOut: vi.fn().mockResolvedValue(undefined),
};

describe("AdminLoginDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({ ...baseAuth });
  });

  it("no renderiza nada mientras carga", () => {
    mockUseAuth.mockReturnValue({ ...baseAuth, loading: true });
    const { container } = render(<AdminLoginDialog />);
    expect(container).toBeEmptyDOMElement();
  });

  it("muestra el estado admin y botón de salir con sesión iniciada", () => {
    mockUseAuth.mockReturnValue({ ...baseAuth, user: { id: "1" }, isAdmin: true });
    render(<AdminLoginDialog />);
    expect(screen.getByText(/admin/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /salir/i })).toBeInTheDocument();
  });

  it("cierra sesión al hacer click en salir", async () => {
    const signOut = vi.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({ ...baseAuth, user: { id: "1" }, isAdmin: true, signOut });
    const user = userEvent.setup();
    render(<AdminLoginDialog />);

    await user.click(screen.getByRole("button", { name: /salir/i }));

    await waitFor(() => expect(signOut).toHaveBeenCalled());
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: "Sesión cerrada" }));
  });

  it("abre el diálogo y llama a signIn con las credenciales", async () => {
    const signIn = vi.fn().mockResolvedValue({ error: null });
    mockUseAuth.mockReturnValue({ ...baseAuth, signIn });
    const user = userEvent.setup();
    render(<AdminLoginDialog />);

    await user.click(screen.getByRole("button"));
    await user.type(screen.getByLabelText("Email"), "admin@test.com");
    await user.type(screen.getByLabelText("Contraseña"), "secreto123");
    await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => expect(signIn).toHaveBeenCalledWith("admin@test.com", "secreto123"));
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: "Sesión iniciada" }));
  });

  it("muestra error con credenciales inválidas", async () => {
    const signIn = vi.fn().mockResolvedValue({ error: { message: "Invalid login credentials" } });
    mockUseAuth.mockReturnValue({ ...baseAuth, signIn });
    const user = userEvent.setup();
    render(<AdminLoginDialog />);

    await user.click(screen.getByRole("button"));
    await user.type(screen.getByLabelText("Email"), "admin@test.com");
    await user.type(screen.getByLabelText("Contraseña"), "mala");
    await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Error de autenticación",
          description: "Credenciales inválidas",
          variant: "destructive",
        })
      )
    );
  });
});
