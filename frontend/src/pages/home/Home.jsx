import React, { useState, useEffect, useRef } from "react";
import "./Home.css";
import mathClassroomBg from "../../assets/math_classroom_bg.jpg";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Testimonials from "../../components/testimonials/Testimonials";
import {
  FaGraduationCap,
  FaRobot,
  FaLaptopCode,
  FaEye,
  FaLightbulb,
  FaCrosshairs,
  FaChartLine,
  FaBookOpen,
  FaRocket,
  FaStar,
  FaArrowRight,
  FaUsers,
  FaAward,
  FaBrain,
  FaInfinity,
  FaCheckCircle,
  FaShieldAlt,
  FaClock,
  FaCalculator,
  FaChalkboardTeacher,
} from "react-icons/fa";

/* ─────────────────────────────────────────────────────────────
   useScrollReveal — adds .sma-revealed when element enters viewport
───────────────────────────────────────────────────────────── */
function useScrollReveal(options = {}) {
  useEffect(() => {
    const targets = document.querySelectorAll(".sma-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("sma-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, ...options }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─────────────────────────────────────────────────────────────
   Animated Counter Hook
───────────────────────────────────────────────────────────── */
function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

/* ─────────────────────────────────────────────────────────────
   Typing Topic Hook
───────────────────────────────────────────────────────────── */
function useTypewriter(words, speed = 80, pause = 1800) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    let timeout;
    if (!deleting && charIdx <= current.length) {
      timeout = setTimeout(() => {
        setDisplay(current.slice(0, charIdx));
        setCharIdx((c) => c + 1);
      }, speed);
    } else if (!deleting && charIdx > current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx >= 0) {
      timeout = setTimeout(() => {
        setDisplay(current.slice(0, charIdx));
        setCharIdx((c) => c - 1);
      }, speed / 2);
    } else {
      setDeleting(false);
      setWordIdx((w) => (w + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

/* ─────────────────────────────────────────────────────────────
   Stats Counter Card
───────────────────────────────────────────────────────────── */
function StatCard({ icon: Icon, target, suffix, label, started, delay }) {
  const count = useCountUp(target, 2000, started);
  return (
    <div
      className="sma-stat-card sma-reveal sma-reveal-up"
      style={{ transitionDelay: delay }}
    >
      <div className="sma-stat-icon-wrap">
        <Icon />
      </div>
      <div className="sma-stat-number">
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="sma-stat-label">{label}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Feature Card
───────────────────────────────────────────────────────────── */
function FeatureCard({
  icon: Icon,
  title,
  description,
  accent,
  index,
  onClick,
  btnLabel,
}) {
  return (
    <div
      className="sma-feature-card sma-reveal sma-reveal-up"
      style={{ "--accent": accent, transitionDelay: `${index * 0.1}s` }}
    >
      <div className="sma-feature-icon-wrap">
        <Icon className="sma-feature-icon" />
      </div>
      <h3 className="sma-feature-title">{title}</h3>
      <p className="sma-feature-desc">{description}</p>
      {onClick && (
        <button className="sma-feature-btn" onClick={onClick}>
          {btnLabel} <FaArrowRight style={{ marginLeft: 6 }} />
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Pillar Card
───────────────────────────────────────────────────────────── */
function PillarCard({ icon: Icon, title, description, color, index }) {
  return (
    <div
      className="sma-pillar-card sma-reveal sma-reveal-up"
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <div className="sma-pillar-icon-ring" style={{ background: color }}>
        <Icon />
      </div>
      <h4 className="sma-pillar-title">{title}</h4>
      <p className="sma-pillar-desc">{description}</p>
      <div className="sma-pillar-check">
        <FaCheckCircle style={{ color: "#0F766E" }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────────── */
const Home = ({ isAuth, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  /* Typed topics for hero highlight */
  const typedTopic = useTypewriter([
    "Calculus & Integration",
    "Algebra & Matrices",
    "Coordinate Geometry",
    "Trigonometry & Vectors",
    "Probability & Statistics",
    "JEE & Board Mathematics",
  ]);

  /* Scroll reveal hook */
  useScrollReveal();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  /* Intersection Observer for stats counter */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.25 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="sma-home">
      {/* ══ FULL-SCREEN SUBTLE MATHEMATICS CLASSROOM BACKGROUND ══ */}
      <div className="sma-home-bg-backdrop" aria-hidden="true">
        <div
          className="sma-home-bg-image"
          style={{ backgroundImage: `url(${mathClassroomBg})` }}
        />
        <div className="sma-home-bg-overlay" />
      </div>

      {/* ══ SUBTLE BACKGROUND MATH WATERMARKS ═══════════════ */}
      <div className="sma-math-watermarks" aria-hidden="true">
        <span className="sma-watermark-sym wm-1">π</span>
        <span className="sma-watermark-sym wm-2">∑</span>
        <span className="sma-watermark-sym wm-3">∫ f(x) dx</span>
        <span className="sma-watermark-sym wm-4">√x</span>
        <span className="sma-watermark-sym wm-5">e^(iπ) + 1 = 0</span>
        <span className="sma-watermark-sym wm-6">a² + b² = c²</span>
        <span className="sma-watermark-sym wm-7">lim x→0</span>
        <span className="sma-watermark-sym wm-8">sin²θ + cos²θ = 1</span>
        <span className="sma-watermark-sym wm-9">∇ × B</span>
        <span className="sma-watermark-sym wm-10">Δy / Δx</span>
      </div>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="sma-hero">
        <div className="sma-hero-container">
          {/* Left Column: Hero Text & Actions */}
          <div className="sma-hero-text-col">
            {/* Trust Badge */}
            <div className="sma-hero-badge">
              <FaStar className="sma-badge-star" />
              <span>Premier Mathematics Coaching &amp; Smart Learning</span>
            </div>

            {/* Main Headline */}
            <h1 className="sma-hero-heading">
              Master Mathematics
              <span className="sma-hero-subheading">with Samarpan Academy</span>
            </h1>

            {/* Dynamic Math Domain Callout */}
            <div className="sma-topic-callout">
              <span className="sma-topic-label">Specialized In:</span>
              <span className="sma-topic-dynamic">{typedTopic}</span>
              <span className="sma-cursor">|</span>
            </div>

            {/* Description */}
            <p className="sma-hero-subtext">
              Build unshakable conceptual foundations with expert-led courses,
              structured problem-solving practice, and intelligent AI tools
              designed for CBSE, State Boards, and JEE preparation.
            </p>

            {/* Action Buttons */}
            <div className="sma-hero-actions">
              <button
                className="sma-btn-primary"
                onClick={() => navigate("/courses")}
              >
                <FaRocket style={{ marginRight: 8 }} />
                Explore Courses
              </button>
              <button
                className="sma-btn-secondary"
                onClick={() => navigate("/ai-tools")}
              >
                <FaRobot style={{ marginRight: 8, color: "#0F766E" }} />
                Try AI Tools
              </button>
            </div>

            {/* Trust Points */}
            <div className="sma-hero-trust">
              <span className="sma-trust-chip">
                <FaCheckCircle className="sma-trust-check" />
                Expert Faculty
              </span>
              <span className="sma-trust-chip">
                <FaCheckCircle className="sma-trust-check" />
                NCERT, Boards &amp; JEE
              </span>
              <span className="sma-trust-chip">
                <FaCheckCircle className="sma-trust-check" />
                AI Practice Quizzes
              </span>
            </div>
          </div>

          {/* Right Column: Realistic Classroom & Math Visual Showcase */}
          <div className="sma-hero-visual-col">
            <div className="sma-academic-card">
              {/* Card Header */}
              <div className="sma-academic-header">
                <div className="sma-card-header-left">
                  <span className="sma-status-dot"></span>
                  <span className="sma-academic-title">
                    Classroom Concept Board
                  </span>
                </div>
                <span className="sma-academic-tag">Mathematics Foundation</span>
              </div>

              {/* Board Body with Educational Equations & Diagrams */}
              <div className="sma-chalkboard-content">
                <div className="sma-board-topline">
                  <div className="sma-board-formula">
                    <span className="sma-math-tag">Calculus</span>
                    <span className="sma-math-eq">
                      ∫ xⁿ dx = (xⁿ⁺¹)/(n+1) + C
                    </span>
                  </div>
                  <div className="sma-board-formula">
                    <span className="sma-math-tag">Algebra</span>
                    <span className="sma-math-eq">
                      x = [-b ± √(b² - 4ac)] / 2a
                    </span>
                  </div>
                </div>

                {/* Geometric / Graph SVG Illustration */}
                <div className="sma-math-graphic-wrap">
                  <svg
                    viewBox="0 0 360 140"
                    className="sma-math-svg"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Grid Lines */}
                    <path
                      d="M10 20 H350 M10 50 H350 M10 80 H350 M10 110 H350"
                      stroke="#E2E8F0"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                    <path
                      d="M60 10 V130 M120 10 V130 M180 10 V130 M240 10 V130 M300 10 V130"
                      stroke="#E2E8F0"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />

                    {/* Coordinate Axes */}
                    <line
                      x1="30"
                      y1="75"
                      x2="340"
                      y2="75"
                      stroke="#94A3B8"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="180"
                      y1="10"
                      x2="180"
                      y2="130"
                      stroke="#94A3B8"
                      strokeWidth="1.5"
                    />

                    {/* Smooth Parabola Curve */}
                    <path
                      d="M70 120 Q 180 -10 290 120"
                      stroke="#0F766E"
                      strokeWidth="3"
                      fill="none"
                    />

                    {/* Sine Wave */}
                    <path
                      d="M40 75 Q 75 35 110 75 T 180 75 T 250 75 T 320 75"
                      stroke="#D97706"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      fill="none"
                    />

                    {/* Key Coordinate Points */}
                    <circle cx="180" cy="20" r="5" fill="#172554" />
                    <text
                      x="190"
                      y="24"
                      fill="#172554"
                      fontSize="11"
                      fontWeight="700"
                    >
                      Vertex (h, k)
                    </text>

                    <circle cx="110" cy="75" r="4" fill="#0F766E" />
                    <text
                      x="90"
                      y="92"
                      fill="#0F766E"
                      fontSize="10"
                      fontWeight="600"
                    >
                      Roots x₁
                    </text>

                    <circle cx="250" cy="75" r="4" fill="#0F766E" />
                    <text
                      x="255"
                      y="92"
                      fill="#0F766E"
                      fontSize="10"
                      fontWeight="600"
                    >
                      x₂
                    </text>
                  </svg>
                </div>

                {/* Additional Formula Badges */}
                <div className="sma-board-bottomline">
                  <span className="sma-pill-eq">
                    📐 sin²θ + cos²θ = 1
                  </span>
                  <span className="sma-pill-eq">
                    📏 a² + b² = c²
                  </span>
                  <span className="sma-pill-eq">
                    ∑ n = n(n+1)/2
                  </span>
                </div>
              </div>

              {/* Floating Academic Badges */}
              <div className="sma-floating-badge badge-top-right">
                <div className="sma-float-icon-wrap" style={{ background: "#FEF3C7" }}>
                  <FaStar style={{ color: "#D97706" }} />
                </div>
                <div>
                  <div className="sma-float-title">4.9 / 5 Rating</div>
                  <div className="sma-float-subtitle">12,000+ Students</div>
                </div>
              </div>

              <div className="sma-floating-badge badge-bottom-left">
                <div className="sma-float-icon-wrap" style={{ background: "#CCFBF1" }}>
                  <FaCheckCircle style={{ color: "#0F766E" }} />
                </div>
                <div>
                  <div className="sma-float-title">98% Clarity Rate</div>
                  <div className="sma-float-subtitle">Concept Mastery</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS SECTION ═════════════════════════════════════ */}
      <section className="sma-stats-section" ref={statsRef}>
        <div className="sma-section-inner">
          <div className="sma-stats-grid">
            <StatCard
              icon={FaUsers}
              target={12000}
              suffix="+"
              label="Students Enrolled"
              started={statsVisible}
              delay="0s"
            />
            <StatCard
              icon={FaBookOpen}
              target={80}
              suffix="+"
              label="Comprehensive Courses"
              started={statsVisible}
              delay="0.1s"
            />
            <StatCard
              icon={FaAward}
              target={98}
              suffix="%"
              label="Concept Clarity Rate"
              started={statsVisible}
              delay="0.2s"
            />
            <StatCard
              icon={FaInfinity}
              target={500}
              suffix="+"
              label="AI Practice Quizzes"
              started={statsVisible}
              delay="0.3s"
            />
          </div>
        </div>
      </section>

      {/* ══ WHY SAMARPAN ═════════════════════════════════════ */}
      <section className="sma-section sma-section-warm">
        <div className="sma-section-inner">
          <div className="sma-section-header sma-reveal sma-reveal-up">
            <span className="sma-section-pill">Why Samarpan</span>
            <h2 className="sma-section-title">
              Why Choose <span className="sma-navy-highlight">Samarpan</span> Math Academy?
            </h2>
            <p className="sma-section-subtitle">
              A comprehensive mathematical learning ecosystem combining master
              pedagogy, structured problem sheets, and intelligent AI tools.
            </p>
          </div>
          <div className="sma-features-grid">
            <FeatureCard
              index={0}
              icon={FaChalkboardTeacher}
              title="Expert-Led Masterclasses"
              description="Learn from experienced mathematics faculty who break down complex formulas, theorems, and proofs into crystal-clear intuitive steps."
              accent="#172554"
            />
            <FeatureCard
              index={1}
              icon={FaRobot}
              title="Intelligent AI Practice"
              description="Generate chapter-wise practice quizzes, master key formulas on demand, and receive personalized study recommendations 24/7."
              accent="#0F766E"
              onClick={() => navigate("/ai-tools")}
              btnLabel="Try AI Tools"
            />
            <FeatureCard
              index={2}
              icon={FaLaptopCode}
              title="Structured & Flexible"
              description="Access structured video lectures, downloadable notes, and graded problem sets anytime, anywhere, at your own individual pace."
              accent="#D97706"
            />
            <FeatureCard
              index={3}
              icon={FaShieldAlt}
              title="Proven Exam Pedagogy"
              description="Thoroughly mapped to CBSE, State Board, and JEE syllabus requirements with a proven track record of top student scores."
              accent="#1E3A8A"
            />
          </div>
        </div>
      </section>

      {/* ══ OUR VISION & PHILOSOPHY ═══════════════════════════ */}
      <section className="sma-vision-section">
        <div className="sma-section-inner sma-vision-inner">
          <div className="sma-vision-icon-wrap sma-reveal sma-reveal-zoom">
            <FaEye />
          </div>
          <span
            className="sma-section-pill sma-reveal sma-reveal-up"
            style={{ transitionDelay: "0.1s" }}
          >
            Our Philosophy
          </span>
          <h2
            className="sma-section-title sma-reveal sma-reveal-up"
            style={{ marginTop: 12, transitionDelay: "0.2s" }}
          >
            Conquering the Fear of Mathematics
          </h2>
          <p
            className="sma-vision-text sma-reveal sma-reveal-up"
            style={{ transitionDelay: "0.3s" }}
          >
            At Samarpan Math Academy, we believe mathematics is not about rote
            memorization — it is the art of clear, logical thinking. Our
            mission is to transform mathematics from an intimidating hurdle
            into a student's greatest academic strength through foundational
            clarity, guided problem solving, and modern learning technology.
          </p>
          <div
            className="sma-vision-perks sma-reveal sma-reveal-up"
            style={{ transitionDelay: "0.4s" }}
          >
            {[
              { icon: FaClock, label: "Self-Paced Learning" },
              { icon: FaBrain, label: "Adaptive Difficulty" },
              { icon: FaChartLine, label: "Progress Tracking" },
              { icon: FaCalculator, label: "Formula Mastery" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="sma-vision-perk">
                <Icon className="sma-perk-icon" />
                <span>{label}</span>
              </div>
            ))}
          </div>
          <Link
            to="/about"
            className="sma-btn-primary sma-reveal sma-reveal-up"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              marginTop: 32,
              transitionDelay: "0.5s",
            }}
          >
            Learn More About Our Faculty <FaArrowRight style={{ marginLeft: 8 }} />
          </Link>
        </div>
      </section>

      {/* ══ TESTIMONIALS ═════════════════════════════════════ */}
      <section className="sma-section sma-section-warm">
        <div className="sma-section-inner">
          <div className="sma-section-header sma-reveal sma-reveal-up">
            <span className="sma-section-pill">Student Stories</span>
            <h2 className="sma-section-title">
              Hear from Our <span className="sma-navy-highlight">Students</span>
            </h2>
            <p className="sma-section-subtitle">
              Authentic feedback and success stories from students preparing for
              Board exams, Olympiads, and JEE.
            </p>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* ══ WHAT SETS US APART ═══════════════════════════════ */}
      <section className="sma-section sma-section-white">
        <div className="sma-section-inner">
          <div className="sma-section-header sma-reveal sma-reveal-up">
            <span className="sma-section-pill">The Samarpan Advantage</span>
            <h2 className="sma-section-title">
              What <span className="sma-navy-highlight">Sets Us Apart</span>
            </h2>
            <p className="sma-section-subtitle">
              Every lesson, problem sheet, and AI tool is designed to deliver
              measurable academic results.
            </p>
          </div>
          <div className="sma-pillars-grid">
            <PillarCard
              index={0}
              icon={FaLightbulb}
              color="#FEF3C7"
              title="First-Principles Clarity"
              description="Master the fundamental 'why' behind every mathematical theorem before practicing exam questions."
            />
            <PillarCard
              index={1}
              icon={FaCrosshairs}
              color="#FFE4E6"
              title="Targeted Problem Sets"
              description="Curated question banks graded from NCERT fundamentals up to advanced competitive exam level."
            />
            <PillarCard
              index={2}
              icon={FaChartLine}
              color="#E0E7FF"
              title="Diagnostic Analytics"
              description="Identify weak topics and knowledge gaps quickly with intelligent performance insights."
            />
            <PillarCard
              index={3}
              icon={FaBookOpen}
              color="#CCFBF1"
              title="Rich Academic Library"
              description="Full video solutions, downloadable formula handbooks, and previous years' solved question papers."
            />
          </div>
        </div>
      </section>

      {/* ══ CTA SECTION ═══════════════════════════════════════ */}
      <section className="sma-cta-section">
        <div className="sma-section-inner sma-cta-inner">
          <div className="sma-cta-icon-ring sma-reveal sma-reveal-zoom">
            <FaGraduationCap />
          </div>
          <h2
            className="sma-cta-title sma-reveal sma-reveal-up"
            style={{ transitionDelay: "0.15s" }}
          >
            Ready to Master Mathematics with Confidence?
          </h2>
          <p
            className="sma-cta-subtitle sma-reveal sma-reveal-up"
            style={{ transitionDelay: "0.25s" }}
          >
            Join over 12,000 students achieving academic excellence with
            Samarpan Math Academy today.
          </p>
          <div
            className="sma-reveal sma-reveal-up"
            style={{ transitionDelay: "0.35s" }}
          >
            {!isAuth ? (
              <button
                className="sma-btn-cta"
                onClick={() => navigate("/register")}
              >
                Sign Up Today — Start Learning
                <FaArrowRight style={{ marginLeft: 10 }} />
              </button>
            ) : (
              <button
                className="sma-btn-cta"
                onClick={() => navigate(`/${user?._id || "dashboard"}/dashboard`)}
              >
                Go to My Dashboard
                <FaArrowRight style={{ marginLeft: 10 }} />
              </button>
            )}
          </div>
          <p
            className="sma-cta-note sma-reveal sma-reveal-up"
            style={{ transitionDelay: "0.45s" }}
          >
            Free registration &bull; Access free practice modules &bull; Trusted
            by teachers &amp; parents
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;

