import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "./App.css";

gsap.registerPlugin(ScrollTrigger);

type Skill = {
  name: string;
  level: number;
  icon: string;
  tag: string;
};

const skills: Skill[] = [
  { name: "React.js", level: 90, icon: "FE", tag: "FRONTEND" },
  { name: "Node.js", level: 85, icon: "BE", tag: "BACKEND" },
  { name: "MongoDB", level: 80, icon: "DB", tag: "DATA" },
  { name: "TypeScript", level: 85, icon: "TS", tag: "LANG" },
  { name: "Cyber Security", level: 88, icon: "SEC", tag: "SECURITY" },
  { name: "Bug Bounty", level: 82, icon: "VUL", tag: "SECURITY" },
  { name: "Python", level: 78, icon: "PY", tag: "LANG" },
  { name: "Docker & DevOps", level: 72, icon: "OPS", tag: "INFRA" },
];

const projects = [
  {
    name: "MAXTRON AI",
    status: "ACTIVE",
    year: "2026",
    desc: "AI-powered platform focused on automation, deployment, and intelligent systems. Built to push the boundaries of what's possible with machine learning and real-time processing.",
    tech: ["React", "Node.js", "Python", "TensorFlow", "WebSocket"],
    featured: true,
  },
  {
    name: "CYBERWATCH",
    status: "V2.0",
    year: "2025",
    desc: "Real-time threat monitoring and vulnerability scanning dashboard. Aggregates CVE data and provides actionable intelligence for security teams.",
    tech: ["TypeScript", "MongoDB", "Docker", "Nmap", "REST API"],
    featured: false,
  },
  {
    name: "NEXUS PORTAL",
    status: "BETA",
    year: "2025",
    desc: "Full-stack developer collaboration platform with integrated code review, CI/CD pipelines, and AI-assisted debugging capabilities.",
    tech: ["React", "Node.js", "PostgreSQL", "Redis", "GitHub API"],
    featured: false,
  },
  {
    name: "THREATGRID",
    status: "Research",
    year: "2024",
    desc: "Experimental sandbox for analyzing malware behavior and visualizing attack kill-chains in an isolated, logged environment.",
    tech: ["Python", "Docker", "GraphQL", "Kubernetes"],
    featured: false,
  },
];

const navLinks = [
  { label: "WORK", href: "#skills", num: "01" },
  { label: "PROJECTS", href: "#projects", num: "02" },
  { label: "CONTACT", href: "#contact", num: "03" },
];

const LOGO_TEXT = "MAXTRON AI";
const SCRAMBLE_CHARS = "#0@%$&*+/?!<>";

/**
 * DigitalLogo — "Digital Assembly" hero title.
 *
 * Splits MAXTRON AI into individual character spans and scrambles them on
 * mount (random glyphs, RGB-separated text-shadow, positional jitter and
 * horizontal clipping) before locking them into the real letters.
 */
