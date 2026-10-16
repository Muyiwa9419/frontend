import {
  useEffect,
  useState,
} from 'react';

import {
  dashboardApi,
  type DashboardConversation,
  type DashboardUser,
  type ActiveConversation,
} from '../services/dashboardApi';

interface UserDashboardProps {
  onStartConversation: () => void;
  onOpenConversation: (conversationId: string) => void;
  onCommunity: () => void;
  onLogout: () => void;
}

const formatDate = (value: string | null) => {
  if (!value) {
    return 'No messages yet';
  }

  return new Date(value).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'Active';

    case 'WAITING_FOR_PROFESSIONAL':
      return 'Waiting for a professional';

    case 'PROFESSIONAL_CONNECTED':
      return 'Connected';

    case 'ENDED':
      return 'Ended';

    case 'DELETED':
      return 'Deleted';

    default:
      return status
        .replaceAll('_', ' ')
        .toLowerCase();
  }
};

const getMatchingLabel = (status?: string) => {
  switch (status) {
    case 'WAITING':
      return 'Finding a professional';

    case 'MATCHED':
      return 'Professional found';

    case 'ACCEPTED':
      return 'Professional connected';

    default:
      return status
        ? getStatusLabel(status)
        : '';
  }
};

const getTopicIcon = (
  topic?: string | null
) => {
  const value =
    topic?.toLowerCase() || '';

  if (value.includes('relationship')) {
    return '❤️';
  }

  if (value.includes('bothering')) {
    return '🧠';
  }

  if (value.includes('embarrassed')) {
    return '🙈';
  }

  if (value.includes('advice')) {
    return '❓';
  }

  if (value.includes('listen')) {
    return '👂';
  }

  return '💬';
};

