import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { getActivationStatus } from "@/lib/payments.functions";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Bitcoin,
  Activity,
  DollarSign,
  BarChart3,
  PieChart,
  Layers,
  LogOut,
  Settings,
  Bell,
  Search,
  ChevronRight,
  Shield,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Exodus Wallet" },
      { name: "description", content: "Your premium cryptocurrency portfolio dashboard." },
    ],
  }),
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: DashboardPage,
});

// Demo portfolio data
const portfolioHistory = [
  { date: "Jan", value: 12500 },
  { date: "Feb", value: 14200 },
  { date: "Mar", value: 13800 },
  { date: "Apr", value: 15600 },
  { date: "May", value: 17300 },
  { date: "Jun", value: 16800 },
  { date: "Jul", value: 18500 },
  { date: "Aug", value: 20100 },
  { date: "Sep", value: 19500 },
  { date: "Oct", value: 22300 },
  { date: "Nov", value: 24100 },
  { date: "Dec", value: 25800 },
];

const allocationData = [
  { name: "Bitcoin", value: 45, color: "#7C3AED" },
  { name: "Ethereum", value: 28, color: "#EC4899" },
  { name: "Solana", value: 12, color: "#22D3EE" },
  { name: "Cardano", value: 8, color: "#10B981" },
  { name: "Others", value: 7, color: "#F59E0B" },
];

const assets = [
  { symbol: "BTC", name: "Bitcoin", balance: "0.245", value: 11460.5, change: 2.4, price: 46777.55 },
  { symbol: "ETH", name: "Ethereum", balance: "4.12", value: 7136.4, change: -1.2, price: 1732.14 },
  { symbol: "SOL", name: "Solana", balance: "42.5", value: 3057.75, change: 5.8, price: 71.95 },
  { symbol: "ADA", name: "Cardano", balance: "2040", value: 2039.92, change: -0.5, price: 0.999 },
  { symbol: "DOT", name: "Polkadot", balance: "180", value: 1071.0, change: 1.3, price: 5.95 },
  { symbol: "LINK", name: "Chainlink", balance: "85", value: 1198.5, change: 3.2, price: 14.1 },
];

const recentActivity = [
  { type: "received", asset: "BTC", amount: "0.05", value: 2338.88, time: "2 hours ago" },
  { type: "sent", asset: "ETH", amount: "1.2", value: 2078.57, time: "5 hours ago" },
  { type: "swap", asset: "SOL → BTC", amount: "20", value: 1439.0, time: "1 day ago" },
  { type: "received", asset: "ADA", amount: "500", value: 499.5, time: "2 days ago" },
];

