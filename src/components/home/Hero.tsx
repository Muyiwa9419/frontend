import Button from '../common/Button';

interface HeroProps {
  onStart: () => void;
}

const Hero = ({ onStart }: HeroProps) => {
  return (
    <section className="hero">
      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />

      <div className="hero-content">
        <div className="hero-badge">
          <span className="status-dot" />
          A private space to talk
        </div>

        <h1>
          Say what you
          <span> can't say out loud.</span>
        </h1>

        <p className="hero-description">
          Sometimes you just need somewhere to put your thoughts into words.
          No judgment. No pressure. Just talk.
        </p>

        <div className="hero-actions">
          <Button onClick={onStart}>
            Start Talking
            <span>→</span>
          </Button>

          <p className="hero-note">
            <span>🔒</span>
            No real name required
          </p>
        </div>
      </div>

      <div className="hero-bottom">
        <div className="scroll-indicator">
          <span />
          <span />
          <span />
        </div>

        <p>It's okay to talk.</p>
      </div>
    </section>
  );
};

export default Hero;