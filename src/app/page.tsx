export default function Home() {
  const links = [
    {
      title: "Portfolio",
      url: "https://yourportfolio.com",
      icon: "💼",
      clicks: "120+",
    },
    {
      title: "GitHub",
      url: "https://github.com",
      icon: "🐙",
      clicks: "340+",
    },
    {
      title: "Twitter",
      url: "https://twitter.com",
      icon: "🐦",
      clicks: "210+",
    },
    {
      title: "YouTube",
      url: "https://youtube.com",
      icon: "▶️",
      clicks: "580+",
    },
    {
      title: "Email",
      url: "mailto:hello@example.com",
      icon: "✉️",
      clicks: "95+",
    },
  ];

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#120808] to-[#1a0808] text-white flex justify-center px-4 py-10 overflow-hidden">
      <div className="w-full max-w-[480px]">
        {/* Profile */}
        <section
          className="relative flex flex-col items-center text-center mb-10 animate-fade-in-up"
          style={{ animationDelay: "0ms" }}
        >
          <div
            aria-hidden
            className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full bg-[#E50914]/25 blur-3xl pointer-events-none"
          />

          <div className="relative w-24 h-24 rounded-full bg-[#E50914] mb-4 ring-4 ring-[#E50914]/20" />

          <h1 className="relative text-2xl font-bold">Your Name</h1>

          <p className="relative text-gray-400 mt-2">
            Vibe Coder ✨ | Building cool stuff with AI
          </p>
        </section>

        {/* Links */}
        <section className="space-y-4">
          {links.map((link, index) => (
            <a
              key={link.title}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="link-card flex flex-col gap-3 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-[#E50914] hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(229,9,20,0.35)] active:scale-[0.97] transition-all duration-300 ease-out animate-fade-in-up backdrop-blur-sm"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{link.icon}</span>

                <div className="min-w-0">
                  <h2 className="font-semibold">{link.title}</h2>
                  <p className="text-sm text-gray-400 truncate">{link.url}</p>
                </div>
              </div>

              <span className="self-start inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-950/80 text-xs font-medium text-[#E50914]">
                🔥 {link.clicks} clicks
              </span>
            </a>
          ))}
        </section>

        {/* Footer */}
        <footer
          className="text-center text-gray-500 mt-10 text-sm animate-fade-in-up"
          style={{ animationDelay: `${(links.length + 1) * 100}ms` }}
        >
          Made with 💚 and vibes
        </footer>
      </div>
    </main>
  );
}
