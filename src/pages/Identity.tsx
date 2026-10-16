
interface IdentityProps {
  message: string;
  onBack: () => void;
  onContinue: () => void;
}

function Identity({
  message,
  onBack,
  onContinue,
}: IdentityProps) {
  return (
    <main className="flow-page">
      <header className="flow-header">
        <button
          type="button"
          className="back-button"
          onClick={onBack}
          aria-label="Go back"
        >
          ←
        </button>

        <div className="brand">Just Talk</div>

        <span className="private-label">
          🔒 Private
        </span>
      </header>

      <section className="flow-container identity-container">
        <p className="eyebrow">STEP 3 OF 3</p>

        <h1>You're almost there.</h1>

        <p className="flow-description">
          Your public identity stays private. You'll use an
          anonymous name inside Just Talk.
        </p>

        <div className="anonymous-card">
          <div className="anonymous-icon">👤</div>

          <div>
            <strong>Anonymous conversation</strong>

            <p>
              We'll give you an anonymous name so you can
              talk without displaying your real name to
              other people.
            </p>
          </div>
        </div>

        <div className="message-preview">
          <span>Your message</span>

          <p>
            {message.length > 180
              ? `${message.slice(0, 180)}...`
              : message}
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={onContinue}
        >
          Enter private conversation
        </button>
      </section>
    </main>
  );
}

export default Identity;

