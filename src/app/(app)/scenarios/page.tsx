"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Lightbulb } from "lucide-react";
import ConversationChat from "@/components/conversation/ConversationChat";
import { SCENARIOS, LANGUAGE_CONFIG, type Language, type Scenario } from "@/lib/types";
import { cn } from "@/lib/utils";

const difficultyColors: Record<string, string> = {
  beginner: "text-emerald-600 bg-emerald-50 border-emerald-200",
  intermediate: "text-amber-600 bg-amber-50 border-amber-200",
  advanced: "text-red-600 bg-red-50 border-red-200",
};

export default function ScenariosPage() {
  const [selected, setSelected] = useState<Scenario | null>(null);
  const [language, setLanguage] = useState<Language>("en");
  const [started, setStarted] = useState(false);

  const handleSelectScenario = (scenario: Scenario) => {
    setSelected(scenario);
    const first = scenario.availableLanguages[0];
    if (!scenario.availableLanguages.includes(language)) {
      setLanguage(first);
    }
    setStarted(false);
  };

  const handleBack = () => {
    if (started) {
      setStarted(false);
    } else {
      setSelected(null);
    }
  };

  if (started && selected) {
    return (
      <div className="max-w-2xl mx-auto h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="text-sm text-muted hover:text-charcoal transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="h-4 w-px bg-cream-darker" />
            <span className="text-xl">{selected.emoji}</span>
            <div>
              <p className="font-semibold text-charcoal text-sm">{selected.title}</p>
              <p className="text-xs text-muted">
                {LANGUAGE_CONFIG[language].flag} {LANGUAGE_CONFIG[language].label}
              </p>
            </div>
          </div>
          <span className={cn("text-xs px-2 py-1 rounded-full border font-medium capitalize", difficultyColors[selected.difficulty])}>
            {selected.difficulty}
          </span>
        </div>

        {/* Tips bar */}
        <div className="flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-xl px-4 py-2.5 mb-4 flex-wrap">
          <Lightbulb className="w-3.5 h-3.5 text-gold flex-shrink-0" />
          {selected.tips.map((tip, i) => (
            <span key={i} className="text-xs text-charcoal/70">
              {tip}{i < selected.tips.length - 1 ? " · " : ""}
            </span>
          ))}
        </div>

        <div className="flex-1 bg-cream border-2 border-cream-darker rounded-3xl overflow-hidden">
          <ConversationChat
            language={language}
            difficulty={selected.difficulty}
            scenarioId={selected.id}
            initialMessage={selected.starterPrompt[language]}
          />
        </div>
      </div>
    );
  }

  if (selected) {
    return (
      <div className="max-w-xl mx-auto space-y-6 pt-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-muted hover:text-charcoal transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> All scenarios
        </button>

        <div className="text-center space-y-2">
          <span className="text-5xl">{selected.emoji}</span>
          <h2 className="text-2xl font-serif font-bold text-charcoal">{selected.title}</h2>
          <p className="text-muted text-sm">{selected.description}</p>
          <span className={cn("inline-block text-xs px-3 py-1 rounded-full border font-medium capitalize mt-1", difficultyColors[selected.difficulty])}>
            {selected.difficulty}
          </span>
        </div>

        <div className="bg-cream border-2 border-cream-darker rounded-3xl p-7 space-y-6">
          {/* Language selector */}
          <div>
            <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Practice language</p>
            <div className="flex gap-3">
              {selected.availableLanguages.map((l) => {
                const { flag, label } = LANGUAGE_CONFIG[l];
                return (
                  <button
                    key={l}
                    onClick={() => setLanguage(l)}
                    className={cn(
                      "flex-1 py-3 rounded-xl font-semibold text-sm transition-all",
                      language === l
                        ? "bg-charcoal text-cream"
                        : "bg-cream-dark border border-cream-darker text-muted hover:text-charcoal"
                    )}
                  >
                    {flag} {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scenario preview */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted uppercase tracking-wider">What you'll practise</p>
            <div className="flex flex-wrap gap-2">
              {selected.tips.map((tip, i) => (
                <span
                  key={i}
                  className="text-xs bg-gold/10 text-charcoal/80 border border-gold/20 px-3 py-1.5 rounded-full"
                >
                  {tip}
                </span>
              ))}
            </div>
          </div>

          {/* Starter message preview */}
          <div>
            <p className="text-xs font-medium text-muted uppercase tracking-wider mb-2">Opening line</p>
            <div className="bg-white border border-cream-darker rounded-xl px-4 py-3">
              <p
                className={cn(
                  "text-sm text-charcoal italic",
                  language === "ar" ? "font-arabic text-base text-right" : ""
                )}
                dir={LANGUAGE_CONFIG[language].dir}
              >
                "{selected.starterPrompt[language]}"
              </p>
            </div>
          </div>

          <button
            onClick={() => setStarted(true)}
            className="w-full bg-crimson hover:bg-crimson-light text-cream py-4 rounded-xl font-bold text-lg transition-colors"
          >
            Start Scenario →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-charcoal">Role-play Scenarios</h1>
        <p className="text-muted text-sm mt-1">Practice real-life conversations with an AI partner</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AnimatePresence>
          {SCENARIOS.map((scenario, i) => (
            <motion.button
              key={scenario.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleSelectScenario(scenario)}
              className="text-left bg-cream border-2 border-cream-darker hover:border-crimson/30 rounded-2xl p-5 flex items-start gap-4 group transition-all hover:shadow-md"
            >
              <span className="text-3xl flex-shrink-0 mt-0.5">{scenario.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-semibold text-charcoal group-hover:text-crimson transition-colors">
                    {scenario.title}
                  </p>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium capitalize flex-shrink-0", difficultyColors[scenario.difficulty])}>
                    {scenario.difficulty}
                  </span>
                </div>
                <p className="text-sm text-muted leading-relaxed">{scenario.description}</p>
                <div className="flex items-center gap-1.5 mt-3">
                  {scenario.availableLanguages.map((l) => (
                    <span key={l} className="text-sm">{LANGUAGE_CONFIG[l].flag}</span>
                  ))}
                </div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