function DigitalLogo({ className = "" }: { className?: string }) {
  const chars = useRef<HTMLSpanElement[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Initial glyphs are scrambled so the title "constructs" itself into the
  // real letters. Deterministic per-index so SSR/paint is stable.
  const initialScramble = useMemo(
    () =>
      LOGO_TEXT.split("").map(
        (char) =>
          char === " "
            ? " "
            : SCRAMBLE_CHARS[
                (char.charCodeAt(0) + SCRAMBLE_CHARS.length) %
                  SCRAMBLE_CHARS.length
              ]
      ),
    []
  );

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const nodes = chars.current;

      nodes.forEach((node, i) => {
        if (!node) return;
        const finalChar = LOGO_TEXT[i];
        const delay = i * 0.06;
        const scrambleSteps = 16 + (i % 6);

        const scrambleTl = gsap.timeline({ delay });

        // 1. Character scrambling (random glyph shuffle spread over time)
        for (let s = 0; s < scrambleSteps; s++) {
          const glyph =
            SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          scrambleTl.set(
            node,
            { textContent: glyph, color: "#39ff14" },
            s * 0.03
          );
        }
        const lockAt = scrambleSteps * 0.03;

        // Lock into final letter
        scrambleTl.set(
          node,
          { textContent: finalChar, color: "#F5FF00" },
          lockAt
        );

        // 2. RGB separation + positional jitter pulses right at lock-in
        scrambleTl
          .set(
            node,
            {
              textShadow:
                "1px 0 #ff003c, -1px 0 #00f0ff, 0 0 20px rgba(57,255,20,.6)",
              x: 2,
            },
            lockAt + 0.02
          )
          .set(
            node,
            {
              textShadow:
                "-2px 0 #ff003c, 2px 0 #00f0ff, 0 0 20px rgba(57,255,20,.6)",
              x: -2,
            },
            lockAt + 0.06
          )
          .set(
            node,
            { textShadow: "0 0 12px rgba(245,255,0,.5)", x: 0 },
            lockAt + 0.1
          );

        // 3. Horizontal clipping slices through the glyph
        scrambleTl.fromTo(
          node,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0 0 0)",
            duration: 0.25,
            ease: "power2.inOut",
          },
          lockAt + 0.12
        );

        // 4. Scanline pass (brightness flash) then stabilize
        scrambleTl
          .to(node, { opacity: 0.25, duration: 0.04 }, lockAt + 0.3)
          .to(node, { opacity: 1, duration: 0.05 }, lockAt + 0.34)
          .to(node, { filter: "brightness(3)", duration: 0.05 }, lockAt + 0.3)
          .to(node, { filter: "brightness(1)", duration: 0.12 }, lockAt + 0.35);
      });
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className={`digital-logo ${className}`} ref={wrapRef} aria-label={LOGO_TEXT}>
      {initialScramble.map((glyph, i) =>
        glyph === " " ? (
          <span className="dl-space" key={i} />
        ) : (
          <span
            className="dl-char"
            ref={(el) => {
              if (el) chars.current[i] = el;
            }}
            key={i}
          >
            {glyph}
          </span>
        )
      )}
      <span className="sr-only">{LOGO_TEXT}</span>
    </div>
  );
}

