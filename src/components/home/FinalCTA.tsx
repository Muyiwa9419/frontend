import Button from '../common/Button';

interface FinalCTAProps {
  onStart: () => void;
}

const FinalCTA = ({ onStart }: FinalCTAProps) => {
  return (
    <section className="final-cta">
      <div className="final-cta-glow" />

      <div className="final-cta-content">
        <span className="eyebrow">YOU DON'T HAVE TO KEEP IT IN</span>

        <h2>
          Whatever it is,
          <span> just talk.</span>
        </h2>

        <p>
          No judgment. No pressure. Start with as little or as much as you
          want.
        </p>

        <Button onClick={onStart}>
          Start Talking
          <span>→</span>
        </Button>
      </div>
    </section>
  );
};

export default FinalCTA;