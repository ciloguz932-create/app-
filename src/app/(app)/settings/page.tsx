"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Zap, Volume2, Target, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme, type AIProvider } from "@/components/ThemeProvider";
import { sounds } from "@/lib/sounds";

interface ServerSettings {
  dailyGoal: number;
  aiProvider: string;
  hasAnthropicKey: boolean;
  hasGeminiKey: boolean;
  hasElevenLabsKey: boolean;
}

const PROVIDERS: { id: AIProvider; label: string; description: string; icon: string }[] = [
  {
    id: "claude",
    label: "Claude (Anthropic)",
    description: "claude-sonnet-4-6 — highest quality reasoning and language accuracy",
    icon: "🧠",
  },
  {
    id: "gemini",
    label: "Gemini (Google)",
    description: "gemini-2.0-flash — fast responses, great multilingual support",
    icon: "✨",
  },
  {
    id: "auto",
    label: "Auto",
    description: "Uses Claude if available, falls back to Gemini automatically",
    icon: "⚡",
  },
];

const GOAL_OPTIONS = [5, 10, 20, 30];

export default function SettingsPage() {
  const { aiProvider, setAIProvider } = useTheme();
  const [serverSettings, setServerSettings] = useState<ServerSettings | null>(null);
  const [dailyGoal, setDailyGoal] = useState(10);
  const [saved, setSaved] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data: ServerSettings) => {
        setServerSettings(data);
        setDailyGoal(data.dailyGoal);
      })
      .catch(() => {});

    const stored = localStorage.getItem("soundEnabled");
    setSoundEnabled(stored === null ? true : stored === "true");
  }, []);

  const handleSave = async () => {
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dailyGoal, aiProvider }),
    });
    sounds.correct();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled);
    localStorage.setItem("soundEnabled", String(enabled));
    if (enabled) sounds.click();
  };

  const StatusDot = ({ ok }: { ok: boolean }) =>
    ok ? (
      <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
        <CheckCircle className="w-3.5 h-3.5" /> Configured
      </span>
    ) : (
      <span className="flex items-center gap-1 text-amber-600 text-xs font-medium">
        <AlertCircle className="w-3.5 h-3.5" /> Not set
      </span>
    );

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-charcoal">Settings</h1>
        <p className="text-muted mt-1">Configure your learning environment</p>
      </div>

      {/* AI Provider */}
      <section className="bg-cream border-2 border-cream-darker rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="w-5 h-5 text-crimson" />
          <h2 className="font-serif text-lg font-semibold text-charcoal">AI Provider</h2>
        </div>
        <p className="text-sm text-muted">
          Choose which AI powers conversation, Feynman, and writing features.
        </p>

        <div className="space-y-3">
          {PROVIDERS.map((p) => {
            const active = aiProvider === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setAIProvider(p.id)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border-2 transition-all",
                  active
                    ? "border-crimson bg-crimson/5"
                    : "border-cream-darker hover:border-crimson/40 bg-cream"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{p.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-charcoal text-sm">{p.label}</p>
                      {active && (
                        <span className="text-[10px] bg-crimson text-cream px-2 py-0.5 rounded-full font-medium">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted mt-0.5">{p.description}</p>
                  </div>
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all",
                      active ? "border-crimson bg-crimson" : "border-muted"
                    )}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* API Key Status */}
      {serverSettings && (
        <section className="bg-cream border-2 border-cream-darker rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-gold" />
            <h2 className="font-serif text-lg font-semibold text-charcoal">API Key Status</h2>
          </div>
          <p className="text-xs text-muted mb-4">
            Set these in your <code className="bg-cream-dark px-1.5 py-0.5 rounded text-charcoal">.env.local</code> file.
          </p>

          <div className="space-y-3">
            {[
              { label: "ANTHROPIC_API_KEY", ok: serverSettings.hasAnthropicKey, note: "Required for Claude" },
              { label: "GEMINI_API_KEY", ok: serverSettings.hasGeminiKey, note: "Required for Gemini" },
              { label: "ELEVENLABS_API_KEY", ok: serverSettings.hasElevenLabsKey, note: "Required for Listening exercises" },
            ].map(({ label, ok, note }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-cream-darker last:border-0">
                <div>
                  <p className="text-sm font-mono text-charcoal">{label}</p>
                  <p className="text-xs text-muted">{note}</p>
                </div>
                <StatusDot ok={ok} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Daily Goal */}
      <section className="bg-cream border-2 border-cream-darker rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-gold" />
          <h2 className="font-serif text-lg font-semibold text-charcoal">Daily Goal</h2>
        </div>
        <p className="text-sm text-muted">How many cards do you want to review each day?</p>

        <div className="flex gap-3 flex-wrap">
          {GOAL_OPTIONS.map((g) => (
            <button
              key={g}
              onClick={() => setDailyGoal(g)}
              className={cn(
                "px-5 py-2.5 rounded-xl font-semibold text-sm transition-all",
                dailyGoal === g
                  ? "bg-gold text-charcoal"
                  : "bg-cream-dark border border-cream-darker text-muted hover:text-charcoal"
              )}
            >
              {g} cards
            </button>
          ))}
        </div>
      </section>

      {/* Sound Effects */}
      <section className="bg-cream border-2 border-cream-darker rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-crimson" />
            <div>
              <p className="font-serif font-semibold text-charcoal">Sound Effects</p>
              <p className="text-xs text-muted">Flip, correct, badge unlock sounds</p>
            </div>
          </div>
          <button
            onClick={() => handleSoundToggle(!soundEnabled)}
            className={cn(
              "w-12 h-6 rounded-full transition-all relative",
              soundEnabled ? "bg-crimson" : "bg-cream-darker"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all",
                soundEnabled ? "left-6" : "left-0.5"
              )}
            />
          </button>
        </div>
      </section>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="bg-crimson hover:bg-crimson-light text-cream px-8 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
        >
          {saved ? <CheckCircle className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
          {saved ? "Saved!" : "Save Settings"}
        </button>
        {saved && (
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm text-emerald-600 font-medium"
          >
            Settings saved successfully
          </motion.p>
        )}
      </div>
    </div>
  );
}
