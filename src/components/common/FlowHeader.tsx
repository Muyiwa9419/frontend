import Logo from './Logo';

interface FlowHeaderProps {
  onBack?: () => void;
  step?: string;
}

const FlowHeader = ({ onBack, step }: FlowHeaderProps) => {
  return (
    <header className="flow-header">
      <div className="flow-header-inner">
        <button
          type="button"
          className="flow-back"
          onClick={onBack}
          aria-label="Go back"
        >
          ←
        </button>

        <Logo />

        <div className="flow-step">
          {step && <span>{step}</span>}
        </div>
      </div>
    </header>
  );
};

export default FlowHeader;