function DashboardPage() {
  const [activated, setActivated] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const checkStatus = useServerFn(getActivationStatus);
  const navigate = Route.useNavigate();

  useEffect(() => {
    checkStatus({})
      .then((res) => {
        setActivated(res.activated);
        if (!res.activated) {
          navigate({ to: "/activate", replace: true });
        }
      })
      .catch(() => navigate({ to: "/activate", replace: true }));
  }, [checkStatus, navigate]);

  if (activated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!activated) return null;

  const totalValue = assets.reduce((sum, a) => sum + a.value, 0);
  const totalChange = ((portfolioHistory[portfolioHistory.length - 1].value - portfolioHistory[0].value) / portfolioHistory[0].value) * 100;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border/30 bg-sidebar transition-all duration-300 ${sidebarOpen ? "w-64" : "w-0 -translate-x-full md:w-16 md:translate-x-0"}`}
      >
        <div className="flex h-16 items-center gap-3 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20">
            <Bitcoin className="h-5 w-5 text-primary" />
          </div>
          {sidebarOpen && <span className="font-display font-bold">Exodus</span>}
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          <SidebarItem icon={Wallet} label="Portfolio" active />
          <SidebarItem icon={BarChart3} label="Analytics" />
          <SidebarItem icon={Layers} label="Assets" />
          <SidebarItem icon={Activity} label="Activity" />
          <SidebarItem icon={Bell} label="Alerts" />
          <SidebarItem icon={Settings} label="Settings" />
        </nav>
        <div className="border-t border-border/30 p-3">
          <button
            onClick={async () => { await supabase.auth.signOut(); window.location.href = "/auth"; }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="h-4 w-4" />
            {sidebarOpen && "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "md:ml-64" : "md:ml-16"}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/30 bg-background/80 px-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
            >
              <ChevronRight className={`h-5 w-5 transition-transform ${sidebarOpen ? "rotate-180" : ""}`} />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search assets..."
                className="w-64 rounded-lg border border-border bg-background/50 py-1.5 pl-9 pr-4 text-sm outline-none ring-primary/20 transition-all focus:border-primary focus:ring-2"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary sm:flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              Premium
            </div>
            <div className="h-8 w-8 rounded-full bg-primary/20" />
          </div>
        </header>

        <div className="p-6">
          {/* Stats Row */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Balance"
              value={`$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
              change={`+${totalChange.toFixed(1)}%`}
              positive
              icon={Wallet}
            />
            <StatCard
              title="24h Change"
              value="+$1,247.50"
              change="+5.1%"
              positive
              icon={TrendingUp}
            />
            <StatCard
              title="Total Assets"
              value="6"
              change="+1 this week"
              positive
              icon={Layers}
            />
            <StatCard
              title="Best Performer"
              value="SOL"
              change="+5.8%"
              positive
              icon={TrendingUp}
            />
          </div>

          {/* Charts Row */}
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-2xl border p-6 lg:col-span-2"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-display font-semibold">Portfolio Performance</h3>
                <div className="flex gap-2">
                  {["1D", "1W", "1M", "1Y"].map((t) => (
                    <button
                      key={t}
                      className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${t === "1Y" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={portfolioHistory}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(15, 15, 30, 0.9)",
                      border: "1px solid rgba(124, 58, 237, 0.2)",
                      borderRadius: "12px",
                      backdropFilter: "blur(10px)",
                    }}
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Value"]}
                  />
                  <Area type="monotone" dataKey="value" stroke="#7C3AED" strokeWidth={2} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-panel rounded-2xl border p-6"
            >
              <h3 className="mb-4 font-display font-semibold">Allocation</h3>
              <ResponsiveContainer width="100%" height={200}>
                <RePieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "rgba(15, 15, 30, 0.9)",
                      border: "1px solid rgba(124, 58, 237, 0.2)",
                      borderRadius: "12px",
                    }}
                    formatter={(value: any) => [`${Number(value)}%`, "Allocation"]}
                  />
                </RePieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {allocationData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Assets Row */}
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-panel rounded-2xl border p-6 lg:col-span-2"
            >
              <h3 className="mb-4 font-display font-semibold">Your Assets</h3>
              <div className="space-y-3">
                {assets.map((asset) => (
                  <div
                    key={asset.symbol}
                    className="flex items-center justify-between rounded-xl bg-card/30 p-4 transition-colors hover:bg-card/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-bold text-xs text-primary">
                        {asset.symbol[0]}
                      </div>
                      <div>
                        <div className="font-medium">{asset.name}</div>
                        <div className="text-xs text-muted-foreground">{asset.balance} {asset.symbol}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${asset.value.toLocaleString()}</div>
                      <div className={`flex items-center justify-end gap-1 text-xs ${asset.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {asset.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {asset.change > 0 ? "+" : ""}{asset.change}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-panel rounded-2xl border p-6"
            >
              <h3 className="mb-4 font-display font-semibold">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((act, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg ${act.type === "received" ? "bg-emerald-500/10" : act.type === "sent" ? "bg-rose-500/10" : "bg-primary/10"}`}>
                      {act.type === "received" ? <ArrowDownRight className="h-4 w-4 text-emerald-400" /> : act.type === "sent" ? <ArrowUpRight className="h-4 w-4 text-rose-400" /> : <DollarSign className="h-4 w-4 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium capitalize">{act.type}</div>
                      <div className="text-xs text-muted-foreground">{act.asset} · {act.time}</div>
                    </div>
                    <div className="text-right text-sm font-medium">${act.value.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active = false }: { icon: any; label: string; active?: boolean }) {
  const sidebarOpen = true; // simplified
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
        active
          ? "bg-sidebar-primary/10 text-sidebar-primary-foreground font-medium"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      {sidebarOpen && label}
    </button>
  );
}

function StatCard({ title, value, change, positive, icon: Icon }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-2xl border p-5"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <div className="mt-3 font-display text-2xl font-bold">{value}</div>
      <div className={`mt-1 flex items-center gap-1 text-xs font-medium ${positive ? "text-emerald-400" : "text-rose-400"}`}>
        {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {change}
      </div>
    </motion.div>
  );
}
