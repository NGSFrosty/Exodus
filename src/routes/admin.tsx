import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { getAllCodes, generateMoreCodes, deleteCode, toggleCodeStatus } from "@/lib/admin.functions";
import {
  KeyRound,
  Plus,
  Trash2,
  Ban,
  Unlock,
  Download,
  Loader2,
  AlertCircle,
  Shield,
  ArrowLeft,
  Search,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Exodus Wallet" },
      { name: "description", content: "Admin panel for managing access codes." },
    ],
  }),
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
    if (!isAdmin) throw redirect({ to: "/dashboard" });
    return { user: data.user };
  },
  component: AdminPage,
});

function AdminPage() {
  const [codes, setCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generateCount, setGenerateCount] = useState(10);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchCodes = useServerFn(getAllCodes);
  const genCodes = useServerFn(generateMoreCodes);
  const delCode = useServerFn(deleteCode);
  const toggleCode = useServerFn(toggleCodeStatus);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchCodes({});
      setCodes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      await genCodes({ data: { count: generateCount } });
      await load();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this code permanently?")) return;
    setLoading(true);
    try {
      await delCode({ data: { id } });
      await load();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string, current: string) => {
    const next = current === "unused" ? "disabled" : "unused";
    setLoading(true);
    try {
      await toggleCode({ data: { id, status: next as "unused" | "disabled" } });
      await load();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const rows = filteredCodes.map((c) => `${c.code},${c.status},${c.created_at}`).join("\n");
    const csv = `Code,Status,Created\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `access-codes-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredCodes = codes
    .filter((c) => {
      if (filter === "unused") return c.status === "unused";
      if (filter === "used") return c.status === "used";
      if (filter === "disabled") return c.status === "disabled";
      return true;
    })
    .filter((c) => c.code.toLowerCase().includes(search.toLowerCase()));

  const stats = {
    total: codes.length,
    unused: codes.filter((c) => c.status === "unused").length,
    used: codes.filter((c) => c.status === "used").length,
    disabled: codes.filter((c) => c.status === "disabled").length,
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">Manage activation codes</p>
            </div>
          </div>
          <a href="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </a>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          <div className="glass-panel rounded-2xl border p-5">
            <div className="text-xs text-muted-foreground uppercase">Total Codes</div>
            <div className="mt-1 font-display text-2xl font-bold">{stats.total}</div>
          </div>
          <div className="glass-panel rounded-2xl border p-5">
            <div className="text-xs text-muted-foreground uppercase">Unused</div>
            <div className="mt-1 font-display text-2xl font-bold text-emerald-400">{stats.unused}</div>
          </div>
          <div className="glass-panel rounded-2xl border p-5">
            <div className="text-xs text-muted-foreground uppercase">Used</div>
            <div className="mt-1 font-display text-2xl font-bold text-rose-400">{stats.used}</div>
          </div>
          <div className="glass-panel rounded-2xl border p-5">
            <div className="text-xs text-muted-foreground uppercase">Disabled</div>
            <div className="mt-1 font-display text-2xl font-bold text-amber-400">{stats.disabled}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={generateCount}
              onChange={(e) => setGenerateCount(Math.min(500, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-20 rounded-xl border border-border bg-background/50 py-2 px-3 text-sm outline-none"
              min={1}
              max={500}
            />
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Generate
            </button>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm hover:bg-card/80"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <div className="flex-1" />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search codes..."
              className="w-48 rounded-xl border border-border bg-background/50 py-2 pl-9 pr-4 text-sm outline-none"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-border bg-background/50 py-2 px-3 text-sm outline-none"
          >
            <option value="all">All</option>
            <option value="unused">Unused</option>
            <option value="used">Used</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>

        {/* Table */}
        <div className="glass-panel overflow-hidden rounded-2xl border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium">Used At</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                    </td>
                  </tr>
                ) : filteredCodes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground">
                      <KeyRound className="mx-auto mb-2 h-8 w-8 opacity-30" />
                      No codes found
                    </td>
                  </tr>
                ) : (
                  filteredCodes.map((code) => (
                    <motion.tr
                      key={code.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-border/20 transition-colors hover:bg-card/30"
                    >
                      <td className="px-4 py-3 font-mono font-medium">{code.code}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            code.status === "unused"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : code.status === "used"
                                ? "bg-rose-500/10 text-rose-400"
                                : "bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          {code.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(code.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {code.used_at ? new Date(code.used_at).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {code.status !== "used" && (
                            <button
                              onClick={() => handleToggle(code.id, code.status)}
                              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                              title={code.status === "unused" ? "Disable" : "Enable"}
                            >
                              {code.status === "unused" ? <Ban className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(code.id)}
                            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
