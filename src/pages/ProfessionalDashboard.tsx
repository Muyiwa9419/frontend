
import {
  useEffect,
  useState,
} from 'react';

import {
  professionalApi,
  type ProfessionalDashboardResponse,
} from '../services/professionalApi';

interface ProfessionalDashboardProps {
  onOpenConversation: (conversationId: string) => void;
  onLogout: () => void;
}

const statusLabel = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'Pending approval';

    case 'APPROVED':
      return 'Approved';

    case 'REJECTED':
      return 'Rejected';

    case 'AVAILABLE':
      return 'Available';

    case 'OFFLINE':
      return 'Offline';

    case 'BUSY':
      return 'Busy';

    default:
      return status.replaceAll('_', ' ').toLowerCase();
  }
};

function ProfessionalDashboard({
  onOpenConversation,
  onLogout,
}: ProfessionalDashboardProps) {
  const [dashboard, setDashboard] =
    useState<ProfessionalDashboardResponse | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [logoutLoading, setLogoutLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const loadDashboard = async () => {
    try {
      setError('');

      const response =
        await professionalApi.getDashboard();

      setDashboard(response);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to load the professional dashboard.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleLogout = async () => {
    try {
      setError('');
      setLogoutLoading(true);

      const API_BASE_URL =
        import.meta.env.VITE_API_URL ||
        'http://localhost:5000/api';

      const response = await fetch(
        `${API_BASE_URL}/auth/logout`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type':
              'application/json',
          },
        }
      );

      if (!response.ok) {
        let message =
          'Unable to logout. Please try again.';

        try {
          const data =
            await response.json();

          if (
            data &&
            typeof data.message === 'string'
          ) {
            message = data.message;
          }
        } catch {
          // Ignore invalid JSON response.
        }

        throw new Error(message);
      }

      onLogout();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to logout. Please try again.'
      );
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleAvailability = async (
    availability:
      | 'AVAILABLE'
      | 'OFFLINE'
  ) => {
    try {
      setError('');
      setActionLoading(true);

      await professionalApi.setAvailability(
        availability
      );

      await loadDashboard();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to update availability.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleAccept = async () => {
    const requestId =
      dashboard?.incomingMatch?.id;

    if (!requestId) {
      return;
    }

    try {
      setError('');
      setActionLoading(true);

      await professionalApi.acceptMatch(
        requestId
      );

      await loadDashboard();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to accept this request.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecline = async () => {
    const requestId =
      dashboard?.incomingMatch?.id;

    if (!requestId) {
      return;
    }

    try {
      setError('');
      setActionLoading(true);

      await professionalApi.declineMatch(
        requestId
      );

      await loadDashboard();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to decline this request.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-loading">
          <div className="dashboard-loading-logo">
            JT
          </div>

          <div className="loading-title">
            Just Talk
          </div>

          <div className="loading-text">
            Preparing your professional workspace...
          </div>

          <div className="loading-line">
            <span />
          </div>
        </div>
      </main>
    );
  }

  if (!dashboard) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-glow dashboard-glow-one" />

        <div className="dashboard-error-page">
          <div className="dashboard-brand-mark large">
            JT
          </div>

          <p className="dashboard-section-label">
            PROFESSIONAL WORKSPACE
          </p>

          <h1>
            Unable to load your workspace
          </h1>

          <p>
            {error ||
              'Unable to load your professional profile.'}
          </p>

          <button
            type="button"
            className="dashboard-primary-button"
            onClick={handleLogout}
            disabled={logoutLoading}
          >
            {logoutLoading
              ? 'Logging out...'
              : 'Logout'}
          </button>
        </div>
      </main>
    );
  }

  const {
    professional,
    incomingMatch,
    activeConversation,
    stats,
  } = dashboard;

  const isApproved =
    professional.verificationStatus ===
    'APPROVED';

  const isAvailable =
    professional.availabilityStatus ===
    'AVAILABLE';

  const isBusy =
    professional.availabilityStatus ===
    'BUSY';

  return (
    <main className="dashboard-page professional-dashboard">
      <div className="dashboard-glow dashboard-glow-one" />
      <div className="dashboard-glow dashboard-glow-two" />

      <div className="dashboard-shell">

        {/* Header */}

        <header className="dashboard-header">
          <div className="dashboard-brand">
            <div className="dashboard-brand-mark">
              JT
            </div>

            <div>
              <div className="dashboard-brand-name">
                Just Talk
              </div>

              <div className="dashboard-brand-subtitle">
                Professional workspace
              </div>
            </div>
          </div>

          <div className="dashboard-header-actions">

            <div
              className={`professional-status-pill ${
                isAvailable
                  ? 'available'
                  : isBusy
                    ? 'busy'
                    : 'offline'
              }`}
            >
              <span />
              {statusLabel(
                professional.availabilityStatus
              )}
            </div>

            <button
              type="button"
              className="dashboard-logout-button"
              disabled={logoutLoading}
              onClick={handleLogout}
            >
              {logoutLoading
                ? 'Logging out...'
                : 'Logout'}
            </button>

          </div>
        </header>

        {/* Error */}

        {error && (
          <div
            role="alert"
            className="dashboard-error"
          >
            <span>!</span>
            {error}
          </div>
        )}

        {/* Welcome */}

        <section className="professional-welcome">

          <div>
            <p className="dashboard-eyebrow">
              PROFESSIONAL WORKSPACE
            </p>

            <h1>
              Hello,{' '}
              <span>
                {professional.displayName}
              </span>{' '}
              👋
            </h1>

            <p className="dashboard-welcome-text">
              {professional.bio ||
                'Manage your Just Talk professional activity.'}
            </p>
          </div>

          <div className="availability-control">

            <div className="availability-label">
              <span className="availability-label-dot" />
              Your availability
            </div>

            <div className="availability-buttons">

              <button
                type="button"
                disabled={
                  actionLoading ||
                  !isApproved ||
                  isBusy
                }
                onClick={() =>
                  handleAvailability(
                    'AVAILABLE'
                  )
                }
                className={
                  isAvailable
                    ? 'availability-button selected'
                    : 'availability-button'
                }
              >
                Available
              </button>

              <button
                type="button"
                disabled={
                  actionLoading ||
                  !isApproved ||
                  isBusy
                }
                onClick={() =>
                  handleAvailability(
                    'OFFLINE'
                  )
                }
                className={
                  !isAvailable && !isBusy
                    ? 'availability-button selected-offline'
                    : 'availability-button'
                }
              >
                Offline
              </button>

            </div>

          </div>
        </section>

        {/* Verification */}

        {!isApproved && (
          <section className="verification-card">

            <div className="verification-icon">
              {professional.verificationStatus ===
              'REJECTED'
                ? '!'
                : '✓'}
            </div>

            <div className="verification-content">
              <p>
                APPLICATION STATUS
              </p>

              <h2>
                {statusLabel(
                  professional.verificationStatus
                )}
              </h2>

              {professional.verificationStatus ===
                'PENDING' && (
                <span>
                  Your professional application is
                  waiting for admin approval.
                </span>
              )}

              {professional.verificationStatus ===
                'REJECTED' && (
                <span>
                  Your professional application was
                  not approved.
                </span>
              )}
            </div>

            <div className="verification-status">
              {professional.verificationStatus}
            </div>

          </section>
        )}

        {/* Stats */}

        <section className="professional-stats">

          <div className="professional-stat-card featured">
            <div className="stat-card-icon">
              ●
            </div>

            <div>
              <span>Availability</span>

              <strong>
                {statusLabel(
                  professional.availabilityStatus
                )}
              </strong>
            </div>
          </div>

          <div className="professional-stat-card">
            <div className="stat-number purple">
              {stats.pendingMatches}
            </div>

            <span>
              Pending requests
            </span>
          </div>

          <div className="professional-stat-card">
            <div className="stat-number pink">
              {stats.activeMatches}
            </div>

            <span>
              Active conversations
            </span>
          </div>

          <div className="professional-stat-card">
            <div className="stat-number blue">
              {stats.completedMatches}
            </div>

            <span>
              Completed
            </span>
          </div>

        </section>

        {/* Incoming request */}

        <section className="dashboard-section">

          <div className="dashboard-section-heading">
            <div>
              <p className="dashboard-section-label">
                MATCHING
              </p>

              <h2>
                Incoming conversation
              </h2>
            </div>

            {incomingMatch && (
              <span className="request-live-pill">
                <span />
                New request
              </span>
            )}
          </div>

          {incomingMatch ? (
            <div className="incoming-request-card">

              <div className="request-card-icon">
                💬
              </div>

              <div className="request-card-content">
                <p>
                  SOMEONE NEEDS TO TALK
                </p>

                <h3>
                  {incomingMatch.topic ||
                    'Private conversation'}
                </h3>

                <span>
                  Category:{' '}
                  <strong>
                    {incomingMatch.category}
                  </strong>
                </span>
              </div>

              <div className="request-actions">

                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleAccept}
                  className="accept-button"
                >
                  {actionLoading
                    ? 'Working...'
                    : 'Accept'}
                </button>

                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleDecline}
                  className="decline-button"
                >
                  Decline
                </button>

              </div>

            </div>
          ) : (
            <div className="professional-empty-card">
              <div className="professional-empty-icon">
                👂
              </div>

              <div>
                <h3>
                  No incoming requests
                </h3>

                <p>
                  New matched conversations will
                  appear here when you're available.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Active conversation */}

        <section className="dashboard-section">

          <div className="dashboard-section-heading">
            <div>
              <p className="dashboard-section-label">
                YOUR CONVERSATIONS
              </p>

              <h2>
                Active conversation
              </h2>
            </div>
          </div>

          {activeConversation ? (
            <div className="professional-active-card">

              <div className="professional-active-icon">
                💬
              </div>

              <div className="professional-active-content">
                <span>
                  ACTIVE CONVERSATION
                </span>

                <h3>
                  {activeConversation.topic ||
                    'Private conversation'}
                </h3>

                <p>
                  Category:{' '}
                  <strong>
                    {activeConversation.category}
                  </strong>
                </p>
              </div>

              <button
                type="button"
                className="active-open-button"
                onClick={() =>
                  onOpenConversation(
                    activeConversation.conversationId
                  )
                }
              >
                Open conversation
                <span>→</span>
              </button>

            </div>
          ) : (
            <div className="professional-empty-card">
              <div className="professional-empty-icon">
                ✨
              </div>

              <div>
                <h3>
                  No active conversation
                </h3>

                <p>
                  Your active professional
                  conversations will appear here.
                </p>
              </div>
            </div>
          )}

        </section>

        {/* Footer */}

        <footer className="dashboard-privacy-footer">
          <div className="privacy-footer-icon">
            🛡️
          </div>

          <div>
            <strong>
              Professional privacy matters too.
            </strong>

            <p>
              Handle every conversation with care.
              Just Talk keeps the experience private
              for both sides.
            </p>
          </div>
        </footer>

      </div>
    </main>
  );
}

export default ProfessionalDashboard;

