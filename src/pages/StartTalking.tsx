import {
  ArrowRight,
  BriefcaseBusiness,
  ShieldCheck,
  UserRound,
} from 'lucide-react';

interface StartTalkingProps {
  onUser: () => void;
  onProfessional: () => void;
  onBack: () => void;
}

function StartTalking({
  onUser,
  onProfessional,
  onBack,
}: StartTalkingProps) {
  return (
    <main style={styles.page}>

      {/* Header */}
      <header style={styles.header}>

        <button
          type="button"
          onClick={onBack}
          style={styles.backButton}
        >
          ← Back
        </button>

        <div style={styles.brand}>
          Just Talk
        </div>

        <div style={styles.headerSpacer} />

      </header>


      {/* Main content */}
      <section style={styles.content}>

        {/* Intro */}
        <div style={styles.intro}>

          <div style={styles.badge}>
            <ShieldCheck
              size={15}
              strokeWidth={2}
            />

            <span>
              A private space to be heard
            </span>
          </div>


          <h1 style={styles.title}>
            How would you like
            <span style={styles.titleMuted}>
              {' '}to use Just Talk?
            </span>
          </h1>


          <p style={styles.description}>
            Whether you need someone to talk to or want
            to support others, there is a place for you here.
          </p>

        </div>


        {/* Options */}
        <div style={styles.options}>

          {/* User */}
          <button
            type="button"
            onClick={onUser}
            style={{
              ...styles.card,
              ...styles.userCard,
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.transform =
                'translateY(-4px)';
              event.currentTarget.style.borderColor =
                'rgba(52, 211, 153, 0.45)';
              event.currentTarget.style.background =
                'rgba(255, 255, 255, 0.055)';
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.transform =
                'translateY(0)';
              event.currentTarget.style.borderColor =
                'rgba(255, 255, 255, 0.09)';
              event.currentTarget.style.background =
                'rgba(255, 255, 255, 0.035)';
            }}
          >

            <div style={styles.cardGlowUser} />

            <div style={styles.cardContent}>

              <div style={styles.iconUser}>
                <UserRound
                  size={25}
                  strokeWidth={1.8}
                />
              </div>


              <div style={styles.eyebrowUser}>
                I NEED SUPPORT
              </div>


              <h2 style={styles.cardTitle}>
                I need someone to talk to
              </h2>


              <p style={styles.cardText}>
                Talk privately with someone who can listen
                without judgment. You can begin anonymously.
              </p>


              <div style={styles.cardAction}>
                <span>
                  Start a conversation
                </span>

                <ArrowRight
                  size={17}
                  strokeWidth={2}
                />
              </div>

            </div>

          </button>


          {/* Professional */}
          <button
            type="button"
            onClick={onProfessional}
            style={{
              ...styles.card,
              ...styles.professionalCard,
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.transform =
                'translateY(-4px)';
              event.currentTarget.style.borderColor =
                'rgba(167, 139, 250, 0.45)';
              event.currentTarget.style.background =
                'rgba(255, 255, 255, 0.055)';
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.transform =
                'translateY(0)';
              event.currentTarget.style.borderColor =
                'rgba(255, 255, 255, 0.09)';
              event.currentTarget.style.background =
                'rgba(255, 255, 255, 0.035)';
            }}
          >

            <div style={styles.cardGlowProfessional} />

            <div style={styles.cardContent}>

              <div style={styles.iconProfessional}>
                <BriefcaseBusiness
                  size={25}
                  strokeWidth={1.8}
                />
              </div>


              <div style={styles.eyebrowProfessional}>
                I WANT TO HELP
              </div>


              <h2 style={styles.cardTitle}>
                I want to become a professional
              </h2>


              <p style={styles.cardText}>
                Join the Just Talk professional network and
                provide meaningful support to people who need
                someone to listen.
              </p>


              <div style={styles.cardAction}>
                <span>
                  Apply as a professional
                </span>

                <ArrowRight
                  size={17}
                  strokeWidth={2}
                />
              </div>

            </div>

          </button>

        </div>


        {/* Privacy */}
        <div style={styles.privacy}>
          <ShieldCheck
            size={15}
            strokeWidth={1.8}
          />

          <span>
            Your privacy matters. You choose what you share.
          </span>
        </div>

      </section>


      {/* Footer */}
      <footer style={styles.footer}>
        Just Talk · A private space to be heard
      </footer>

    </main>
  );
}


