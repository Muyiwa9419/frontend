const TrustRow = () => {
  const items = [
    {
      icon: '🔒',
      title: 'Private',
      text: 'Your identity stays yours.',
    },
    {
      icon: '👤',
      title: 'Anonymous',
      text: 'No real name required.',
    },
    {
      icon: '⚖️',
      title: 'Judgment-free',
      text: 'Say what you need to say.',
    },
  ];

  return (
    <section className="trust-section">
      <div className="section-container">
        <div className="trust-grid">
          {items.map((item) => (
            <div className="trust-card" key={item.title}>
              <div className="trust-icon">{item.icon}</div>

              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustRow;