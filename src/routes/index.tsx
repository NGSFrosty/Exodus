import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Shield,
  Zap,
  BarChart3,
  Lock,
  ChevronRight,
  Bitcoin,
  CreditCard,
  Eye,
  HelpCircle,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Exodus Wallet — Premium Crypto Dashboard" },
      { name: "description", content: "The ultimate cryptocurrency portfolio and wallet management dashboard." },
      { property: "og:title", content: "Exodus Wallet" },
      { property: "og:description", content: "Track, manage, and grow your crypto portfolio." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full glass-panel border-b-0">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20">
              <Bitcoin className="h-5 w-5 text-primary" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight">Exodus Wallet</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Features</a>
            <a href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Pricing</a>
            <a href="#faq" className="text-sm text-muted-foreground transition-colors hover:text-foreground">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
            >
              Sign In
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center bg-gradient-hero pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />
          <div className="absolute -right-20 bottom-20 h-96 w-96 rounded-full bg-accent/10 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Now Available — Premium Dashboard
            </div>
            <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Your Crypto. <span className="text-gradient">Beautifully Managed.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Track every asset, visualize your portfolio growth, and stay in control with a premium desktop-grade crypto dashboard built for serious investors.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/30"
              >
                Unlock Premium — £5
                <ChevronRight className="h-5 w-5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-8 py-3.5 text-base font-medium text-foreground transition-all hover:bg-card/80"
              >
                Explore Features
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-16"
          >
            <div className="glass-panel glow-purple mx-auto max-w-5xl overflow-hidden rounded-2xl border">
              <img
                src="/images/hero-dashboard.jpg"
                alt="Premium crypto dashboard preview"
                className="w-full rounded-2xl"
                width={1344}
                height={768}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Everything You Need</h2>
            <p className="mt-4 text-muted-foreground">A complete toolkit for modern crypto portfolio management.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel rounded-2xl p-6 transition-all hover:border-primary/30"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                See Your Portfolio <span className="text-gradient">Like Never Before</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                Interactive charts, real-time price tracking, and stunning asset cards give you a complete picture of your holdings at a glance.
              </p>
              <ul className="mt-8 space-y-4">
                {["Live price feeds", "Portfolio allocation charts", "Profit/loss tracking", "Multi-wallet support"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-panel glow-purple overflow-hidden rounded-2xl border"
            >
              <img src="/images/crypto-abstract.jpg" alt="Crypto visualization" className="w-full" width={1024} height={1024} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Simple, One-Time Pricing</h2>
          <p className="mt-4 text-muted-foreground">Pay once. Access forever. No subscriptions.</p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-panel glow-purple mx-auto mt-12 max-w-md rounded-3xl border p-8"
          >
            <div className="mb-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">Premium Access</div>
            <div className="flex items-baseline justify-center gap-1">
              <span className="font-display text-5xl font-bold">£5</span>
              <span className="text-muted-foreground">one-time</span>
            </div>
            <ul className="mt-8 space-y-4 text-left">
              {[
                "Full dashboard access",
                "Portfolio charts & analytics",
                "Multi-asset tracking",
                "Secure activation code",
                "Lifetime updates",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to="/auth"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
            >
              Get Premium Access
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">Frequently Asked Questions</h2>
          <div className="mt-12 space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-panel rounded-2xl border p-6"
              >
                <h3 className="flex items-center gap-3 font-display font-semibold">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  {faq.q}
                </h3>
                <p className="mt-3 pl-8 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Bitcoin className="h-5 w-5 text-primary" />
              <span className="font-display font-semibold">Exodus Wallet</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Not affiliated with Exodus Movement, Inc. Independent project.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: BarChart3,
    title: "Portfolio Analytics",
    description: "Beautiful interactive charts showing your portfolio allocation, performance, and trends over time.",
  },
  {
    icon: Shield,
    title: "Secure Access",
    description: "One-time activation code system ensures only verified premium users can access the dashboard.",
  },
  {
    icon: Zap,
    title: "Real-Time Prices",
    description: "Track live cryptocurrency prices with automatic updates and percentage change indicators.",
  },
  {
    icon: Eye,
    title: "Asset Overview",
    description: "Large, beautiful asset cards showing balances, values, and 24h performance at a glance.",
  },
  {
    icon: Lock,
    title: "Activation Codes",
    description: "Purchase a unique access code. Use it once to unlock your premium dashboard permanently.",
  },
  {
    icon: CreditCard,
    title: "Simple Checkout",
    description: "Secure Stripe-powered payment. Get your code instantly after successful purchase.",
  },
];

const faqs = [
  {
    q: "What do I get for £5?",
    a: "You get lifetime access to the premium dashboard with portfolio analytics, real-time price tracking, multi-asset support, and all future updates.",
  },
  {
    q: "How does the activation code work?",
    a: "After payment, you'll receive a unique code (e.g., CRYPTO-X7A92-KP4L1). Enter it on the activation page while logged in. Each code can only be used once.",
  },
  {
    q: "Is this the official Exodus app?",
    a: "No. This is an independent premium dashboard inspired by desktop wallet aesthetics. It is not affiliated with Exodus Movement, Inc.",
  },
  {
    q: "Can I share my code?",
    a: "No. Each activation code is tied to your account on first use and cannot be reused or transferred.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept all major credit and debit cards through our secure Stripe integration.",
  },
];
