import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode, createContext, useContext } from "react";
import appCss from "../styles.css?url";
import { supabase } from "@/integrations/supabase/client";

export interface AuthState {
  user: { id: string; email?: string } | null;
  isLoading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthState>({ user: null, isLoading: true, isAdmin: false });
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, isLoading: true, isAdmin: false });
  const queryClient = useQueryClient();

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id);
        setState({
          user: { id: data.user.id, email: data.user.email },
          isLoading: false,
          isAdmin: roles?.some((r) => r.role === "admin") ?? false,
        });
      } else {
        setState({ user: null, isLoading: false, isAdmin: false });
      }
    };
    init();

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        queryClient.invalidateQueries();
        if (session?.user) {
          supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .then(({ data: roles }) => {
              setState({
                user: { id: session.user.id, email: session.user.email },
                isLoading: false,
                isAdmin: roles?.some((r) => r.role === "admin") ?? false,
              });
            });
        } else {
          setState({ user: null, isLoading: false, isAdmin: false });
        }
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [queryClient]);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
      </div>
    </div>
  );
}

function ErrorComponent({ error }: { error: Error }) {
  console.error(error);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Try refreshing.</p>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Exodus Wallet — Premium Crypto Dashboard" },
      { name: "description", content: "The ultimate cryptocurrency portfolio and wallet management dashboard." },
      { property: "og:title", content: "Exodus Wallet — Premium Crypto Dashboard" },
      { property: "og:description", content: "The ultimate cryptocurrency portfolio and wallet management dashboard." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Exodus Wallet — Premium Crypto Dashboard" },
      { name: "twitter:description", content: "The ultimate cryptocurrency portfolio and wallet management dashboard." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/75920697-82a9-415a-b8f0-e18556738377/id-preview-d86202fb--1584bc5f-2e5a-4d52-95b1-4f7a7cea30c0.lovable.app-1781026995155.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/75920697-82a9-415a-b8f0-e18556738377/id-preview-d86202fb--1584bc5f-2e5a-4d52-95b1-4f7a7cea30c0.lovable.app-1781026995155.png" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="dark bg-background text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </QueryClientProvider>
  );
}
