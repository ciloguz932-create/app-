"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Trash2, BookOpen, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface Card {
  id: string;
  word: string;
  translation: string;
  language: string;
  example?: string | null;
  dueDate: string;
  repetitions: number;
}

export default function VocabularyPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ word: "", translation: "", language: "en", example: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchCards = useCallback(async () => {
    const params = new URLSearchParams();
    if (language !== "all") params.set("language", language);
    if (search) params.set("search", search);
    const res = await fetch(`/api/cards?${params}`);
    setCards(await res.json());
    setLoading(false);
  }, [language, search]);

  useEffect(() => {
    const t = setTimeout(fetchCards, 300);
    return () => clearTimeout(t);
  }, [fetchCards]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.word.trim() || !form.translation.trim()) return;
    setSubmitting(true);
    await fetch("/api/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ word: "", translation: "", language: "en", example: "" });
    setShowForm(false);
    setSubmitting(false);
    fetchCards();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/cards?id=${id}`, { method: "DELETE" });
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  const isDue = (card: Card) => new Date(card.dueDate) <= new Date();

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal">Vocabulary</h1>
          <p className="text-muted text-sm mt-0.5">{cards.length} cards total</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/vocabulary/study"
            className="flex items-center gap-2 bg-crimson hover:bg-crimson-light text-cream px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors"
          >
            <BookOpen className="w-4 h-4" /> Study
          </Link>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-cream border border-cream-darker hover:bg-cream-dark text-charcoal px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Card
          </button>
        </div>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd}
            className="bg-cream border-2 border-cream-darker rounded-2xl p-6 space-y-4 overflow-hidden"
          >
            <h3 className="font-serif font-semibold text-charcoal">Add New Card</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wider">Word / Phrase</label>
                <input
                  value={form.word}
                  onChange={(e) => setForm((f) => ({ ...f, word: e.target.value }))}
                  placeholder={form.language === "ar" ? "الكلمة العربية" : "English word"}
                  dir={form.language === "ar" ? "rtl" : "ltr"}
                  className={cn("w-full bg-white border border-cream-darker rounded-xl px-4 py-2.5 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-crimson/30", form.language === "ar" ? "font-arabic text-base" : "")}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wider">Translation (Turkish)</label>
                <input
                  value={form.translation}
                  onChange={(e) => setForm((f) => ({ ...f, translation: e.target.value }))}
                  placeholder="Türkçe çeviri"
                  className="w-full bg-white border border-cream-darker rounded-xl px-4 py-2.5 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-crimson/30"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wider">Language</label>
                <select
                  value={form.language}
                  onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}
                  className="w-full bg-white border border-cream-darker rounded-xl px-4 py-2.5 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-crimson/30"
                >
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wider">Example sentence (optional)</label>
                <input
                  value={form.example}
                  onChange={(e) => setForm((f) => ({ ...f, example: e.target.value }))}
                  placeholder="Example usage..."
                  dir={form.language === "ar" ? "rtl" : "ltr"}
                  className={cn("w-full bg-white border border-cream-darker rounded-xl px-4 py-2.5 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-crimson/30", form.language === "ar" ? "font-arabic" : "")}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-crimson hover:bg-crimson-light text-cream px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50"
              >
                {submitting ? "Adding..." : "Add Card"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-xl text-muted hover:text-charcoal text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cards..."
            className="w-full bg-cream border border-cream-darker rounded-xl pl-10 pr-4 py-2.5 text-sm text-charcoal placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-crimson/30"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted" />
          {["all", "en", "ar"].map((l) => (
            <button
              key={l}
              onClick={() => setLanguage(l)}
              className={cn(
                "px-3 py-2 rounded-lg text-xs font-semibold transition-colors",
                language === l ? "bg-charcoal text-cream" : "bg-cream border border-cream-darker text-muted hover:text-charcoal"
              )}
            >
              {l === "all" ? "All" : l === "en" ? "English" : "Arabic"}
            </button>
          ))}
        </div>
      </div>

      {/* Cards list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-crimson/20 border-t-crimson rounded-full animate-spin" />
        </div>
      ) : cards.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <BookOpen className="w-10 h-10 mx-auto mb-3 text-muted/30" />
          <p>No cards found</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="flex items-center gap-4 bg-cream border border-cream-darker rounded-2xl px-5 py-4 hover:border-crimson/30 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "font-semibold text-charcoal truncate",
                      card.language === "ar" ? "font-arabic text-lg" : "text-base"
                    )}
                    dir={card.language === "ar" ? "rtl" : "ltr"}
                  >
                    {card.word}
                  </span>
                  {isDue(card) && (
                    <span className="flex-shrink-0 text-[10px] bg-gold/20 text-gold-dark px-2 py-0.5 rounded-full font-medium">
                      due
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted mt-0.5 truncate">{card.translation}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-xs px-2 py-1 rounded-lg font-medium",
                  card.language === "en" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"
                )}>
                  {card.language === "en" ? "EN" : "AR"}
                </span>
                <span className="text-xs text-muted/60">{card.repetitions}×</span>
                <button
                  onClick={() => handleDelete(card.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
