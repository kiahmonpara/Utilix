import "../styles/feature-section.css"

const suiteFeatures = [
  {
    title: "One-Stop Hub",
    icon: "🧰",
    description: "Unlike existing solutions scattered across multiple websites, this platform brings over 20+ daily-use tools into a single, intuitive interface",
    features: ["Essential tools access", "Intuitive interface", "Integrated ecosystem"],
    proFeatures: ["Premium tools access", "Advanced features", "Priority updates"],
  },
  {
    title: "Dual Mode Access",
    icon: "🔄",
    description: "Choose between Free Tier with lightning-fast access or Power-Packed Paid Tier with advanced features",
    features: ["Lightning-fast access", "Essential tools", "Privacy-focused"],
    proFeatures: ["Advanced tools", "Batch processing", "Cloud features"],
  },
  {
    title: "Audio Tools",
    icon: "🔊",
    description: "Convert text to natural-sounding speech, trim audio clips, and convert formats directly in your browser—great for accessibility and quick edits",
    features: ["Text-to-speech", "Basic audio trimming", "Format conversion"],
    proFeatures: ["Premium voices", "Advanced editing", "Batch processing"],
  },
  {
    title: "Personalization",
    icon: "📌",
    description: "Users can pin their favorite tools, save sessions, or access history—creating a tailored productivity cockpit",
    features: ["Pin favorite tools", "Basic history", "Session saving"],
    proFeatures: ["Extended history", "Cloud sync", "Custom workspace"],
  },
  {
    title: "Ad-Free Experience",
    icon: "✨",
    description: "Unlike many \"free tool\" sites filled with ads, this platform is clean, fast, and focused purely on productivity",
    features: ["No advertisements", "Clean interface", "Fast loading"],
    proFeatures: ["Priority support", "Enhanced performance", "Exclusive features"],
  },
  {
    title: "Multilingual",
    icon: "🌐",
    description: "Multilingual feature to allow user to comfortably surf in their preferred choices",
    features: ["Basic language support", "Interface translation", "Key languages"],
    proFeatures: ["All languages", "Content translation", "Regional settings"],
  },
]

export default function FeatureSection() {
  return (
    <div className="feature-section">
      <h2 className="feature-section-title">Why Choose Innovatrix?</h2>
      <div className="feature-grid">
        {suiteFeatures.map((suite, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-header">
              <div className="feature-icon">{suite.icon}</div>
              <h3 className="feature-title">{suite.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}