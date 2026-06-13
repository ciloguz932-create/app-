"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  RotateCcw,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  Flame,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  avatarEmoji: string;
  avatarColor: string;
  plan: string;
  role: string;
  createdAt: string;
  xp: number;
  streak: number;
  level: number;
  cards: number;
  reviews: number;
}

interface Stats {
  totals: { users: number; reviews: number; cards: number };
  planDistribution: { plan: string; count: number }[];
  signups: { date: string; count: number }[];
  users: AdminUser[];
}

const PLAN_COLORS: Record<string, string> = {
  free: "#7A6B55",
  pro: "#C5A028",
  institution: "#A51C30",
};

const PLAN_LABELS: Record<string, string> = {
  free: "Ücretsiz",
  pro: "Pro",
  institution: "Kurumsal",
};

function StatCard({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number }) {
  return (
    <div className="bg-surface border-2 border-cream-darker rounded-2xl p-5 flex items-center gap-4">
      <div className="w-11 h-11 bg-crimson/10 rounded-xl flex items-center justify-center">
        <Icon className="w-5 h-5 text-crimson" />
      </div>
      <div>
        <p className="text-2xl font-bold text-charcoal">{value.toLocaleString("tr-TR")}</p>
        <p className="text-xs text-muted">{label}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => setStats(data.totals ? data : null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-crimson" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-muted">Yüklenemedi.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream px-4 lg:px-10 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-charcoal" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-charcoal">Admin Paneli</h1>
              <p className="text-xs text-muted">Lumina Lingua yönetim merkezi</p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm font-semibold text-charcoal hover:text-crimson transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Uygulamaya dön
          </Link>
        </div>

        {/* Totals */}
        <div className="grid sm:grid-cols-3 gap-4">
          <StatCard icon={Users} label="Toplam kullanıcı" value={stats.totals.users} />
          <StatCard icon={RotateCcw} label="Toplam tekrar" value={stats.totals.reviews} />
          <StatCard icon={BookOpen} label="Toplam kart" value={stats.totals.cards} />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface border-2 border-cream-darker rounded-2xl p-6"
          >
            <h2 className="font-serif font-bold text-charcoal mb-4">Kayıtlar (son 30 gün)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={stats.signups}>
                <defs>
                  <linearGradient id="signupGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A51C30" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#A51C30" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(d: string) => d.slice(5)}
                  interval={6}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} width={28} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#A51C30"
                  strokeWidth={2}
                  fill="url(#signupGrad)"
                  name="Kayıt"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface border-2 border-cream-darker rounded-2xl p-6"
          >
            <h2 className="font-serif font-bold text-charcoal mb-4">Plan dağılımı</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={stats.planDistribution.map((p) => ({
                    name: PLAN_LABELS[p.plan] ?? p.plan,
                    value: p.count,
                    plan: p.plan,
                  }))}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                >
                  {stats.planDistribution.map((p) => (
                    <Cell key={p.plan} fill={PLAN_COLORS[p.plan] ?? "#7A6B55"} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Users table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-surface border-2 border-cream-darker rounded-2xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-cream-darker">
            <h2 className="font-serif font-bold text-charcoal">Kullanıcılar</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted uppercase tracking-wider bg-cream">
                  <th className="px-6 py-3">Kullanıcı</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Seviye</th>
                  <th className="px-4 py-3">XP</th>
                  <th className="px-4 py-3">Seri</th>
                  <th className="px-4 py-3">Kart</th>
                  <th className="px-4 py-3">Tekrar</th>
                </tr>
              </thead>
              <tbody>
                {stats.users.map((u) => (
                  <tr key={u.id} className="border-t border-cream-darker hover:bg-cream/50">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0"
                          style={{ backgroundColor: u.avatarColor }}
                        >
                          {u.avatarEmoji}
                        </div>
                        <div>
                          <p className="font-semibold text-charcoal flex items-center gap-1.5">
                            {u.name}
                            {u.role === "admin" && (
                              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                            )}
                          </p>
                          <p className="text-xs text-muted">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full text-white"
                        style={{ backgroundColor: PLAN_COLORS[u.plan] ?? "#7A6B55" }}
                      >
                        {PLAN_LABELS[u.plan] ?? u.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-charcoal text-xs sm:text-sm">{u.level}</td>
                    <td className="px-4 py-3 text-charcoal text-xs sm:text-sm">{u.xp.toLocaleString("tr-TR")}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-charcoal">
                        <Flame className="w-3.5 h-3.5 text-gold" /> {u.streak}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-charcoal text-xs sm:text-sm">{u.cards}</td>
                    <td className="px-4 py-3 text-charcoal text-xs sm:text-sm">{u.reviews}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
