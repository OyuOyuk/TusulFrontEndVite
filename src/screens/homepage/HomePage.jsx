import "./HomePage.css"
import keyboardImg from "../../assets/bg_images/keyboard.png"
import { useNavigate } from "react-router-dom"

const steps = [
  {
    number: "01",
    title: "Describe your brand",
    body: "Answer a few questions about your business, values, and audience. No design experience needed.",
  },
  {
    number: "02",
    title: "AI builds your book",
    body: "Our AI generates a complete brand identity — colors, fonts, voice, logo direction, and more.",
  },
  {
    number: "03",
    title: "Export & use it",
    body: "Download a polished PDF brand book ready to share with designers, clients, or your team.",
  },
]

function HomePage() {
  const navigate = useNavigate()
  const isLoggedIn = !!localStorage.getItem("token")

  const handleCTA = () => {
    navigate(isLoggedIn ? "/dashboard" : "/login")
  }

  return (
    <div className="hp-root">
      {/* ── Hero ── */}
      <section className="hp-hero">
        <img src={keyboardImg} alt="" className="hp-hero-img" />
        <div className="hp-hero-overlay" />

        <div className="hp-hero-content">
          <p className="hp-eyebrow">AI-Powered Brand Identity</p>
          <h1 className="hp-title">
            Your brand book,<br />
            <span className="hp-title-accent">built in minutes.</span>
          </h1>
          <p className="hp-subtitle">
            Turn your ideas into a complete, professional brand identity —
            no designer required.
          </p>
          <button className="hp-cta" onClick={handleCTA}>
            Start Creating
          </button>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="hp-steps">
        <p className="hp-steps-label">How it works</p>
        <div className="hp-steps-grid">
          {steps.map((s) => (
            <div className="hp-step-card" key={s.number}>
              <span className="hp-step-num">{s.number}</span>
              <h2 className="hp-step-title">{s.title}</h2>
              <p className="hp-step-body">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA banner ── */}
      <section className="hp-banner">
        <h2 className="hp-banner-title">Ready to define your brand?</h2>
        <p className="hp-banner-sub">
          Join hundreds of founders and creators who built their brand book with BrandBooks.
        </p>
        <button className="hp-cta hp-cta--outline" onClick={handleCTA}>
          {isLoggedIn ? "Go to Dashboard" : "Get Started — it's free"}
        </button>
      </section>
    </div>
  )
}

export default HomePage