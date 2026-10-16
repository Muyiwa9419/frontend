
import { useState } from 'react';

import { auth } from '../services/api';

interface AuthProps {
  onBack: () => void;
  onAuthenticated: () => void;
}

function Auth({
  onBack,
  onAuthenticated,
}: AuthProps) {
  const [mode, setMode] =
    useState<'login' | 'register'>('register');

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const isRegister =
    mode === 'register';

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError('');

    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError(
        'Please enter your email and password.'
      );

      return;
    }

    if (
      isRegister &&
      password !== confirmPassword
    ) {
      setError(
        'Passwords do not match.'
      );

      return;
    }

    try {
      setIsLoading(true);

      if (isRegister) {
        await auth.register(
          cleanEmail,
          password
        );

        /*
         * Registration creates the account,
         * but it does not currently create
         * a session.
         *
         * Therefore we immediately log in
         * after successful registration.
         */
        await auth.login(
          cleanEmail,
          password
        );
      } else {
        await auth.login(
          cleanEmail,
          password
        );
      }

      onAuthenticated();
    } catch (error) {
      console.error(
        'Authentication failed:',
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : 'Unable to authenticate. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setError('');

    setPassword('');
    setConfirmPassword('');

    setMode(
      isRegister
        ? 'login'
        : 'register'
    );
  };

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

        <div className="brand">
          Just Talk
        </div>

        <span className="private-label">
          🔒 Private
        </span>

      </header>

      <section className="flow-container">

        <p className="eyebrow">
          PRIVATE ACCOUNT
        </p>

        <h1>
          {isRegister
            ? 'Create your private account.'
            : 'Welcome back.'}
        </h1>

        <p className="flow-description">
          {isRegister
            ? 'Your account helps us protect your conversations. Your email is never displayed as your public identity.'
            : 'Sign in to continue to your private conversations.'}
        </p>

        <div className="anonymous-card">

          <div className="anonymous-icon">
            🔒
          </div>

          <div>
            <strong>
              Your identity stays separate
            </strong>

            <p>
              Your account information is
              kept separate from the anonymous
              identity used inside conversations.
            </p>
          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >

          <div className="form-group">

            <label htmlFor="email">
              Email address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="you@example.com"
              autoComplete="email"
              maxLength={255}
              disabled={isLoading}
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="At least 8 characters"
              autoComplete={
                isRegister
                  ? 'new-password'
                  : 'current-password'
              }
              maxLength={128}
              disabled={isLoading}
              required
            />

          </div>

          {isRegister && (
            <div className="form-group">

              <label htmlFor="confirmPassword">
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                placeholder="Enter your password again"
                autoComplete="new-password"
                maxLength={128}
                disabled={isLoading}
                required
              />

            </div>
          )}

          {error && (
            <div
              className="auth-error"
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="primary-button"
            disabled={isLoading}
          >
            {isLoading
              ? 'Please wait...'
              : isRegister
              ? 'Create private account'
              : 'Log in'}
          </button>

        </form>

        <div className="auth-switch">

          <span>
            {isRegister
              ? 'Already have an account?'
              : "Don't have an account?"}
          </span>

          <button
            type="button"
            onClick={switchMode}
            disabled={isLoading}
          >
            {isRegister
              ? 'Log in'
              : 'Create one'}
          </button>

        </div>

        <p className="privacy-warning">
          🔒 Never use your Just Talk password
          anywhere else. Avoid putting sensitive
          personal information in your password.
        </p>

      </section>

    </main>
  );
}

export default Auth;

