
interface CategoriesProps {
  onBack: () => void;
  onSelect: (topic: string) => void;
}

const topics = [
  {
    icon: '💬',
    title: 'I just need to talk',
    description: 'I have something on my mind and need a safe space.',
  },
  {
    icon: '🧠',
    title: 'Something is bothering me',
    description: 'Something has been weighing on me lately.',
  },
  {
    icon: '❤️',
    title: 'Relationship advice',
    description: 'I want to talk about love, friendship, or relationships.',
  },
  {
    icon: '🙈',
    title: 'I’m embarrassed to ask',
    description: 'It feels difficult to say this out loud.',
  },
  {
    icon: '❓',
    title: 'I need advice',
    description: 'I could use another perspective on something.',
  },
  {
    icon: '👂',
    title: 'I just need someone to listen',
    description: 'I don’t necessarily need advice. I just want to be heard.',
  },
  {
    icon: '✍️',
    title: 'Something else',
    description: 'My reason for talking doesn’t fit these options.',
  },
];

function Categories({
  onBack,
  onSelect,
}: CategoriesProps) {
  return (
    <main className="categories-page">
      {/* Background decoration */}
      <div className="categories-glow glow-one" />
      <div className="categories-glow glow-two" />

      <header className="categories-header">
        <button
          type="button"
          className="category-back-button"
          onClick={onBack}
          aria-label="Go back"
        >
          <span>←</span>
        </button>

        <div className="categories-brand">
          <div className="brand-mark">
            JT
          </div>

          <span>Just Talk</span>
        </div>

        <div className="private-pill">
          <span className="private-dot" />
          <span>Private</span>
        </div>
      </header>

      <section className="categories-container">
        <div className="categories-intro">
          <div className="step-badge">
            <span>01</span>
            <div />
            <span>03</span>
          </div>

          <p className="categories-eyebrow">
            LET'S START SOMEWHERE
          </p>

          <h1>
            What do you
            <span> need to say?</span>
          </h1>

          <p className="categories-description">
            You don't have to explain everything right now.
            Just choose what feels closest to what you're
            going through.
          </p>
        </div>

        <div className="topic-grid">
          {topics.map((topic, index) => (
            <button
              key={topic.title}
              type="button"
              className={`category-card category-card-${index + 1}`}
              onClick={() => {
                console.log('Selected topic:', topic.title);
                onSelect(topic.title);
              }}
            >
              <div className="category-card-top">
                <div className="topic-icon">
                  {topic.icon}
                </div>

                <span className="topic-number">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <div className="category-card-content">
                <h2>{topic.title}</h2>

                <p>
                  {topic.description}
                </p>
              </div>

              <div className="category-card-footer">
                <span>Continue</span>

                <span className="category-arrow">
                  →
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="categories-footer">
          <span className="footer-lock">🔒</span>

          <p>
            Your conversation starts anonymously.
            <br />
            You decide what you want to share.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Categories;