const terminalCmds = [
  {
    cmd: "cat skills.json",
    out: '{"status": "operational", "specialties": ["AI", "Security", "Full-Stack"], "coffee_consumed": "∞"}',
  },
  {
    cmd: "deploy --target production",
    out: "[ OK ] build complete in 4.2s  [ OK ] deployed to maxtron-cloud",
  },
  {
    cmd: "whoami",
    out: "mahes@maxtron-ai ~ root_access: granted",
  },
  {
    cmd: "scan --scope owasp-top-10",
    out: "found 0 critical  |  2 medium  |  12 info  |  all mitigated",
  },
];

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const heroTagRef = useRef<HTMLDivElement>(null);
  const heroSubtitleRef = useRef<HTMLDivElement>(null);
  const heroDividerRef = useRef<HTMLDivElement>(null);
  const heroDescRef = useRef<HTMLDivElement>(null);
  const heroMetaRef = useRef<HTMLDivElement>(null);
  const heroScrollRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const navLinksRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Force the page to start at the hero on every load/reload so the logo
    // always begins centered instead of in its navbar state from a restored
    // scroll position.
    const prevRestoration =
      (window.history as History & { scrollRestoration?: string })
        .scrollRestoration;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    // ===== LENIS SMOOTH SCROLL (integrated with ScrollTrigger) =====
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.scrollTo(0, { immediate: true });

    lenis.on("scroll", ScrollTrigger.update);
    const rafId = gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      if (!logoRef.current || !navRef.current) return;

      // ===== HERO LOGO -> NAVBAR =====
      gsap.set(logoRef.current, {
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        scale: 1,
      });

      const getTargetCenter = () => {
        const target = navRef.current!.querySelector(
          ".nav-logo-anchor"
        ) as HTMLElement;
        const tr = target.getBoundingClientRect();
        return { x: tr.left + tr.width / 2, y: tr.top + tr.height / 2 };
      };

      const target = getTargetCenter();
      const dx = target.x - window.innerWidth / 2;
      const dy = target.y - window.innerHeight / 2;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.to(heroDescRef.current, { opacity: 0, y: -20, duration: 0.2 })
        .to(
          [heroTagRef.current, heroSubtitleRef.current, heroMetaRef.current],
          { opacity: 0, y: -20, duration: 0.25 },
          "<"
        )
        .to(heroDividerRef.current, {
          opacity: 0,
          scaleX: 0,
          transformOrigin: "left",
          duration: 0.2,
        })
        .to(heroScrollRef.current, { opacity: 0, duration: 0.2 }, "<");

      tl.to(
        logoRef.current,
        { x: dx, y: dy, scale: 0.26, duration: 0.8, ease: "power3.inOut" },
        0
      );

      tl.to(
        navRef.current,
        {
          opacity: 1,
          visibility: "visible",
          pointerEvents: "auto",
          duration: 0.25,
        },
        "-=0.3"
      );

      tl.from(
        navLinksRef.current!.children,
        {
          opacity: 0,
          y: -12,
          stagger: 0.06,
          duration: 0.3,
          pointerEvents: "none",
        },
        "-=0.15"
      );

      // ===== NAV LINK SMOOTH SCROLL (via Lenis) =====
      gsap.utils.toArray<HTMLAnchorElement>("a[href^='#']").forEach((a) => {
        a.addEventListener("click", (e) => {
          e.preventDefault();
          const targetEl = document.querySelector(a.getAttribute("href")!);
          if (targetEl) {
            lenis.scrollTo(targetEl as HTMLElement, { offset: 0, duration: 1.2 });
          }
        });
      });

      // ===== WORK & SKILLS REVEAL (scroll-linked parallax) =====
      gsap.from(".skills-head .gs-item", {
        scrollTrigger: { trigger: "#skills", start: "top 80%" },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });

      gsap.from(".skill-row", {
        scrollTrigger: { trigger: ".skills-list", start: "top 82%" },
        y: 34,
        opacity: 0,
        duration: 0.55,
        stagger: 0.07,
        ease: "power3.out",
      });

      // ===== SKILL BAR FILLS =====
      const skillBars = gsap.utils.toArray<HTMLElement>(".skill-bar-fill");
      skillBars.forEach((bar) => {
        const width = bar.getAttribute("data-width") || "0%";
        gsap.set(bar, { width: "0%" });
        gsap.to(bar, {
          scrollTrigger: { trigger: bar, start: "top 92%" },
          width: width,
          duration: 1.1,
          ease: "power3.out",
        });
        gsap.fromTo(
          bar.parentElement!.querySelector(".skill-level"),
          { textContent: 0 },
          {
            scrollTrigger: { trigger: bar, start: "top 92%" },
            textContent: parseInt(width, 10),
            snap: { textContent: 1 },
            duration: 1.1,
            ease: "power3.out",
          }
        );
      });
      gsap.utils.toArray<HTMLElement>(".skill-level").forEach((el) => {
        el.innerHTML = "0%";
      });

      // ===== PROJECTS REVEAL + HOVER =====
      gsap.from(".project-card", {
        scrollTrigger: { trigger: ".projects-list", start: "top 80%" },
        y: 60,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
      });

      gsap.from(".section-head-fill", {
        scrollTrigger: { trigger: "#projects .section-head", start: "top 85%" },
        scaleX: 0,
        transformOrigin: "left",
        duration: 0.8,
        ease: "power3.out",
      });

      // ===== TERMINAL TYPING =====
      const typeTriggers = gsap.utils.toArray<HTMLElement>(".type-line");
      typeTriggers.forEach((line) => {
        gsap.timeline({
          scrollTrigger: { trigger: line, start: "top 92%" },
        })
          .fromTo(
            line,
            { opacity: 0 },
            { opacity: 1, duration: 0.2, delay: 0 }
          )
          .fromTo(
            line.querySelector(".js-reset"),
            { width: 0 },
            {
              width: "100%",
              duration: 0.5,
              ease: "steps(20)",
              delay: 0.1,
            }
          );
      });

      // ===== TERMINAL BLOCK ENTRANCE =====
      gsap.from(".terminal-block", {
        scrollTrigger: { trigger: ".terminal-block", start: "top 85%" },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      // ===== FOOTER =====
      gsap.from(".footer-content > *", {
        scrollTrigger: { trigger: ".cyber-footer", start: "top 85%" },
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
      });

      // ===== GLOBAL PARALLAX GLOW ON CARDS =====
      gsap.utils.toArray<HTMLElement>(".bg-parallax").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -12 },
          {
            yPercent: 12,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      ScrollTrigger.refresh();
    }, containerRef);

    return () => {
      ctx.revert();
      lenis.destroy();
      gsap.ticker.remove(rafId);
      lenisRef.current = null;
      if ("scrollRestoration" in window.history && prevRestoration) {
        window.history.scrollRestoration = prevRestoration as
          | "auto"
          | "manual";
      }
    };
  }, []);

  return (
    <div className="cyber-container" ref={containerRef}>
      <div className="scanline-overlay" />
      <div className="grid-bg" />

      {/* FIXED LOGO — shared between hero & navbar */}
      <div className="maxtron-logo" ref={logoRef}>
        <DigitalLogo />
      </div>

      {/* STICKY NAVBAR */}
      <nav className="cyber-nav" ref={navRef}>
        <div className="nav-logo-anchor">
          <span className="nav-logo-mini">MAXTRON AI</span>
        </div>
        <div className="nav-links" ref={navLinksRef}>
          {navLinks.map((link) => (
            <a className="nav-link" href={link.href} key={link.label}>
              <span className="nav-link-num">{link.num}</span>
              {link.label}
            </a>
          ))}
          <div className="nav-status">
            <span className="status-dot" />
            SYS.ONLINE
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="cyber-hero" ref={heroRef}>
        <div className="cyber-hero-inner">
          <div className="hero-tag" ref={heroTagRef}>
            initialize_portfolio
          </div>
          <p className="hero-subtitle" ref={heroSubtitleRef}>
            CYBERSECURITY &times; AI &times; ENGINEERING
          </p>
          <div className="hero-divider" ref={heroDividerRef} />
          <p className="hero-desc" ref={heroDescRef}>
            I'm <strong>Mahes</strong> — a Computer Science and Cyber Security
            student passionate about <strong>bug bounty</strong>,{" "}
            <strong>AI systems</strong>, and{" "}
            <strong>full stack development</strong>.
          </p>
          <div className="hero-meta" ref={heroMetaRef}>
            <div className="meta-item">
              LOCATION<span>Sri Lanka</span>
            </div>
            <div className="meta-item">
              STATUS<span style={{ color: "#F5FF00" }}>Available</span>
            </div>
            <div className="meta-item">
              FOCUS<span>AI + Security</span>
            </div>
          </div>
          <div className="hero-scroll" ref={heroScrollRef}>
            <a href="#skills" className="hero-scroll-link">
              [ SCROLL TO EXPLORE &darr; ]
            </a>
          </div>
        </div>
        <div className="hero-logo-placeholder" aria-hidden="true" />
      </section>

      <div className="content-wrapper">
        {/* ===== WORK & SKILLS ===== */}
        <section className="cyber-section" id="skills">
          <div className="section-head skills-head">
            <div className="gs-item section-head-num">01</div>
            <div className="gs-item">
              <h2 className="section-title">Work &amp; Skills</h2>
            </div>
            <div className="section-line gs-item" />
            <div className="gs-item section-head-tag">// capabilities</div>
          </div>

          <div className="skills-layout">
            <div className="skills-card skills-overview">
              <div className="overview-glow bg-parallax" />
              <div className="overview-label">CORE STACK</div>
              <div className="overview-value">8</div>
              <div className="overview-note">certified capabilities</div>
              <div className="overview-tags">
                <span>AI/ML</span>
                <span>Web</span>
                <span>SecOps</span>
                <span>Infra</span>
              </div>
            </div>

            <div className="skills-list">
              {skills.map((skill) => (
                <div className="skill-row" key={skill.name}>
                  <span className="skill-tag">{skill.tag}</span>
                  <span className="skill-icon">[{skill.icon}]</span>
                  <span className="skill-name">{skill.name}</span>
                  <div className="skill-bar-track">
                    <div
                      className="skill-bar-fill"
                      data-width={`${skill.level}%`}
                    />
                  </div>
                  <span className="skill-level">0%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PROJECTS ===== */}
        <section className="cyber-section" id="projects">
          <div className="section-head">
            <div className="section-head-num">02</div>
            <div>
              <h2 className="section-title">Projects</h2>
            </div>
            <div className="section-line" />
            <div className="section-head-tag">// deployments</div>
          </div>

          <div className="projects-list">
            {projects.map((project, i) => (
              <article
                className={`project-card ${project.featured ? "is-featured" : ""}`}
                key={project.name}
              >
                <span className="pc-corner pc-tl" />
                <span className="pc-corner pc-tr" />
                <span className="pc-corner pc-bl" />
                <span className="pc-corner pc-br" />
                <div className="project-meta">
                  <span className="project-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="project-year">{project.year}</span>
                </div>
                <div className="project-body">
                  <div className="project-header">
                    <div className="project-name">{project.name}</div>
                    <div className="project-status">{project.status}</div>
                  </div>
                  <p className="project-desc">{project.desc}</p>
                  <div className="project-tech">
                    {project.tech.map((t) => (
                      <span className="tech-tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ===== TERMINAL ===== */}
        <section className="cyber-section" id="terminal">
          <div className="section-head">
            <div className="section-head-num">03</div>
            <div>
              <h2 className="section-title">Terminal</h2>
            </div>
            <div className="section-line" />
            <div className="section-head-tag">// interactive</div>
          </div>

          <div className="terminal-block">
            <div className="terminal-header">
              <span className="terminal-dot red" />
              <span className="terminal-dot yellow" />
              <span className="terminal-dot green" />
              <span className="terminal-title">maxtron@portfolio ~ %</span>
              <span className="terminal-live">
                <span className="status-dot" /> LIVE
              </span>
            </div>
            <div className="terminal-body">
              {terminalCmds.map((item) => (
                <div className="type-line" key={item.cmd}>
                  <div className="terminal-line">
                    <span className="terminal-prompt">$</span>
                    <span className="terminal-cmd js-reset">{item.cmd}</span>
                    <span className="cursor">&#9608;</span>
                  </div>
                  <div className="terminal-output">{item.out}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="cyber-footer" id="contact">
          <div className="footer-glow bg-parallax" />
          <div className="footer-content">
            <div className="footer-left">
              <div className="footer-title">LET'S CONNECT</div>
              <p className="footer-desc">
                Interested in collaborating on AI projects, security research,
                or just want to say hi? My inbox is always open.
              </p>
            </div>
            <div className="footer-links">
              <a href="mailto:mahes@maxtron.ai" className="footer-link">
                mahes@maxtron.ai
              </a>
              <a
                href="https://github.com/mahes"
                className="footer-link"
                target="_blank"
                rel="noreferrer"
              >
                github.com/mahes
              </a>
              <a
                href="https://linkedin.com/in/mahes"
                className="footer-link"
                target="_blank"
                rel="noreferrer"
              >
                linkedin.com/in/mahes
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copy">
              &copy; 2026 <span>MAXTRON AI</span> // ALL RIGHTS RESERVED
            </div>
            <div className="footer-copy">BUILT WITH REACT + VITE</div>
          </div>
        </footer>
      </div>
    </div>
  );
}
