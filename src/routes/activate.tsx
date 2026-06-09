import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { activateCode, getActivationStatus } from "@/lib/payments.functions";
import {
  KeyRound,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  LogOut,
  Shield,
} from "lucide-react";

export const Route = createFileRoute("/activate")({
  head: () => ({
    meta: [
      { title: "Activate — Exodus Wallet" },
      { name: "description", content: "Enter your activation code to unlock premium dashboard access." },
    ],
  }),
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
  },
  component: ActivatePage,
});

function ActivatePage() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [activated, setActivated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const activate = useServerFn(activateCode);
  const checkStatus = useServerFn(getActivationStatus);

  useEffect(() => {
    checkStatus({})
      .then((res) => setActivated(res.activated))
      .catch(() => setActivated(false));
  }, [checkStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await activate({ data: { code: code.trim() } });
      if (res.success) {
        setStatus("success");
        setMessage("Your dashboard is now activated! Redirecting...");
        setTimeout(() => navigate({ to: "/dashboard" }), 1500);
      } else {
        setStatus("error");
        setMessage(res.error || "Invalid code");
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Activation failed");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (activated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-hero">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (activated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-hero px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel glow-purple max-w-md rounded-3xl border p-8 text-center"
        >
          <CheckCircle className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4 font-display text-2xl font-bold">Already Activated</h1>
          <p className="mt-2 text-muted-foreground">Your dashboard is ready.</p>
          <button
            onClick={() => navigate({ to: "/dashboard" })}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            Go to Dashboard <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -right-20 bottom-20 h-96 w-96 rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-panel glow-purple rounded-3xl border p-8">
          <div className="mb-6 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20">
              <KeyRound className="h-7 w-7 text-primary" />
            </div>
          </div>

          <h1 className="text-center font-display text-2xl font-bold">Activate Premium Access</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Enter your unique activation code to unlock the dashboard.
          </p>

          {status === "success" && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">
              <CheckCircle className="h-4 w-4" />
              {message}
            </div>
          )}

          {status === "error" && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Activation Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="CRYPTO-XXXXX-XXXXX"
                className="w-full rounded-xl border border-border bg-background/50 py-3 px-4 text-center text-lg font-mono tracking-widest uppercase outline-none ring-primary/20 transition-all focus:border-primary focus:ring-2"
                maxLength={17}
                required
              />
              <p className="mt-1.5 text-center text-xs text-muted-foreground">Format: CRYPTO-X7A92-KP4L1</p>
            </div>

            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
            >
              {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
              {status === "loading" ? "Activating..." : "Activate Dashboard"}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p>Don't have a code? <a href="/" className="text-primary hover:underline">Get Premium Access</a></p>
          </div>

          <button
            onClick={handleSignOut}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </motion.div>
    </div>
  );
}