function UserDashboard({
  onStartConversation,
  onOpenConversation,
  onCommunity,
  onLogout,
}: UserDashboardProps) {
  const [user, setUser] =
    useState<DashboardUser | null>(null);

  const [conversations, setConversations] =
    useState<DashboardConversation[]>([]);

  const [activeConversation, setActiveConversation] =
    useState<ActiveConversation | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [deletingId, setDeletingId] =
    useState('');

  const [error, setError] =
    useState('');

  const loadDashboard = async () => {
    try {
      setError('');
      setIsLoading(true);

      const [
        userResponse,
        conversationsResponse,
        activeResponse,
      ] = await Promise.all([
        dashboardApi.getMe(),
        dashboardApi.getConversations(),
        dashboardApi.getActiveConversation(),
      ]);

      setUser(userResponse.user);

      setConversations(
        conversationsResponse.conversations
      );

      setActiveConversation(
        activeResponse.activeConversation
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to load your dashboard.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleDelete = async (
    conversationId: string
  ) => {
    const confirmed = window.confirm(
      'Delete this conversation from your history?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setError('');
      setDeletingId(conversationId);

      await dashboardApi.deleteConversation(
        conversationId
      );

      setConversations((current) =>
        current.filter(
          (conversation) =>
            conversation.id !== conversationId
        )
      );

      if (
        activeConversation?.conversation.id ===
        conversationId
      ) {
        setActiveConversation(null);
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to delete this conversation.'
      );
    } finally {
      setDeletingId('');
    }
  };

  if (isLoading) {
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
            Preparing your private space...
          </div>

          <div className="loading-line">
            <span />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-glow dashboard-glow-one" />
      <div className="dashboard-glow dashboard-glow-two" />

      <div className="dashboard-shell">

        {/* =================================================
            HEADER
            ================================================= */}

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
                Your private space
              </div>
            </div>
          </div>

          <div className="dashboard-header-actions">

            <div className="dashboard-private-pill">
              <span className="dashboard-online-dot" />
              <span>Private</span>
            </div>

            {/* COMMUNITY */}

            <button
              type="button"
              className="dashboard-community-button"
              onClick={onCommunity}
              aria-label="Open Community"
            >
              <span className="dashboard-community-icon">
                💬
              </span>

              <span className="dashboard-community-label">
                Community
              </span>
            </button>

            {/* LOGOUT */}

            <button
              type="button"
              className="dashboard-logout-button"
              onClick={onLogout}
            >
              Logout
            </button>

          </div>
        </header>

        {/* =================================================
            ERROR
            ================================================= */}

        {error && (
          <div
            role="alert"
            className="dashboard-error"
          >
            <span>!</span>
            {error}
          </div>
        )}

        {/* =================================================
            WELCOME
            ================================================= */}

        <section className="dashboard-welcome">

          <div>
            <p className="dashboard-eyebrow">
              WELCOME BACK
            </p>

            <h1>
              Hello,{' '}
              <span>
                {user?.anonymousName || 'there'}
              </span>{' '}
              👋
            </h1>

            <p className="dashboard-welcome-text">
              Whatever is on your mind, you don't
              have to carry it alone.
            </p>
          </div>

          <button
            type="button"
            className="dashboard-primary-button"
            onClick={onStartConversation}
          >
            <span>＋</span>
            Start talking
          </button>

        </section>

        {/* =================================================
            ACTIVE CONVERSATION
            ================================================= */}

        <section className="dashboard-section">

          <div className="dashboard-section-heading">

            <div>
              <p className="dashboard-section-label">
                YOUR SPACE
              </p>

              <h2>
                Current conversation
              </h2>
            </div>

            {activeConversation && (
              <span className="dashboard-live-label">
                <span />
                Live
              </span>
            )}

          </div>

          {activeConversation ? (
            <div className="active-conversation-card">

              <div className="active-card-glow" />

              <div className="active-card-top">

                <div className="conversation-icon-large">
                  {getTopicIcon(
                    activeConversation
                      .conversation.topic
                  )}
                </div>

                <div className="conversation-status-pill">
                  <span />

                  {getStatusLabel(
                    activeConversation
                      .conversation.status
                  )}
                </div>

              </div>

              <div className="active-card-content">

                <p className="active-card-small">
                  PRIVATE CONVERSATION
                </p>

                <h3>
                  {activeConversation
                    .conversation.topic ||
                    'Private conversation'}
                </h3>

                <p>
                  Your conversation is safely
                  waiting for you.
                </p>

              </div>

              <div className="active-card-details">

                <div className="detail-card">
                  <span>Matching</span>

                  <strong>
                    {getMatchingLabel(
                      activeConversation
                        .matchingRequest?.status
                    )}
                  </strong>
                </div>

                <div className="detail-card">
                  <span>Professional</span>

                  <strong>
                    {activeConversation
                      .professional
                      ?.displayName ||
                      'Not connected yet'}
                  </strong>
                </div>

              </div>

              <button
                type="button"
                className="active-open-button"
                onClick={() =>
                  onOpenConversation(
                    activeConversation
                      .conversation.id
                  )
                }
              >
                Open conversation

                <span>→</span>
              </button>

            </div>
          ) : (
            <div className="empty-conversation-card">

              <div className="empty-icon">
                💬
              </div>

              <h3>
                Nothing active right now
              </h3>

              <p>
                Whenever you're ready, start a
                private conversation and say
                what's on your mind.
              </p>

              <button
                type="button"
                className="dashboard-secondary-button"
                onClick={onStartConversation}
              >
                Start talking
                <span>→</span>
              </button>

            </div>
          )}

        </section>

        {/* =================================================
            QUICK ACCESS
            ================================================= */}

        <section className="quick-access-grid">

          {/* START TALKING */}

          <button
            type="button"
            className="quick-access-card"
            onClick={onStartConversation}
          >
            <div className="quick-access-icon purple">
              💬
            </div>

            <div>
              <strong>
                Start talking
              </strong>

              <span>
                Begin a new private conversation
              </span>
            </div>

            <span className="quick-arrow">
              →
            </span>
          </button>

          {/* COMMUNITY */}

          <button
            type="button"
            className="quick-access-card dashboard-community-card"
            onClick={onCommunity}
          >
            <div className="quick-access-icon community">
              🌐
            </div>

            <div>
              <strong>
                Community
              </strong>

              <span>
                Share and connect anonymously
              </span>
            </div>

            <span className="quick-arrow">
              →
            </span>
          </button>

          {/* PRIVACY */}

          <div className="quick-access-card">

            <div className="quick-access-icon pink">
              🔒
            </div>

            <div>
              <strong>
                Privacy first
              </strong>

              <span>
                Your identity stays protected
              </span>
            </div>

            <span className="quick-check">
              ✓
            </span>

          </div>

          {/* YOU ARE HEARD */}

          <div className="quick-access-card">

            <div className="quick-access-icon blue">
              👂
            </div>

            <div>
              <strong>
                You are heard
              </strong>

              <span>
                Talk at your own pace
              </span>
            </div>

          </div>

        </section>

        {/* =================================================
            HISTORY
            ================================================= */}

        <section className="dashboard-section history-section">

          <div className="dashboard-section-heading">

            <div>
              <p className="dashboard-section-label">
                YOUR JOURNEY
              </p>

              <h2>
                Conversation history
              </h2>
            </div>

            <span className="history-count">
              {conversations.length}{' '}
              {conversations.length === 1
                ? 'conversation'
                : 'conversations'}
            </span>

          </div>

          {conversations.length === 0 ? (
            <div className="history-empty">

              <div className="history-empty-icon">
                ✨
              </div>

              <div>
                <strong>
                  Your history starts here
                </strong>

                <p>
                  Conversations you have will
                  appear here.
                </p>
              </div>

            </div>
          ) : (
            <div className="history-list">

              {conversations.map(
                (conversation) => (
                  <article
                    key={conversation.id}
                    className="history-card"
                  >

                    <div className="history-icon">
                      {getTopicIcon(
                        conversation.topic
                      )}
                    </div>

                    <div className="history-main">

                      <div className="history-topline">

                        <span className="history-status">
                          {getStatusLabel(
                            conversation.status
                          )}
                        </span>

                        <span className="history-messages">
                          {conversation.messageCount}{' '}
                          {conversation.messageCount ===
                          1
                            ? 'message'
                            : 'messages'}
                        </span>

                      </div>

                      <h3>
                        {conversation.topic ||
                          'Private conversation'}
                      </h3>

                      <p>
                        Last activity:{' '}
                        {formatDate(
                          conversation.lastMessageAt
                        )}
                      </p>

                    </div>

                    <div className="history-actions">

                      <button
                        type="button"
                        className="history-open"
                        onClick={() =>
                          onOpenConversation(
                            conversation.id
                          )
                        }
                      >
                        Open
                        <span>→</span>
                      </button>

                      <button
                        type="button"
                        className="history-delete"
                        disabled={
                          deletingId ===
                          conversation.id
                        }
                        onClick={() =>
                          handleDelete(
                            conversation.id
                          )
                        }
                      >
                        {deletingId ===
                        conversation.id
                          ? 'Deleting...'
                          : 'Delete'}
                      </button>

                    </div>

                  </article>
                )
              )}

            </div>
          )}

        </section>

        {/* =================================================
            PRIVACY FOOTER
            ================================================= */}

        <footer className="dashboard-privacy-footer">

          <div className="privacy-footer-icon">
            🔒
          </div>

          <div>
            <strong>
              Your space is yours.
            </strong>

            <p>
              Your conversations are private to
              your account. Deleted conversations
              are removed from your dashboard
              history.
            </p>
          </div>

        </footer>

      </div>
    </main>
  );
}

export default UserDashboard;