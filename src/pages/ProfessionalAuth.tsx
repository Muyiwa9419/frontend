import { useState } from 'react';

import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';

import {
  auth,
  professionalApi,
} from '../services/api';

interface ProfessionalAuthProps {
  onBack: () => void;
  onAuthenticated: () => void;
}

function ProfessionalAuth({
  onBack,
  onAuthenticated,
}: ProfessionalAuthProps) {
  const [mode, setMode] =
    useState<'register' | 'login'>('register');

  const [showPassword, setShowPassword] =
    useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  const updateField = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError('');
    setSuccess('');
  };

  const switchMode = (
    nextMode: 'register' | 'login'
  ) => {
    setMode(nextMode);
    setError('');
    setSuccess('');

    setForm((previous) => ({
      ...previous,
      password: '',
      confirmPassword: '',
    }));
  };

  const handleRegister = async () => {
    /*
    |--------------------------------------------------------------------------
    | Validate passwords
    |--------------------------------------------------------------------------
    */

    if (
      form.password !==
      form.confirmPassword
    ) {
      setError(
        'Your passwords do not match.'
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Create user account
    |--------------------------------------------------------------------------
    */

    const registration =
      await auth.register(
        form.email.trim().toLowerCase(),
        form.password
      );

    if (!registration.success) {
      throw new Error(
        registration.message ||
          'Unable to create your account.'
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Create authenticated session
    |--------------------------------------------------------------------------
    |
    | Registration creates the account but does not
    | create a login session in your current backend.
    |
    */

    const login =
      await auth.login(
        form.email.trim().toLowerCase(),
        form.password
      );

    if (!login.success) {
      throw new Error(
        login.message ||
          'Your account was created, but we could not sign you in.'
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Create professional profile
    |--------------------------------------------------------------------------
    |
    | New professional applications are automatically
    | PENDING + OFFLINE on the backend.
    |
    */

    const professional =
      await professionalApi.create(
        form.fullName.trim(),
        '',
        []
      );

    if (!professional.success) {
      throw new Error(
        professional.message ||
          'Your account was created, but your professional application could not be submitted.'
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Success
    |--------------------------------------------------------------------------
    */

    setSuccess(
      'Your professional application has been submitted successfully.'
    );

    /*
    |--------------------------------------------------------------------------
    | Continue to dashboard
    |--------------------------------------------------------------------------
    */

    onAuthenticated();
  };

  const handleLogin = async () => {
    /*
    |--------------------------------------------------------------------------
    | Professional login
    |--------------------------------------------------------------------------
    */

    const result =
      await auth.professionalLogin(
        form.email.trim().toLowerCase(),
        form.password
      );

    if (!result.success) {
      throw new Error(
        result.message ||
          'Unable to sign you in.'
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Continue to professional dashboard
    |--------------------------------------------------------------------------
    */

    onContinue();
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'register') {
        await handleRegister();
      } else {
        await handleLogin();
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.page}>
      <div style={styles.layout}>

        {/* =========================================================
            LEFT PANEL
        ========================================================== */}

        <section style={styles.visualPanel}>

          <div style={styles.glowOne} />
          <div style={styles.glowTwo} />

          <div style={styles.visualInner}>

            <button
              type="button"
              onClick={onBack}
              style={styles.backButton}
              disabled={loading}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <div style={styles.visualContent}>

              <div style={styles.professionalIcon}>
                <BriefcaseBusiness
                  size={27}
                  strokeWidth={1.7}
                />
              </div>

              <div style={styles.visualEyebrow}>
                PROFESSIONAL NETWORK
              </div>

              <h1 style={styles.visualTitle}>
                Your experience can
                <span style={styles.visualMuted}>
                  {' '}make someone feel heard.
                </span>
              </h1>

              <p style={styles.visualDescription}>
                Join Just Talk as a verified professional
                and create a safe, meaningful space for
                people who need someone to listen.
              </p>

              <div style={styles.benefits}>

                <Benefit
                  title="Professional identity"
                  description="Professionals use verified identities rather than anonymous profiles."
                />

                <Benefit
                  title="Verification before matching"
                  description="Your application is reviewed before you can support users."
                />

                <Benefit
                  title="Control your availability"
                  description="Decide when you're available to receive conversations."
                />

              </div>

            </div>

            <div style={styles.visualFooter}>
              <ShieldCheck size={15} />
              <span>
                Just Talk takes privacy and verification seriously.
              </span>
            </div>

          </div>

        </section>

        {/* =========================================================
            RIGHT PANEL
        ========================================================== */}

        <section style={styles.formPanel}>

          <div style={styles.formContainer}>

            <button
              type="button"
              onClick={onBack}
              style={styles.mobileBack}
              disabled={loading}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <div style={styles.mobileBrand}>
              Just <span>Talk</span>
            </div>

            <div style={styles.heading}>

              <div style={styles.formEyebrow}>
                {mode === 'register'
                  ? 'PROFESSIONAL REGISTRATION'
                  : 'PROFESSIONAL LOGIN'}
              </div>

              <h2 style={styles.formTitle}>
                {mode === 'register'
                  ? 'Create your professional account'
                  : 'Welcome back'}
              </h2>

              <p style={styles.formDescription}>
                {mode === 'register'
                  ? 'Start your application. You will complete identity and professional verification after creating your account.'
                  : 'Sign in to continue to your professional dashboard.'}
              </p>

            </div>

            {/* =====================================================
                MODE SWITCH
            ====================================================== */}

            <div style={styles.modeSwitch}>

              <button
                type="button"
                onClick={() =>
                  switchMode('register')
                }
                disabled={loading}
                style={{
                  ...styles.modeButton,
                  ...(mode === 'register'
                    ? styles.modeButtonActive
                    : {}),
                }}
              >
                Create account
              </button>

              <button
                type="button"
                onClick={() =>
                  switchMode('login')
                }
                disabled={loading}
                style={{
                  ...styles.modeButton,
                  ...(mode === 'login'
                    ? styles.modeButtonActive
                    : {}),
                }}
              >
                Sign in
              </button>

            </div>

            {/* =====================================================
                ERROR
            ====================================================== */}

            {error && (
              <div style={styles.errorBox}>
                <div style={styles.errorTitle}>
                  Something went wrong
                </div>

                <div style={styles.errorText}>
                  {error}
                </div>
              </div>
            )}

            {/* =====================================================
                SUCCESS
            ====================================================== */}

            {success && (
              <div style={styles.successBox}>
                <CheckCircle2
                  size={18}
                  style={styles.successIcon}
                />

                <div>
                  <div style={styles.successTitle}>
                    Application submitted
                  </div>

                  <div style={styles.successText}>
                    {success}
                  </div>
                </div>
              </div>
            )}

            {/* =====================================================
                FORM
            ====================================================== */}

            <form
              onSubmit={handleSubmit}
              style={styles.form}
            >

              {/* Full name */}

              {mode === 'register' && (
                <div style={styles.field}>

                  <label style={styles.label}>
                    Full name
                  </label>

                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(event) =>
                      updateField(
                        'fullName',
                        event.target.value
                      )
                    }
                    placeholder="Your legal name"
                    required
                    disabled={loading}
                    style={styles.input}
                  />

                </div>
              )}

              {/* Email */}

              <div style={styles.field}>

                <label style={styles.label}>
                  Email address
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    updateField(
                      'email',
                      event.target.value
                    )
                  }
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                  autoComplete="email"
                  style={styles.input}
                />

              </div>

              {/* Password */}

              <div style={styles.field}>

                <label style={styles.label}>
                  Password
                </label>

                <div style={styles.passwordWrapper}>

                  <input
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    value={form.password}
                    onChange={(event) =>
                      updateField(
                        'password',
                        event.target.value
                      )
                    }
                    placeholder={
                      mode === 'register'
                        ? 'Create a strong password'
                        : 'Enter your password'
                    }
                    required
                    minLength={8}
                    disabled={loading}
                    autoComplete={
                      mode === 'register'
                        ? 'new-password'
                        : 'current-password'
                    }
                    style={{
                      ...styles.input,
                      paddingRight: '48px',
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    style={styles.eyeButton}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>

              {/* Confirm password */}

              {mode === 'register' && (
                <div style={styles.field}>

                  <label style={styles.label}>
                    Confirm password
                  </label>

                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(event) =>
                      updateField(
                        'confirmPassword',
                        event.target.value
                      )
                    }
                    placeholder="Repeat your password"
                    required
                    minLength={8}
                    disabled={loading}
                    autoComplete="new-password"
                    style={styles.input}
                  />

                </div>
              )}

              {/* Verification notice */}

              {mode === 'register' && (
                <div style={styles.notice}>

                  <ShieldCheck
                    size={18}
                    style={styles.noticeIcon}
                  />

                  <div>

                    <div style={styles.noticeTitle}>
                      Verification is required
                    </div>

                    <p style={styles.noticeText}>
                      Creating an account does not
                      automatically make you a verified
                      professional. Your identity and
                      professional information will be
                      reviewed before you can be matched
                      with users.
                    </p>

                  </div>

                </div>
              )}

              {/* Submit */}

              <button
                type="submit"
                style={{
                  ...styles.submitButton,
                  ...(loading
                    ? styles.submitButtonLoading
                    : {}),
                }}
                disabled={loading}
              >

                <span>
                  {loading
                    ? mode === 'register'
                      ? 'Creating account...'
                      : 'Signing in...'
                    : mode === 'register'
                      ? 'Continue application'
                      : 'Sign in'}
                </span>

                {!loading && (
                  <ArrowRight size={17} />
                )}

              </button>

            </form>

            {mode === 'register' && (
              <p style={styles.terms}>
                By continuing, you agree to provide
                accurate information during the
                professional verification process.
              </p>
            )}

          </div>

        </section>

      </div>
    </main>
  );
}


/* ================================================================
   BENEFIT COMPONENT
================================================================ */

interface BenefitProps {
  title: string;
  description: string;
}

function Benefit({
  title,
  description,
}: BenefitProps) {
  return (
    <div style={styles.benefit}>

      <CheckCircle2
        size={18}
        style={styles.checkIcon}
      />

      <div>

        <div style={styles.benefitTitle}>
          {title}
        </div>

        <div style={styles.benefitDescription}>
          {description}
        </div>

      </div>

    </div>
  );
}


/* ================================================================
   STYLES
================================================================ */

const styles: Record<
  string,
  React.CSSProperties
> = {

  page: {
    minHeight: '100vh',
    width: '100%',
    boxSizing: 'border-box',
    background: '#09090b',
    color: '#ffffff',
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  layout: {
    minHeight: '100vh',
    width: '100%',
    display: 'grid',
    gridTemplateColumns:
      'minmax(420px, 45%) 1fr',
  },

  visualPanel: {
    position: 'relative',
    overflow: 'hidden',
    minHeight: '100vh',
    borderRight:
      '1px solid rgba(255, 255, 255, 0.08)',
    background:
      'radial-gradient(circle at 20% 20%, rgba(167, 139, 250, 0.08), transparent 35%), #0d0d10',
  },

  glowOne: {
    position: 'absolute',
    width: '360px',
    height: '360px',
    left: '-180px',
    top: '80px',
    borderRadius: '50%',
    background:
      'rgba(167, 139, 250, 0.11)',
    filter: 'blur(100px)',
    pointerEvents: 'none',
  },

  glowTwo: {
    position: 'absolute',
    width: '420px',
    height: '420px',
    right: '-220px',
    bottom: '-180px',
    borderRadius: '50%',
    background:
      'rgba(52, 211, 153, 0.08)',
    filter: 'blur(120px)',
    pointerEvents: 'none',
  },

  visualInner: {
    position: 'relative',
    zIndex: 1,
    minHeight: '100vh',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '32px 48px',
  },

  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    width: 'fit-content',
    padding: '9px 13px',
    borderRadius: '10px',
    border:
      '1px solid rgba(255, 255, 255, 0.09)',
    background:
      'rgba(255, 255, 255, 0.035)',
    color: '#a1a1aa',
    cursor: 'pointer',
    fontSize: '13px',
    fontFamily: 'inherit',
  },

  visualContent: {
    maxWidth: '510px',
    margin: 'auto 0',
    padding: '70px 0',
  },

  professionalIcon: {
    width: '58px',
    height: '58px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '17px',
    border:
      '1px solid rgba(167, 139, 250, 0.22)',
    background:
      'rgba(167, 139, 250, 0.09)',
    color: '#a78bfa',
    marginBottom: '28px',
  },

  visualEyebrow: {
    color: '#a78bfa',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.18em',
    marginBottom: '13px',
  },

  visualTitle: {
    margin: 0,
    fontSize: 'clamp(38px, 4vw, 54px)',
    lineHeight: 1.05,
    letterSpacing: '-0.055em',
    fontWeight: 650,
  },

  visualMuted: {
    display: 'block',
    color: '#71717a',
  },

  visualDescription: {
    maxWidth: '480px',
    margin: '24px 0 0',
    color: '#a1a1aa',
    fontSize: '15px',
    lineHeight: 1.75,
  },

  benefits: {
    display: 'flex',
    flexDirection: 'column',
    gap: '22px',
    marginTop: '40px',
  },

  benefit: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },

  checkIcon: {
    flexShrink: 0,
    marginTop: '2px',
    color: '#34d399',
  },

  benefitTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#e4e4e7',
  },

  benefitDescription: {
    marginTop: '5px',
    maxWidth: '390px',
    color: '#71717a',
    fontSize: '12px',
    lineHeight: 1.6,
  },

  visualFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    color: '#52525b',
    fontSize: '11px',
  },

  formPanel: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '50px 32px',
    boxSizing: 'border-box',
    background: '#09090b',
  },

  formContainer: {
    width: '100%',
    maxWidth: '470px',
  },

  mobileBack: {
    display: 'none',
  },

  mobileBrand: {
    display: 'none',
  },

  heading: {
    marginBottom: '28px',
  },

  formEyebrow: {
    marginBottom: '11px',
    color: '#a78bfa',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.17em',
  },

  formTitle: {
    margin: 0,
    color: '#fafafa',
    fontSize: '32px',
    lineHeight: 1.15,
    letterSpacing: '-0.04em',
    fontWeight: 650,
  },

  formDescription: {
    margin: '13px 0 0',
    color: '#71717a',
    fontSize: '13px',
    lineHeight: 1.7,
  },

  modeSwitch: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4px',
    padding: '4px',
    marginBottom: '25px',
    border:
      '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    background:
      'rgba(255, 255, 255, 0.025)',
  },

  modeButton: {
    height: '40px',
    border: 'none',
    borderRadius: '9px',
    background: 'transparent',
    color: '#71717a',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 600,
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
  },

  modeButtonActive: {
    background: '#ffffff',
    color: '#09090b',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },

  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  label: {
    color: '#d4d4d8',
    fontSize: '12px',
    fontWeight: 500,
  },

  input: {
    width: '100%',
    height: '48px',
    boxSizing: 'border-box',
    padding: '0 14px',
    border:
      '1px solid rgba(255, 255, 255, 0.09)',
    borderRadius: '11px',
    outline: 'none',
    background:
      'rgba(255, 255, 255, 0.035)',
    color: '#ffffff',
    fontSize: '13px',
    fontFamily: 'inherit',
    transition:
      'border-color 0.2s ease',
  },

  passwordWrapper: {
    position: 'relative',
  },

  eyeButton: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    background: 'transparent',
    color: '#71717a',
    cursor: 'pointer',
    padding: '5px',
  },

  notice: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '11px',
    padding: '14px',
    borderRadius: '12px',
    border:
      '1px solid rgba(255, 255, 255, 0.08)',
    background:
      'rgba(255, 255, 255, 0.025)',
  },

  noticeIcon: {
    flexShrink: 0,
    marginTop: '1px',
    color: '#34d399',
  },

  noticeTitle: {
    marginBottom: '5px',
    color: '#d4d4d8',
    fontSize: '12px',
    fontWeight: 600,
  },

  noticeText: {
    margin: 0,
    color: '#71717a',
    fontSize: '11px',
    lineHeight: 1.6,
  },

  errorBox: {
    marginBottom: '18px',
    padding: '13px 14px',
    borderRadius: '11px',
    border:
      '1px solid rgba(248, 113, 113, 0.22)',
    background:
      'rgba(248, 113, 113, 0.07)',
  },

  errorTitle: {
    marginBottom: '4px',
    color: '#fca5a5',
    fontSize: '12px',
    fontWeight: 650,
  },

  errorText: {
    color: '#a1a1aa',
    fontSize: '11px',
    lineHeight: 1.5,
  },

  successBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    marginBottom: '18px',
    padding: '13px 14px',
    borderRadius: '11px',
    border:
      '1px solid rgba(52, 211, 153, 0.2)',
    background:
      'rgba(52, 211, 153, 0.06)',
  },

  successIcon: {
    flexShrink: 0,
    color: '#34d399',
  },

  successTitle: {
    marginBottom: '4px',
    color: '#a7f3d0',
    fontSize: '12px',
    fontWeight: 650,
  },

  successText: {
    color: '#a1a1aa',
    fontSize: '11px',
    lineHeight: 1.5,
  },

  submitButton: {
    width: '100%',
    height: '49px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '2px',
    border: 'none',
    borderRadius: '11px',
    background: '#ffffff',
    color: '#09090b',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 650,
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
  },

  submitButtonLoading: {
    opacity: 0.65,
    cursor: 'wait',
  },

  terms: {
    margin: '17px 0 0',
    textAlign: 'center',
    color: '#52525b',
    fontSize: '10px',
    lineHeight: 1.6,
  },
};

export default ProfessionalAuth;