"use client";

import { useEffect, useState } from "react";
import { CardsStudiedChart, AccuracyChart } from "@/components/progress/ProgressChart";
import CalendarHeatmap from "@/components/progress/CalendarHeatmap";
import { TrendingUp, Target, Zap, Calendar } from "lucide-react";

interface ProgressEntry {
  date: string;
  cardsStudied: number;
  accuracy: number;
}

interface ProgressData {
  entries: ProgressEntry[];
  sessions: Array<{ type: string; cardsStudied: number; accuracy: number; startedAt: string }>;
}

export default function ProgressPage() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [streak, setStreak] = useState({ streak: 0, dailyGoal: 10 });

  useEffect(() => {
    Promise.all([
      fetch("/api/progress").then((r) => r.json()),
      fetch("/api/streak").then((r) => r.json()),
    ]).then(([progress, streakData]) => {
      setData(progress);
      setStreak(streakData);
    });
  }, []);

  const entries = data?.entries ?? [];
  const totalCards = entries.reduce((s, e) => s + e.cardsStudied, 0);
  const avgAccuracy =
    entries.length > 0
      ? Math.round(entries.reduce((s, e) => s + e.accuracy, 0) / entries.length)
      : 0;
  const activeDays = entries.filter((e) => e.cardsStudied > 0).length;
  const recent30 = entries.slice(-30);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-bold text-charcoal">Progress</h1>
        <p className="text-muted text-sm mt-1">Your learning journey over time</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Cards", value: totalCards, icon: TrendingUp, color: "text-crimson" },
          { label: "Avg Accuracy", value: `${avgAccuracy}%`, icon: Target, color: "text-gold" },
          { label: "Active Days", value: activeDays, icon: Calendar, color: "text-charcoal" },
          { label: "Current Streak", value: streak.streak, icon: Zap, color: "text-crimson" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-cream border border-cream-darker rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-xs text-muted uppercase tracking-wider">{label}</span>
            </div>
            <div className="text-2xl font-bold text-charcoal">{value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-cream border border-cream-darker rounded-2xl p-6">
          <h3 className="font-serif font-semibold text-charcoal mb-4">Cards Studied Per Day</h3>
          {recent30.length > 0 ? (
            <CardsStudiedChart entries={recent30} />
          ) : (
            <div className="h-48 flex items-center justify-center text-muted text-sm">
              No data yet. Start studying!
            </div>
          )}
        </div>

        <div className="bg-cream border border-cream-darker rounded-2xl p-6">
          <h3 className="font-serif font-semibold text-charcoal mb-4">Accuracy Over Time</h3>
          {recent30.length > 0 ? (
            <AccuracyChart entries={recent30} />
          ) : (
            <div className="h-48 flex items-center justify-center text-muted text-sm">
              No data yet.
            </div>
          )}
        </div>
      </div>

      {/* Calendar heatmap */}
      <div className="bg-cream border border-cream-darker rounded-2xl p-6">
        <h3 className="font-serif font-semibold text-charcoal mb-4">Activity Calendar</h3>
        <CalendarHeatmap entries={entries} />
      </div>

      {/* Sessions log */}
      {(data?.sessions?.length ?? 0) > 0 && (
        <div className="bg-cream border border-cream-darker rounded-2xl p-6">
          <h3 className="font-serif font-semibold text-charcoal mb-4">Recent Sessions</h3>
          <div className="space-y-2">
            {data!.sessions.map((s, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-cream-darker last:border-0">
                <div>
                  <span className="text-sm font-medium text-charcoal capitalize">{s.type}</span>
                  <span className="text-xs text-muted ml-3">{s.cardsStudied} cards · {Math.round(s.accuracy)}% accuracy</span>
                </div>
                <span className="text-xs text-muted">
                  {new Date(s.startedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
