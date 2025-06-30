import React, { useState, useEffect } from "react";
import {
  FaRocket,
  FaGlobe,
  FaBook,
  FaMagic,
  FaDatabase,
  FaNetworkWired,
  FaPuzzlePiece,
  FaComments,
  FaInfinity,
  FaGithub,
  FaCode,
  FaCube,
  FaChevronRight,
  FaDownload,
  FaPalette,
} from "react-icons/fa";
import { useAppContext } from "../context/AppContext";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

export const Landing: React.FC = () => {
  const { setCurrentPage } = useAppContext();
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 });

  const features: Feature[] = [
    {
      icon: <FaInfinity size={28} />,
      title: "Hierarchical Universe Structure",
      description:
        "Multiverse → Universe → Timeline → World → Civilization. Everything connected.",
      color: "text-flame-blue",
    },
    {
      icon: <FaBook size={28} />,
      title: "Template System",
      description:
        "Create once, instantiate everywhere. Species, tech, items, powers - all reusable with local variations.",
      color: "text-circuit-energy",
    },
    {
      icon: <FaComments size={28} />,
      title: "Context Drops",
      description:
        "Import ChatGPT conversations and annotate them to extract world-building elements.",
      color: "text-flame-cyan",
    },
    {
      icon: <FaNetworkWired size={28} />,
      title: "Graph Visualization",
      description:
        "See how everything connects. Characters, events, locations - all linked in a visual graph.",
      color: "text-circuit-magic",
    },
    {
      icon: <FaDatabase size={28} />,
      title: "Supabase Backend",
      description:
        "Real PostgreSQL database with row-level security. Your data, your control.",
      color: "text-green-400",
    },
    {
      icon: <FaDownload size={28} />,
      title: "JSON Export",
      description:
        "Export all your world-building data as structured JSON. Perfect for backups or migrations.",
      color: "text-flame-cyan",
    },
    {
      icon: <FaCube size={28} />,
      title: "Modular Architecture",
      description:
        "React + TypeScript + Tailwind. Clean, extensible, and ready for your contributions.",
      color: "text-flame-orange",
    },
    {
      icon: <FaPalette size={28} />,
      title: "Exportable Color Themes",
      description:
        "Customize and export color palettes as CSS variables, Tailwind configs, or JSON. Planning for this interface and derivatives.  Perfect for maintaining consistent aesthetics across your projects.",
      color: "text-circuit-magic",
    },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setGlowPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-cosmic-deepest relative overflow-hidden">
      {/* Dynamic glow effect */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `radial-gradient(circle 600px at ${glowPosition.x}px ${glowPosition.y}px, rgba(139, 92, 246, 0.1), transparent)`,
        }}
      />

      {/* Animated background patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-circuit-energy opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-circuit-magic opacity-5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 glass-panel border-b border-cosmic-light border-opacity-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold bg-flame-gradient bg-clip-text text-transparent font-serif">
                Loreum
              </div>
              <div className="text-sm text-glyph-accent">
                World-Building Toolkit
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="#features"
                className="text-glyph-accent hover:text-glyph-bright transition-colors"
              >
                Features
              </a>
              <a
                href="#tech"
                className="text-glyph-accent hover:text-glyph-bright transition-colors"
              >
                Tech Stack
              </a>
              <a
                href="#support"
                className="text-glyph-accent hover:text-glyph-bright transition-colors"
              >
                Support
              </a>
              <a
                href="https://github.com/instancer-kirik/loreum"
                className="text-glyph-accent hover:text-glyph-bright transition-colors flex items-center gap-2"
              >
                <FaGithub size={16} />
                Source
              </a>
              <button
                onClick={() => setCurrentPage("dashboard")}
                className="btn-glowing text-sm"
              >
                Try It Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="mb-4 flex justify-center gap-3">
            <span className="text-sm bg-circuit-magic bg-opacity-20 text-circuit-magic px-3 py-1 rounded-full">
              🏆 Hackathon Project
            </span>
            <span className="text-sm bg-flame-orange bg-opacity-20 text-flame-orange px-3 py-1 rounded-full">
              ⚡ Built with Bolt.new
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-serif mb-6">
            <span className="bg-flame-gradient bg-clip-text text-transparent">
              Build Infinite Worlds
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-glyph-accent mb-8 max-w-3xl mx-auto">
            An open-source toolkit for world-builders. Create interconnected
            universes, manage complex narratives, and never lose track of your
            lore again.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage("dashboard")}
              className="btn-glowing flex items-center gap-2 text-lg"
            >
              <FaRocket />
              Start Building
            </button>
            <a
              href="https://github.com/instancer-kirik/loreum"
              className="glass-panel px-6 py-3 rounded-lg text-glyph-bright hover:bg-cosmic-medium transition-colors flex items-center gap-2"
            >
              <FaGithub />
              View Source
            </a>
          </div>
        </div>

        {/* Quick Demo */}
        <div className="mt-16 glass-panel p-6 rounded-lg max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold text-glyph-bright mb-3">
            Real Example:
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-circuit-magic mb-2">
                Hierarchical Structure:
              </h4>
              <code className="block text-sm text-glyph-accent font-mono">
                Multiverse: "The Infinite Tapestry"
                <br />
                └── Universe: "Aether Spiral"
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;└── Timeline: "Prime Shatter"
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── World:
                "Gaia-7"
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──
                The Technostics
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──
                Crystal Singers
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└──
                Void Spinners
              </code>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-flame-orange mb-2">
                Template System:
              </h4>
              <code className="block text-sm text-glyph-accent font-mono">
                Ipsumarium/
                <br />
                ├── Species/Keldari (Template)
                <br />
                │&nbsp;&nbsp;&nbsp;└── Instances:
                <br />
                │&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── Gaia-7 Keldari
                <br />
                │&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── Void-reborn
                Keldari
                <br />
                └── Magic/Aether Weaving
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;└── Character: Keldari Juno
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(Progression:
                Adept)
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-glyph-bright font-serif mb-4">
            Key Features
          </h2>
          <p className="text-lg text-glyph-accent max-w-2xl mx-auto">
            Built during a hackathon to help get from chat to plan to
            media/code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-panel p-6 rounded-lg hover:scale-105 transition-all duration-300 group"
            >
              <div
                className={`${feature.color} mb-4 group-hover:scale-110 transition-transform`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-glyph-bright mb-2 font-serif">
                {feature.title}
              </h3>
              <p className="text-glyph-accent">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section
        id="tech"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-glyph-bright font-serif mb-4">
            Built With Modern Tech
          </h2>
          <p className="text-lg text-glyph-accent max-w-2xl mx-auto">
            Clean architecture, type-safe code, and a real database.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { name: "React 18", icon: "⚛️", description: "UI Framework" },
            { name: "TypeScript", icon: "📘", description: "Type Safety" },
            { name: "Supabase", icon: "🚀", description: "Backend + Auth" },
            { name: "Tailwind CSS", icon: "🎨", description: "Styling" },
            { name: "PostgreSQL", icon: "🐘", description: "Database" },
            { name: "Vite", icon: "⚡", description: "Build Tool" },
            { name: "D3.js", icon: "📊", description: "Visualizations" },
            { name: "React Query", icon: "🔄", description: "Data Fetching" },
          ].map((tech, index) => (
            <div key={index} className="glass-panel p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">{tech.icon}</div>
              <h3 className="text-sm font-semibold text-glyph-bright">
                {tech.name}
              </h3>
              <p className="text-xs text-glyph-accent">{tech.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Open Source */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="glass-panel p-12 rounded-lg text-center">
          <FaCode size={48} className="mx-auto mb-6 text-circuit-magic" />
          <h2 className="text-4xl font-bold text-glyph-bright font-serif mb-4">
            100% Open Source
          </h2>
          <p className="text-lg text-glyph-accent mb-8 max-w-2xl mx-auto">
            Built because I wanted to. Fork it and add your own features! Use it
            for free?
          </p>
          <div className="flex items-center justify-center gap-6">
            <a
              href="https://github.com/instancer-kirik/loreum"
              className="glass-panel px-4 py-2 rounded-lg text-glyph-accent hover:text-glyph-bright transition-colors flex items-center gap-2"
            >
              <FaGithub size={20} />
              <span>Star on GitHub</span>
            </a>
            <a
              href="https://github.com/instancer-kirik/loreum/fork"
              className="glass-panel px-4 py-2 rounded-lg text-glyph-accent hover:text-glyph-bright transition-colors flex items-center gap-2"
            >
              <FaCode size={20} />
              <span>Fork & Contribute</span>
            </a>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="glass-panel p-12 rounded-lg text-center">
          <div className="text-4xl mb-6">☕</div>
          <h2 className="text-4xl font-bold text-glyph-bright font-serif mb-4">
            Support the Project
          </h2>
          <p className="text-lg text-glyph-accent mb-8 max-w-2xl mx-auto">
            Enjoy! Support if you can; or hire me to build your project.
          </p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <a
              href="https://coff.ee/vawy.scawy"
              className="btn-glowing flex items-center gap-2"
            >
              <span>☕</span>
              <span>Buy Me a Coffee</span>
            </a>
            <a
              href="https://github.com/sponsors/instancer-kirik"
              className="glass-panel px-4 py-2 rounded-lg text-glyph-accent hover:text-glyph-bright transition-colors flex items-center gap-2"
            >
              <FaGithub size={20} />
              <span>GitHub Sponsors</span>
            </a>
            <a
              href="https://instance.select"
              className="glass-panel px-4 py-2 rounded-lg text-glyph-accent hover:text-glyph-bright transition-colors flex items-center gap-2"
            >
              <span>🌐</span>
              <span>Visit My Website</span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="glass-panel p-12 rounded-lg text-center">
          <h2 className="text-4xl font-bold text-glyph-bright font-serif mb-4">
            Start Building Your Universe
          </h2>
          <p className="text-lg text-glyph-accent mb-8 max-w-2xl mx-auto">
            No sign-up required. Just click and start creating.
          </p>
          <button
            onClick={() => setCurrentPage("dashboard")}
            className="btn-glowing flex items-center gap-2 text-lg mx-auto"
          >
            <FaRocket />
            Launch Loreum
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 glass-panel border-t border-cosmic-light border-opacity-20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-lg font-bold bg-flame-gradient bg-clip-text text-transparent font-serif mb-2">
              Loreum
            </div>
            <p className="text-sm text-glyph-accent mb-4">
              Open-source world-building toolkit. Built with ❤️ for creators
              using Bolt.new.
            </p>
            <div className="flex justify-center gap-6 text-glyph-accent">
              <a
                href="https://github.com/instancer-kirik/loreum"
                className="hover:text-glyph-bright transition-colors"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://instance.select"
                className="hover:text-glyph-bright transition-colors"
              >
                🌐
              </a>
            </div>
            <div className="mt-4 text-xs text-glyph-accent">
              MIT License • Hackathon 2024 •{" "}
              <a
                href="https://instance.select"
                className="hover:text-glyph-bright"
              >
                instance.select (please wait 2-3 days for updates - also its
                slow cold start cuz free plan)
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
