import { FormEvent, useState } from 'react';
import { auth } from '../services/api';
import '../styles/admin.css';

interface AdminAuthProps {
  onBack: () => void;
  onAuthenticated: () => void;
}

function AdminAuth({
  onBack,
  onAuthenticated,
}: AdminAuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] =
    useState('');
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState('');

  const handleSubmit = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    setError('');

    if (!email.trim() || !password) {
      setError(
        'Please enter your email and password.'
      );
      return;
    }

    try {
      setLoading(true);

      const result =
        await auth.adminLogin(
          email.trim(),
          password
        );

      if (
        !result.success ||
        result.accountType !== 'admin'
      ) {
        setError(
          'Administrator access could not be verified.'
        );
        return;
      }

      onAuthenticated();
    } catch (error) {
      console.error(
        'Admin login failed:',
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : 'Unable to sign in as administrator.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="jt-auth-page">
      <div className="jt-auth-glow jt-auth-glow-one" />
      <div className="jt-auth-glow jt-auth-glow-two" />

      <section className="jt-auth-card">
        <button
          type="button"
          className="jt-back-button"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="jt-auth-brand">
          <div className="jt-auth-logo">
            JT
          </div>

          <div>
            <div className="jt-auth-brand-name">
              Just Talk
            </div>

            <div className="jt-auth-brand-subtitle">
              Administration
            </div>
          </div>
        </div>

        <div className="jt-auth-heading">
          <span className="jt-auth-eyebrow">
            SECURE ACCESS
          </span>

          <h1>
            Welcome back,
            <br />
            Administrator.
          </h1>

          <p>
            Sign in to manage the Just Talk
            platform.
          </p>
        </div>

        {error && (
          <div className="jt-auth-error">
            <span>!</span>
            {error}
          </div>
        )}

        <form
          className="jt-auth-form"
          onSubmit={handleSubmit}
        >
          <label>
            <span>Email address</span>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="admin@example.com"
              autoComplete="username"
              disabled={loading}
            />
          </label>

          <label>
            <span>Password</span>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={loading}
            />
          </label>

          <button
            type="submit"
            className="jt-primary-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="jt-button-spinner" />
                Signing in...
              </>
            ) : (
              <>
                Access Dashboard
                <span>→</span>
              </>
            )}
          </button>
        </form>

        <div className="jt-auth-security">
          <span className="jt-security-icon">
            ✦
          </span>

          <div>
            <strong>
              Administrator access
            </strong>

            <p>
              This area is restricted to
              authorized Just Talk administrators.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AdminAuth;