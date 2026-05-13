import { render, screen, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

// Expone los valores del contexto como atributos data-testid para aserciones
const AuthInspector = () => {
  const { isAdmin, loading, user } = useAuth();
  if (loading) return <span data-testid="loading" />;
  return (
    <>
      <span data-testid="is-admin">{String(isAdmin)}</span>
      <span data-testid="user-id">{user?.id ?? "none"}</span>
    </>
  );
};

const MOCK_USER = { id: "uid-1", email: "admin@test.com" };
const MOCK_SESSION = { user: MOCK_USER, access_token: "token-xyz" };

const mockUserRoles = (adminData: { role: string } | null) =>
  vi.mocked(supabase.from).mockReturnValue({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: adminData, error: null }),
  } as ReturnType<typeof supabase.from>);

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    } as ReturnType<typeof supabase.auth.onAuthStateChange>);
  });

  it("loading es true al inicio y false después de resolver getSession", async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
    } as Awaited<ReturnType<typeof supabase.auth.getSession>>);

    render(<AuthProvider><AuthInspector /></AuthProvider>);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument()
    );
  });

  it("isAdmin es false cuando no hay sesión activa", async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
    } as Awaited<ReturnType<typeof supabase.auth.getSession>>);

    render(<AuthProvider><AuthInspector /></AuthProvider>);
    await waitFor(() => screen.getByTestId("is-admin"));
    expect(screen.getByTestId("is-admin")).toHaveTextContent("false");
    expect(screen.getByTestId("user-id")).toHaveTextContent("none");
  });

  it("isAdmin es true cuando el usuario tiene role admin en user_roles", async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: MOCK_SESSION as never },
    } as Awaited<ReturnType<typeof supabase.auth.getSession>>);
    mockUserRoles({ role: "admin" });

    render(<AuthProvider><AuthInspector /></AuthProvider>);
    await waitFor(() => screen.getByTestId("is-admin"));
    expect(screen.getByTestId("is-admin")).toHaveTextContent("true");
    expect(screen.getByTestId("user-id")).toHaveTextContent("uid-1");
  });

  it("isAdmin es false cuando el usuario autenticado no tiene role admin", async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: MOCK_SESSION as never },
    } as Awaited<ReturnType<typeof supabase.auth.getSession>>);
    mockUserRoles(null);

    render(<AuthProvider><AuthInspector /></AuthProvider>);
    await waitFor(() => screen.getByTestId("is-admin"));
    expect(screen.getByTestId("is-admin")).toHaveTextContent("false");
  });

  it("isAdmin es false cuando falla la consulta a user_roles", async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: MOCK_SESSION as never },
    } as Awaited<ReturnType<typeof supabase.auth.getSession>>);
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi
        .fn()
        .mockResolvedValue({ data: null, error: new Error("DB error") }),
    } as ReturnType<typeof supabase.from>);

    render(<AuthProvider><AuthInspector /></AuthProvider>);
    await waitFor(() => screen.getByTestId("is-admin"));
    expect(screen.getByTestId("is-admin")).toHaveTextContent("false");
  });
});
