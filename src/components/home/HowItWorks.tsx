const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Choose a topic',
      text: 'Pick what feels closest to what you are experiencing.',
    },
    {
      number: '02',
      title: 'Say what you mean',
      text: 'Write freely. You don't have to make everything sound perfect.',
    },
    {
      number: '03',
      title: 'Just talk',
      text: 'Continue the conversation at your own pace.',
    },
  ];

  return (
    <section className="how-section">
      <div className="section-container">
        <div className="section-heading">
          <span className="eyebrow">HOW IT WORKS</span>

          <h2>
            No complicated
            <span> process.</span>
          </h2>
        </div>

        <div className="how-grid">
          {steps.map((step, index) => (
            <div className="how-step" key={step.number}>
              <div className="how-number">{step.number}</div>

              <div className="how-line">
                {index < steps.length - 1 && <span />}
              </div>

              <div className="how-content">
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;