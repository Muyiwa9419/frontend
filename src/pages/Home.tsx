interface HomeProps {
  onStart: () => void;
  onCommunity: () => void;
  onLogin: () => void;
}

function Home({
  onStart,
  onCommunity,
  onLogin,
}: HomeProps) {
  return (
    <main
      className="jt-home"
      style={{
        backgroundImage: "url('/images/just-talk-home.jpeg')",
      }}
    >
      {/* Header */}
      <header className="jt-home-header">
        <div className="jt-home-brand">
          Just <span>Talk</span>
        </div>

        <div className="jt-home-header-actions">
          {/* Login button for returning clients */}
          <button
            type="button"
            className="jt-home-login-button"
            onClick={onLogin}
            aria-label="Login to your account"
            title="Login"
          >
            <span className="jt-login-icon">↪</span>
            <span>Login</span>
          </button>

          {/* Community button */}
          <button
            type="button"
            className="jt-home-community-button"
            onClick={onCommunity}
            aria-label="Open Community"
            title="Community"
          >
            <span className="jt-community-icon">💬</span>
            <span className="jt-community-label">
              Community
            </span>
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="jt-home-hero">
        <div className="jt-home-badge">
          <span>○</span>
          A private space to be heard
        </div>

        <h1 className="jt-home-title">
          Say what you
          <span> can't say out loud.</span>
        </h1>

        <p className="jt-home-description">
          Talk about what's on your mind without judgment,
          pressure, or the fear of being misunderstood.
        </p>

        {/* Start talking */}
        <button
          type="button"
          className="jt-home-primary"
          onClick={onStart}
        >
          <span>Start talking</span>
          <span className="jt-home-arrow">→</span>
        </button>

        <div className="jt-home-privacy">
          <span className="jt-lock">🔒</span>
          <span>
            Your conversation starts anonymously.
          </span>
        </div>
      </section>

      {/* Bottom features */}
      <section className="jt-home-features">
        <div className="jt-home-feature">
          <div className="jt-feature-icon">○</div>
          <div>
            <strong>Private</strong>
            <p>
              Share only what you're comfortable sharing.
            </p>
          </div>
        </div>

        <div className="jt-home-feature">
          <div className="jt-feature-icon">○</div>
          <div>
            <strong>Judgment-free</strong>
            <p>
              A space where you can simply be heard.
            </p>
          </div>
        </div>

        <div className="jt-home-feature">
          <div className="jt-feature-icon">○</div>
          <div>
            <strong>Human connection</strong>
            <p>
              Connect with someone when you need it.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="jt-home-footer">
        Just Talk · A private space to be heard
      </footer>
    </main>
  );
}

export default Home;