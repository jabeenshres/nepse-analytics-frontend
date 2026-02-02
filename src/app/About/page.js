import { FiTarget, FiActivity, FiTrendingUp, FiCpu, FiBarChart2, FiUsers, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import Image from "next/image";

async function About() {
  const features = [
    {
      icon: FiTrendingUp,
      title: "Real-time Market Data",
      description: "Live stock data fetched directly from Nepal Stock Exchange (NEPSE) for accurate and up-to-date insights.",
    },
    {
      icon: FiCpu,
      title: "AI-Powered Predictions",
      description: "Advanced machine learning models including LSTM and Random Forest for accurate price predictions.",
    },
    {
      icon: FiBarChart2,
      title: "Technical Analysis",
      description: "Comprehensive technical indicators including RSI, MACD, Bollinger Bands, and more.",
    },
    {
      icon: FiActivity,
      title: "Unusual Activity Detection",
      description: "Identify accumulation patterns and potential breakout opportunities before they happen.",
    },
    {
      icon: FiTarget,
      title: "Stock Screener",
      description: "Filter stocks based on technical criteria to find the best trading opportunities.",
    },
    {
      icon: FiUsers,
      title: "Portfolio Tracking",
      description: "Track your investments, analyze performance, and manage your trading portfolio.",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.4) 0%, transparent 70%)",
          }}
        />
        <div className="relative py-16 px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">About Share Nepal</span>
          </h1>
          <p className="text-xl text-[var(--foreground-secondary)] max-w-2xl mx-auto">
            Your comprehensive platform for Nepal Stock Exchange analysis, predictions, and portfolio management.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="card p-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed">
            We empower investors, analysts, and financial enthusiasts to make better investment decisions 
            in Nepal&apos;s stock market through advanced technology and data-driven insights. Our platform 
            combines real-time market data with cutting-edge machine learning to provide actionable 
            intelligence for the rapidly evolving NEPSE market.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-center">What We Offer</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="card-hover p-6">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/20 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[var(--color-accent)]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-[var(--foreground-muted)]">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Technology Section */}
      <section className="card p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Our Technology</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-[var(--color-accent)]">LSTM Neural Networks</h3>
            <p className="text-[var(--foreground-secondary)] mb-4">
              Long Short-Term Memory networks excel at capturing temporal patterns in stock data. 
              They remember important information over long sequences, making them ideal for 
              predicting market trends based on historical price movements.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 text-[var(--color-warning)]">Random Forest</h3>
            <p className="text-[var(--foreground-secondary)] mb-4">
              Our Random Forest Regressor combines multiple decision trees to produce robust predictions. 
              This ensemble method reduces overfitting and provides reliable forecasts by aggregating 
              diverse model perspectives.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="card p-8">
          <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/20 flex items-center justify-center flex-shrink-0">
                <FiMapPin className="w-5 h-5 text-[var(--color-accent)]" />
              </div>
              <div>
                <h3 className="font-semibold">Address</h3>
                <p className="text-[var(--foreground-muted)]">Patan-Dhoka, Lalitpur, Nepal</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-success)]/20 flex items-center justify-center flex-shrink-0">
                <FiMail className="w-5 h-5 text-[var(--color-success)]" />
              </div>
              <div>
                <h3 className="font-semibold">Email</h3>
                <a href="mailto:sharenepal@email.com" className="text-[var(--color-accent)] hover:underline">
                  sharenepal@email.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-warning)]/20 flex items-center justify-center flex-shrink-0">
                <FiPhone className="w-5 h-5 text-[var(--color-warning)]" />
              </div>
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-[var(--foreground-muted)]">01-496722</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card overflow-hidden relative min-h-[300px]">
          <Image
            src="/images/sharelogo.jpg"
            alt="Share Nepal"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Disclaimer */}
      <section className="card p-6 border-[var(--color-warning)]/30 bg-[var(--color-warning)]/5">
        <h3 className="font-semibold text-[var(--color-warning)] mb-2">Disclaimer</h3>
        <p className="text-sm text-[var(--foreground-muted)]">
          The predictions and analysis provided by Share Nepal are for informational purposes only and 
          should not be considered as financial advice. Stock market investments carry inherent risks, 
          and past performance is not indicative of future results. Always conduct your own research 
          and consult with a qualified financial advisor before making investment decisions.
        </p>
      </section>
    </div>
  );
}

export default About;
