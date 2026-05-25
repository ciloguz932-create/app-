export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream p-8 text-center">
      <div className="w-20 h-20 bg-crimson/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-10 h-10 text-crimson"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3l18 18M8.111 8.111A5.5 5.5 0 0115.89 15.89M5.636 5.636a9 9 0 0112.728 12.728M1.5 12c0-2.9 1.06-5.55 2.808-7.585M12 2.25A9.75 9.75 0 0121.75 12"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-serif font-bold text-charcoal mb-3">
        You&apos;re offline
      </h1>
      <p className="text-muted max-w-sm leading-relaxed mb-8">
        Lumina Lingua needs an internet connection for AI features. Your vocabulary cards and progress are saved locally.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-crimson text-cream px-6 py-3 rounded-xl font-semibold hover:bg-crimson/90 transition-colors"
      >
        Try again
      </button>
      <p className="mt-6 text-sm font-serif italic text-muted/60">&ldquo;العلم نور&rdquo;</p>
    </div>
  );
}
