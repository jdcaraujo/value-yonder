import { FadeIn } from "@/components/fade-in";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About — Value Yonder",
  description: "Principal PM specialising in AI, based in Lisbon.",
  path: "/about",
});

const timeline = [
  {
    year: "Today",
    role: "Principal Product Manager",
    company: "Zendesk",
    body: "Since March 2025. Leading Admin Copilot — an AI assistant that helps support teams configure and manage Zendesk without needing to become experts in it. The question I keep coming back to: when AI moves from answering questions to executing changes, does it still need a human in the loop — and if so, where exactly?",
  },
  {
    year: "2020",
    role: "Group Product Manager",
    company: "OutSystems",
    body: "Built a new product line inside a company that had sold the same product for 20 years. Five years learning what that tension actually feels like. 2020–2025.",
  },
  {
    year: "2015",
    role: "Co-founder & CEO",
    company: "Attentive",
    body: "Conversational AI assistant for enterprise teams. Raised €1.5M, Techstars Boulder, Top 10 B2B Startups in Europe (Wired, twice). Customers across 4 continents. Shut down in 2020 — not out of money, out of energy.",
  },
  {
    year: "2012",
    role: "Co-founder",
    company: "NovaWeb.pt",
    body: "Built with Pedro while still at Google. A directory, job board, and news hub for the Portuguese startup ecosystem — launched before the Lisbon scene had a name. 2012–2015.",
  },
  {
    year: "2010",
    role: "Analyst",
    company: "Google — Dublin & London",
    body: "Nearly five years across three roles. Community management in Dublin, then industry analyst and research lead in London. D3.js, SQL, and the slow realisation that having data and understanding it are very different things. 2010–2015.",
  },
];

export default function AboutPage() {
  return (
    <div className="px-6 pt-28 pb-24 max-w-3xl mx-auto">
      {/* Intro */}
      <FadeIn>
        <p className="text-sm font-semibold uppercase tracking-widest mb-6" style={{ color: "#06b6d4" }}>
          About
        </p>
        <p className="text-lg md:text-xl text-neutral-300 leading-relaxed mb-4">
          I&apos;m a principal product manager specialising in AI, based in Lisbon, Portugal.
        </p>
        <p className="text-neutral-400 leading-relaxed mb-4 text-[1.35rem]">
          Currently at <span className="text-white font-medium">Zendesk</span>, where I lead the Admin Copilot — an AI-powered product that helps support teams configure and manage their operations. It sits at the intersection of LLMs, enterprise workflow, and the messiness of real support organisations.
        </p>
        <p className="text-neutral-400 leading-relaxed mb-4 text-[1.35rem]">
          No ML degree. Product-first, not engineering-first. I care about what AI actually does for people, not what it theoretically could.
        </p>
        <p className="text-neutral-400 leading-relaxed mb-16 text-[1.35rem]">
          This site is where I think out loud — about strategy, product, org design, and occasionally what I&apos;ve learned the hard way.
        </p>
      </FadeIn>

      {/* Divider */}
      <div className="mb-12 h-px" style={{ background: "#1e1f28" }} />

      {/* Career timeline */}
      <FadeIn>
        <h2 className="text-xl font-bold text-white mb-10">Career</h2>
      </FadeIn>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[72px] top-0 bottom-0 w-px" style={{ background: "#1e1f28" }} />

        <div className="space-y-10">
          {timeline.map((item, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="flex gap-6">
                {/* Year */}
                <div className="w-16 shrink-0 pt-1 text-right">
                  <span className="text-xs font-semibold text-neutral-600">{item.year}</span>
                </div>

                {/* Dot */}
                <div className="relative flex items-start pt-1.5">
                  <div className="w-2 h-2 rounded-full shrink-0 z-10" style={{ background: "#06b6d4", boxShadow: "0 0 8px rgba(6,182,212,0.5)" }} />
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-2" style={{ background: "#1e1f28", color: "#06b6d4" }}>
                    {item.role}
                  </span>
                  <h3 className="text-base font-semibold text-white mb-2">{item.company}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{item.body}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Contact */}
      <FadeIn delay={0.5}>
        <div className="mt-16 p-6 rounded-2xl" style={{ background: "rgba(6,182,212,0.04)", border: "1px solid rgba(6,182,212,0.12)" }}>
          <p className="text-neutral-400 text-sm leading-relaxed mb-4">
            If you&apos;re working on the org design questions that come with AI — or just want to compare notes —{" "}
            <a href="mailto:jdc.araujo@gmail.com" className="underline underline-offset-2 hover:text-cyan-400 transition-colors" style={{ color: "#06b6d4" }}>
              get in touch
            </a>.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/danielaraujopt/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-cyan-300"
              style={{ color: "#06b6d4" }}
            >
              LinkedIn →
            </a>
            <a
              href="https://x.com/JDanielAraujo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-cyan-300"
              style={{ color: "#06b6d4" }}
            >
              X / Twitter →
            </a>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
