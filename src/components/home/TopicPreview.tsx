import { topics } from '../../data/topics';

interface TopicPreviewProps {
  onStart: () => void;
}

const TopicPreview = ({ onStart }: TopicPreviewProps) => {
  return (
    <section className="topics-section">
      <div className="section-container">
        <div className="section-heading topics-heading">
          <span className="eyebrow">YOU CAN TALK ABOUT</span>

          <h2>
            Whatever is
            <span> on your mind.</span>
          </h2>

          <p>
            There is no perfect way to start. Pick what feels closest, or just
            tell us what's happening.
          </p>
        </div>

        <div className="topic-preview-grid">
          {topics.slice(0, 6).map((topic) => (
            <button
              type="button"
              className="topic-preview-card"
              key={topic.title}
              onClick={onStart}
            >
              <span className="topic-preview-icon">{topic.icon}</span>

              <span className="topic-preview-content">
                <strong>{topic.title}</strong>
                <small>{topic.description}</small>
              </span>

              <span className="topic-arrow">→</span>
            </button>
          ))}
        </div>

        <button type="button" className="topic-more" onClick={onStart}>
          See all topics <span>→</span>
        </button>
      </div>
    </section>
  );
};

export default TopicPreview;