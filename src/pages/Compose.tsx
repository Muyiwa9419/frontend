import { useState } from 'react';

interface ComposeProps {
  topic: string;
  onBack: () => void;
  onContinue: (message: string) => void;
}

function Compose({
  topic,
  onBack,
  onContinue,
}: ComposeProps) {
  const [message, setMessage] = useState('');

  const canContinue = message.trim().length >= 3;

  const handleContinue = () => {
    const cleanMessage = message.trim();

    if (!cleanMessage) {
      return;
    }

    onContinue(cleanMessage);
  };

  return (
    <main className="flow-page compose-page">
      {/* BACKGROUND GLOW */}
      <div
        className="page-glow page-glow-one"
        aria-hidden="true"
      />

      <div
        className="page-glow page-glow-two"
        aria-hidden="true"
      />

      {/* HEADER */}
      <header className="flow-header">
        <button
          type="button"
          className="back-button"
          onClick={onBack}
          aria-label="Go back"
        >
          ←
        </button>

        <div className="brand-wrap">
          <div className="brand-mark">
            JT
          </div>

          <div className="brand">
            Just Talk
          </div>
        </div>

        <span className="private-label">
          <span className="private-icon">🔒</span>
          Private
        </span>
      </header>

      {/* CONTENT */}
      <section className="flow-container compose-container">
        <div className="compose-intro">
          <p className="eyebrow">
            STEP 2 OF 3
          </p>

          <div className="step-progress">
            <span className="step-dot active" />
            <span className="step-line active" />
            <span className="step-dot active" />
            <span className="step-line" />
            <span className="step-dot" />
          </div>

          <h1>
            Tell us what's
            <span className="gradient-text"> going on.</span>
          </h1>

          <p className="flow-description">
            You don't need to find the perfect words.
            Just start wherever feels easiest.
          </p>
        </div>

        {/* SELECTED TOPIC */}
        <div className="selected-topic-card">
          <div className="selected-topic-icon">
            ◌
          </div>

          <div className="selected-topic-content">
            <span className="selected-topic-label">
              YOUR TOPIC
            </span>

            <span className="selected-topic">
              {topic}
            </span>
          </div>

          <span className="selected-topic-check">
            ✓
          </span>
        </div>

        {/* MESSAGE BOX */}
        <div className="compose-field">
          <div className="compose-field-header">
            <label htmlFor="message">
              What's on your mind?
            </label>

            <span className="compose-hint">
              Be yourself
            </span>
          </div>

          <div
            className={`compose-box ${
              message.trim().length >= 3
                ? 'compose-box-active'
                : ''
            }`}
          >
            <textarea
              id="message"
              value={message}
              onChange={(event) =>
                setMessage(
                  event.target.value.slice(0, 2000)
                )
              }
              placeholder="Write whatever is on your mind..."
              rows={9}
              maxLength={2000}
              autoFocus
            />

            <div className="character-count">
              <span
                className={
                  message.length > 1800
                    ? 'character-count-warning'
                    : ''
                }
              >
                {message.length}
              </span>
              /2000
            </div>
          </div>
        </div>

        {/* PRIVACY NOTICE */}
        <div className="privacy-warning">
          <div className="privacy-warning-icon">
            🔒
          </div>

          <div>
            <strong>Your privacy matters.</strong>

            <p>
              Please don't include passwords, phone
              numbers, addresses, or other identifying
              information.
            </p>
          </div>
        </div>

        {/* CONTINUE */}
        <button
          type="button"
          className="primary-button compose-continue"
          disabled={!canContinue}
          onClick={handleContinue}
        >
          <span>
            Continue
          </span>

          <span className="button-arrow">
            →
          </span>
        </button>

        <p className="compose-footer-note">
          You can take your time. There is no pressure
          to say everything at once.
        </p>
      </section>
    </main>
  );
}

export default Compose;