const styles: Record<string, React.CSSProperties> = {

  page: {
    minHeight: '100vh',
    width: '100%',
    boxSizing: 'border-box',
    background:
      'radial-gradient(circle at 50% -20%, rgba(52, 211, 153, 0.08), transparent 38%), #09090b',
    color: '#ffffff',
    padding: '28px 24px 20px',
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },


  header: {
    width: '100%',
    maxWidth: '1120px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },


  backButton: {
    border: '1px solid rgba(255, 255, 255, 0.09)',
    background: 'rgba(255, 255, 255, 0.035)',
    color: '#a1a1aa',
    padding: '9px 14px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.2s ease',
  },


  brand: {
    fontSize: '20px',
    fontWeight: 650,
    letterSpacing: '-0.04em',
  },


  headerSpacer: {
    width: '82px',
  },


  content: {
    width: '100%',
    maxWidth: '1040px',
    margin: '0 auto',
    padding: '72px 0 55px',
  },


  intro: {
    maxWidth: '700px',
    margin: '0 auto 48px',
    textAlign: 'center',
  },


  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 13px',
    borderRadius: '999px',
    border: '1px solid rgba(255, 255, 255, 0.09)',
    background: 'rgba(255, 255, 255, 0.035)',
    color: '#a1a1aa',
    fontSize: '12px',
    marginBottom: '22px',
  },


  title: {
    margin: 0,
    fontSize: 'clamp(36px, 5vw, 58px)',
    lineHeight: 1.05,
    letterSpacing: '-0.055em',
    fontWeight: 650,
  },


  titleMuted: {
    color: '#71717a',
  },


  description: {
    maxWidth: '600px',
    margin: '20px auto 0',
    color: '#a1a1aa',
    fontSize: '16px',
    lineHeight: 1.7,
  },


  options: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '18px',
  },


  card: {
    position: 'relative',
    overflow: 'hidden',
    minHeight: '330px',
    padding: '34px',
    textAlign: 'left',
    borderRadius: '24px',
    border:
      '1px solid rgba(255, 255, 255, 0.09)',
    background:
      'rgba(255, 255, 255, 0.035)',
    color: '#ffffff',
    cursor: 'pointer',
    transition:
      'transform 0.25s ease, border-color 0.25s ease, background 0.25s ease',
    fontFamily: 'inherit',
  },


  userCard: {
    boxShadow:
      'inset 0 1px 0 rgba(255,255,255,0.03)',
  },


  professionalCard: {
    boxShadow:
      'inset 0 1px 0 rgba(255,255,255,0.03)',
  },


  cardGlowUser: {
    position: 'absolute',
    width: '220px',
    height: '220px',
    borderRadius: '50%',
    top: '-120px',
    right: '-80px',
    background:
      'rgba(52, 211, 153, 0.13)',
    filter: 'blur(50px)',
    pointerEvents: 'none',
  },


  cardGlowProfessional: {
    position: 'absolute',
    width: '220px',
    height: '220px',
    borderRadius: '50%',
    top: '-120px',
    right: '-80px',
    background:
      'rgba(167, 139, 250, 0.13)',
    filter: 'blur(50px)',
    pointerEvents: 'none',
  },


  cardContent: {
    position: 'relative',
    zIndex: 1,
  },


  iconUser: {
    width: '54px',
    height: '54px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '16px',
    background:
      'rgba(52, 211, 153, 0.09)',
    border:
      '1px solid rgba(52, 211, 153, 0.2)',
    color: '#34d399',
    marginBottom: '28px',
  },


  iconProfessional: {
    width: '54px',
    height: '54px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '16px',
    background:
      'rgba(167, 139, 250, 0.09)',
    border:
      '1px solid rgba(167, 139, 250, 0.2)',
    color: '#a78bfa',
    marginBottom: '28px',
  },


  eyebrowUser: {
    color: '#34d399',
    fontSize: '11px',
    fontWeight: 650,
    letterSpacing: '0.17em',
    marginBottom: '10px',
  },


  eyebrowProfessional: {
    color: '#a78bfa',
    fontSize: '11px',
    fontWeight: 650,
    letterSpacing: '0.17em',
    marginBottom: '10px',
  },


  cardTitle: {
    margin: 0,
    fontSize: '24px',
    lineHeight: 1.25,
    letterSpacing: '-0.025em',
    fontWeight: 620,
  },


  cardText: {
    maxWidth: '440px',
    margin: '14px 0 0',
    color: '#a1a1aa',
    fontSize: '14px',
    lineHeight: 1.7,
  },


  cardAction: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '28px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 550,
  },


  privacy: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '7px',
    marginTop: '28px',
    color: '#52525b',
    fontSize: '12px',
  },


  footer: {
    textAlign: 'center',
    color: '#3f3f46',
    fontSize: '11px',
    paddingTop: '5px',
  },
};


export default StartTalking;