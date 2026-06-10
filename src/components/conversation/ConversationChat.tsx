"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { LANGUAGE_CONFIG, type Language } from "@/lib/types";
import { useTheme } from "@/components/ThemeProvider";
import { UpgradeModal } from "@/components/UpgradeModal";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ConversationChatProps {
  language: Language;
  difficulty: string;
  scenarioId?: string;
  initialMessage?: string;
}

export default function ConversationChat({ language, difficulty, scenarioId, initialMessage }: ConversationChatProps) {
  const [messages, setMessages] = useState<Message[]>(
    initialMessage ? [{ role: "assistant", content: initialMessage }] : []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { aiProvider } = useTheme();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 160) + "px";
    }
  }, [input]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const assistantMessage: Message = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const response = await fetch("/api/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          language,
          difficulty,
          scenarioId,
          provider: aiProvider,
        }),
      });

      if (response.status === 429) {
        setShowUpgrade(true);
        setMessages((prev) => prev.slice(0, -1)); // drop empty assistant bubble
        setLoading(false);
        return;
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: full };
          return updated;
        });
      }

      // Save session
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "conversation", cardsStudied: 1, accuracy: 100 }),
      });
      await fetch("/api/streak", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const isArabic = language === "ar";
  const langConfig = LANGUAGE_CONFIG[language];

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12 text-muted">
            <Bot className="w-12 h-12 mx-auto mb-4 text-crimson/30" />
            <p className="font-serif text-lg text-charcoal mb-2">Start a conversation</p>
            <p className="text-sm">
              {isArabic
                ? "ابدأ المحادثة بأي موضوع تريده"
                : language === "fr"
                ? "Commencez la conversation sur n'importe quel sujet — votre tuteur corrigera les erreurs."
                : "Say anything in English — your AI tutor will respond and gently correct mistakes."}
            </p>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                  msg.role === "user" ? "bg-crimson" : "bg-charcoal"
                )}
              >
                {msg.role === "user" ? (
                  <User className="w-4 h-4 text-cream" />
                ) : (
                  <Bot className="w-4 h-4 text-cream" />
                )}
              </div>
              <div
                className={cn(
                  "max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-crimson text-cream rounded-tr-sm"
                    : "bg-cream border border-cream-darker text-charcoal rounded-tl-sm",
                  langConfig.fontClass
                )}
                dir={isArabic ? "rtl" : "ltr"}
              >
                {msg.content || (
                  <span className="flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span className="text-xs">thinking…</span>
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-cream-darker p-4">
        <div className="flex gap-3 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={
              isArabic ? "اكتب رسالتك هنا..." :
              language === "fr" ? "Écrivez votre message... (Entrée pour envoyer)" :
              "Type your message... (Enter to send)"
            }
            dir={langConfig.dir}
            rows={1}
            className={cn(
              "flex-1 resize-none bg-cream border border-cream-darker rounded-xl px-4 py-3 text-charcoal placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-crimson/30 transition-all",
              langConfig.fontClass || "text-sm"
            )}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="w-10 h-10 bg-crimson hover:bg-crimson-light text-cream rounded-xl flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
