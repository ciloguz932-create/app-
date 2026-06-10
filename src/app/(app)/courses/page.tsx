"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, Check, Library, Loader2, Sparkles, Theater } from "lucide-react";
import { COURSES, type Course } from "@/lib/courses";
import { LANGUAGE_CONFIG, SCENARIOS } from "@/lib/types";
import { cn } from "@/lib/utils";

const difficultyColors: Record<string, string> = {
  beginner: "text-emerald-600 bg-emerald-50 border-emerald-200",
  intermediate: "text-amber-600 bg-amber-50 border-amber-200",
  advanced: "text-red-600 bg-red-50 border-red-200",
};

const LEGACY_STORAGE_KEY = "enrolled_courses";

// Enrollments used to live in localStorage; push any leftover local ids
// to the server once, then drop the key.
async function migrateLegacyEnrollments(): Promise<void> {
  try {
    const raw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return;
    const ids = JSON.parse(raw);
    if (Array.isArray(ids)) {
      for (const courseId of ids.filter((v) => typeof v === "string")) {
        await fetch("/api/courses/enroll", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId }),
        }).catch(() => {});
      }
    }
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    /* noop */
  }
}

async function fetchEnrolled(): Promise<string[]> {
  try {
    const res = await fetch("/api/courses/enroll");
    if (!res.ok) return [];
    const data = (await res.json()) as { enrolled?: string[] };
    return data.enrolled ?? [];
  } catch {
    return [];
  }
}

export default function CoursesPage() {
  const router = useRouter();
  const [enrolled, setEnrolled] = useState<string[]>([]);
  const [selected, setSelected] = useState<Course | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ title: string; subtitle?: string } | null>(null);

  useEffect(() => {
    migrateLegacyEnrollments().then(fetchEnrolled).then(setEnrolled);
  }, []);

  const showToast = (title: string, subtitle?: string) => {
    setToast({ title, subtitle });
    window.setTimeout(() => setToast(null), 2800);
  };

  const handleEnroll = async (course: Course) => {
    setLoadingId(course.id);
    try {
      const res = await fetch("/api/courses/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id }),
      });
      const data = (await res.json()) as { added?: number; total?: number; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Enrollment failed");

      setEnrolled((prev) => (prev.includes(course.id) ? prev : [...prev, course.id]));

      showToast(
        `Enrolled in ${course.title}`,
        `${data.added ?? 0} new cards added (of ${data.total ?? course.vocabulary.length})`
      );
    } catch (err) {
      showToast("Enrollment failed", err instanceof Error ? err.message : "Try again");
    } finally {
      setLoadingId(null);
    }
  };

  const handleViewCards = (course: Course) => {
    router.push(`/vocabulary?language=${course.language}`);
  };

  if (selected) {
    const isEnrolled = enrolled.includes(selected.id);
    const scenarioDetails = selected.scenarios
      .map((id) => SCENARIOS.find((s) => s.id === id))
      .filter((s): s is NonNullable<typeof s> => Boolean(s));

    return (
      <div className="max-w-3xl mx-auto space-y-6 pt-2">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-2 text-sm text-muted hover:text-charcoal transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> All courses
        </button>

        <div className="text-center space-y-2">
          <span className="text-5xl">{selected.emoji}</span>
          <h2 className="text-2xl font-serif font-bold text-charcoal">{selected.title}</h2>
          <p className="text-muted text-sm">{selected.description}</p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <span
              className={cn(
                "inline-block text-xs px-3 py-1 rounded-full border font-medium capitalize",
                difficultyColors[selected.difficulty]
              )}
            >
              {selected.difficulty}
            </span>
            <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full border border-cream-darker bg-cream-dark text-muted">
              {LANGUAGE_CONFIG[selected.language].flag} {LANGUAGE_CONFIG[selected.language].label}
            </span>
          </div>
        </div>

        <div className="bg-cream border-2 border-cream-darker rounded-3xl p-7 space-y-6">
          {/* Topics */}
          <div>
            <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Topics covered</p>
            <div className="flex flex-wrap gap-2">
              {selected.topics.map((t) => (
                <span
                  key={t}
                  className="text-xs bg-gold/10 text-charcoal/80 border border-gold/20 px-3 py-1.5 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Vocabulary preview */}
          <div>
            <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">
              Vocabulary ({selected.vocabulary.length} cards)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
              {selected.vocabulary.map((v) => (
                <div
                  key={`${v.word}-${v.translation}`}
                  className="bg-white border border-cream-darker rounded-xl px-3 py-2"
                >
                  <p className="text-sm font-semibold text-charcoal">{v.word}</p>
                  <p className="text-xs text-muted">{v.translation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Linked scenarios */}
          {scenarioDetails.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">
                Recommended scenarios
              </p>
              <div className="flex flex-wrap gap-2">
                {scenarioDetails.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => router.push("/scenarios")}
                    className="flex items-center gap-2 text-sm bg-cream-dark border border-cream-darker hover:border-crimson/30 rounded-xl px-3 py-2 transition-colors"
                  >
                    <span>{s.emoji}</span>
                    <span className="text-charcoal">{s.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => handleEnroll(selected)}
              disabled={loadingId === selected.id}
              className={cn(
                "flex-1 py-4 rounded-xl font-bold text-base transition-colors flex items-center justify-center gap-2",
                isEnrolled
                  ? "bg-cream-dark border border-cream-darker text-charcoal hover:bg-cream-darker"
                  : "bg-crimson hover:bg-crimson-light text-cream"
              )}
            >
              {loadingId === selected.id ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Enrolling…
                </>
              ) : isEnrolled ? (
                <>
                  <Sparkles className="w-4 h-4" /> Re-sync cards
                </>
              ) : (
                <>Enroll →</>
              )}
            </button>
            {isEnrolled && (
              <button
                onClick={() => handleViewCards(selected)}
                className="flex-1 py-4 rounded-xl font-bold text-base bg-charcoal text-cream hover:bg-charcoal/90 transition-colors flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" /> View cards
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-charcoal text-cream rounded-2xl px-5 py-3 shadow-lg flex items-center gap-3 z-50"
            >
              <Check className="w-4 h-4 text-gold" />
              <div>
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.subtitle && <p className="text-xs text-cream/60">{toast.subtitle}</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal flex items-center gap-2">
            <Library className="w-6 h-6 text-crimson" /> Courses
          </h1>
          <p className="text-muted text-sm mt-1">
            Curated topic-based vocabulary, scenarios, and reading material
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted">
          <Theater className="w-3.5 h-3.5" />
          <span>{enrolled.length} enrolled</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AnimatePresence>
          {COURSES.map((course, i) => {
            const isEnrolled = enrolled.includes(course.id);
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-cream border-2 border-cream-darker hover:border-crimson/30 rounded-2xl p-5 flex flex-col gap-4 group transition-all hover:shadow-md"
              >
                <button
                  onClick={() => setSelected(course)}
                  className="text-left flex items-start gap-4"
                >
                  <span className="text-3xl flex-shrink-0 mt-0.5">{course.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-semibold text-charcoal group-hover:text-crimson transition-colors">
                        {course.title}
                      </p>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full border font-medium capitalize flex-shrink-0",
                          difficultyColors[course.difficulty]
                        )}
                      >
                        {course.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-muted leading-relaxed">{course.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {course.topics.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] bg-cream-dark border border-cream-darker text-charcoal/80 px-2 py-0.5 rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                      {course.topics.length > 4 && (
                        <span className="text-[10px] text-muted px-1">
                          +{course.topics.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                <div className="flex items-center justify-between gap-3 pt-2 border-t border-cream-darker">
                  <div className="text-xs text-muted">
                    {course.vocabulary.length} cards ·{" "}
                    {LANGUAGE_CONFIG[course.language].flag}{" "}
                    {LANGUAGE_CONFIG[course.language].label}
                  </div>
                  {isEnrolled ? (
                    <button
                      onClick={() => handleViewCards(course)}
                      className="text-sm font-semibold px-4 py-2 rounded-xl bg-charcoal text-cream hover:bg-charcoal/90 transition-colors flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> View cards
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEnroll(course)}
                      disabled={loadingId === course.id}
                      className="text-sm font-semibold px-4 py-2 rounded-xl bg-crimson text-cream hover:bg-crimson-light transition-colors flex items-center gap-1.5"
                    >
                      {loadingId === course.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Enrolling…
                        </>
                      ) : (
                        <>Enroll</>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-charcoal text-cream rounded-2xl px-5 py-3 shadow-lg flex items-center gap-3 z-50"
          >
            <Check className="w-4 h-4 text-gold" />
            <div>
              <p className="text-sm font-semibold">{toast.title}</p>
              {toast.subtitle && <p className="text-xs text-cream/60">{toast.subtitle}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
