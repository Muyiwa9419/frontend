import {
  useEffect,
  useRef,
  useState,
} from 'react';

import type { KeyboardEvent } from 'react';

import type { Message } from '../types';

import { conversations } from '../services/api';

interface ConversationProps {
  conversationId: string;
  anonymousName: string;
  messages: Message[];
  onBack: () => void;
  onAddMessage: (message: Message) => void;
  onStartNewConversation: () => void;
}

function formatTime(timestamp?: string) {
  if (!timestamp) {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function Conversation({
  conversationId,
  anonymousName,
  messages,
  onBack,
  onAddMessage,
  onStartNewConversation,
}: ConversationProps) {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [showSafety, setShowSafety] = useState(false);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

  /*
  |--------------------------------------------------------------------------
  | Auto-scroll
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  /*
  |--------------------------------------------------------------------------
  | Send Message
  |--------------------------------------------------------------------------
  */

  const handleSend = async () => {
    const text = input.trim();

    if (!text || isSending) {
      return;
    }

    try {
      setError('');
      setIsSending(true);

      const response =
        await conversations.sendMessage(
          conversationId,
          text
        );

      const savedMessage: Message = {
        id: response.message.id,
        sender: 'user',
        text: response.message.text,
        timestamp: response.message.timestamp,
      };

      onAddMessage(savedMessage);

      setInput('');
    } catch (error) {
      console.error(
        'Unable to send message:',
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : 'Unable to send your message.'
      );
    } finally {
      setIsSending(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Keyboard
  |--------------------------------------------------------------------------
  */

  const handleKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleSend();
    }
  };

  /*
  |--------------------------------------------------------------------------
  | End Conversation
  |--------------------------------------------------------------------------
  */

  const handleEndConversation = async () => {
    if (isEnding) {
      return;
    }

    try {
      setError('');
      setIsEnding(true);

      await conversations.end(conversationId);

      sessionStorage.removeItem(
        'just_talk_active_conversation'
      );

      setShowEndScreen(true);
    } catch (error) {
      console.error(
        'Unable to end conversation:',
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : 'Unable to end the conversation.'
      );
    } finally {
      setIsEnding(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Start New Conversation
  |--------------------------------------------------------------------------
  */

  const handleNewConversation = () => {
    onStartNewConversation();
  };

  /*
  |--------------------------------------------------------------------------
  | Error Banner
  |--------------------------------------------------------------------------
  */

  const errorBanner = error ? (
    <div
      className="conversation-error"
      role="alert"
    >
      <div className="conversation-error-icon">
        !
      </div>

      <span>{error}</span>

      <button
        type="button"
        onClick={() => setError('')}
        aria-label="Close error"
      >
        ×
      </button>
    </div>
  ) : null;

  /*
  |--------------------------------------------------------------------------
  | Ended Screen
  |--------------------------------------------------------------------------
  */

  if (showEndScreen) {
    return (
      <main className="conversation-page conversation-ended">
        <div
          className="conversation-page-glow conversation-glow-one"
          aria-hidden="true"
        />

        <div
          className="conversation-page-glow conversation-glow-two"
          aria-hidden="true"
        />

        <header className="conversation-ended-brand">
          <div className="conversation-brand-mark">
            JT
          </div>

          <span>Just Talk</span>
        </header>

        <section className="ended-card">
          <div className="ended-icon">
            ✓
          </div>

          <div className="ended-eyebrow">
            CONVERSATION ENDED
          </div>

          <h1>
            You made space
            <span> for it.</span>
          </h1>

          <p className="ended-description">
            Thank you for trusting Just Talk
            with something that was on your
            mind.
          </p>

          <div className="ended-id">
            <span>
              Conversation ID
            </span>

            <strong>
              {conversationId}
            </strong>
          </div>

          <div className="ended-actions">
            <button
              type="button"
              className="primary-button"
              onClick={handleNewConversation}
            >
              Start another conversation
              <span>→</span>
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={onBack}
            >
              Return
            </button>
          </div>
        </section>

        {errorBanner}
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Active Conversation
  |--------------------------------------------------------------------------
  */

  return (
    <main className="conversation-page">
      {/* Background decoration */}
      <div
        className="conversation-page-glow conversation-glow-one"
        aria-hidden="true"
      />

      <div
        className="conversation-page-glow conversation-glow-two"
        aria-hidden="true"
      />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="conversation-header">
        <div className="conversation-header-left">
          <button
            type="button"
            className="back-button"
            onClick={onBack}
            aria-label="Go back"
          >
            ←
          </button>

          <div className="conversation-brand-mark">
            JT
          </div>

          <div className="conversation-title">
            <div className="conversation-title-row">
              <span className="online-dot" />

              <strong>
                Just Talk
              </strong>
            </div>

            <span>
              Private conversation
            </span>
          </div>
        </div>

        <div className="conversation-actions">
          <button
            type="button"
            className="header-icon-button"
            onClick={() =>
              setShowSafety(
                (current) => !current
              )
            }
            aria-label="Safety information"
            title="Safety"
          >
            !
          </button>

          <button
            type="button"
            className="header-end-button"
            onClick={handleEndConversation}
            disabled={isEnding}
          >
            {isEnding
              ? 'Ending...'
              : 'End'}
          </button>
        </div>
      </header>

      {/* =====================================================
          META
      ===================================================== */}

      <div className="conversation-meta">
        <span className="conversation-meta-private">
          <span>🔒</span>
          Anonymous
        </span>

        <span className="conversation-id">
          {conversationId}
        </span>
      </div>

      {/* =====================================================
          SAFETY NOTICE
      ===================================================== */}

      {showSafety && (
        <div className="safety-panel">
          <div className="safety-panel-icon">
            !
          </div>

          <div className="safety-panel-content">
            <strong>
              Your privacy matters.
            </strong>

            <p>
              Avoid sharing passwords, phone
              numbers, home addresses, financial
              information, or anything that could
              identify you.
            </p>

            <p>
              If you're in immediate danger or
              someone is seriously hurt, contact
              your local emergency services or a
              trusted person who can help you
              directly.
            </p>
          </div>

          <button
            type="button"
            className="safety-close"
            onClick={() =>
              setShowSafety(false)
            }
            aria-label="Close safety information"
          >
            ×
          </button>
        </div>
      )}

      {/* =====================================================
          CHAT
      ===================================================== */}

      <section className="conversation-content">
        <div className="conversation-intro">
          <div className="conversation-lock">
            🔒
          </div>

          <p className="conversation-label">
            PRIVATE CONVERSATION
          </p>

          <h1>
            You can talk here.
          </h1>

          <p>
            You're anonymous as{' '}
            <strong>
              {anonymousName || 'Anonymous'}
            </strong>
            .
          </p>
        </div>

        <div className="messages">
          {messages.length === 0 && (
            <div className="empty-conversation">
              <div className="empty-conversation-icon">
                ◌
              </div>

              <p>
                This is your space.
              </p>

              <span>
                Start by telling us what's on
                your mind.
              </span>
            </div>
          )}

          {messages.map((message) => {
            const isUser =
              message.sender === 'user';

            const isProfessional =
              message.sender ===
              'professional';

            return (
              <div
                key={message.id}
                className={`message-row ${
                  isUser
                    ? 'user-row'
                    : 'justtalk-row'
                }`}
              >
                <div className="message-sender">
                  <span
                    className={`message-avatar ${
                      isUser
                        ? 'user-avatar'
                        : 'support-avatar'
                    }`}
                  >
                    {isUser
                      ? 'Y'
                      : isProfessional
                      ? 'P'
                      : 'JT'}
                  </span>

                  <span>
                    {isUser
                      ? anonymousName ||
                        'You'
                      : isProfessional
                      ? 'Professional'
                      : 'Just Talk'}
                  </span>
                </div>

                <div
                  className={`message-bubble ${
                    isUser
                      ? 'user-message'
                      : 'justtalk-message'
                  }`}
                >
                  {message.text}
                </div>

                <div className="message-time">
                  {formatTime(
                    message.timestamp
                  )}
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>
      </section>

      {/* =====================================================
          INPUT
      ===================================================== */}

      <div className="conversation-input-area">
        <div className="conversation-input">
          <textarea
            value={input}
            onChange={(event) =>
              setInput(
                event.target.value.slice(
                  0,
                  2000
                )
              )
            }
            onKeyDown={handleKeyDown}
            placeholder={
              isSending
                ? 'Sending...'
                : "Type what's on your mind..."
            }
            rows={1}
            maxLength={2000}
            disabled={isSending}
            aria-label="Message"
          />

          <button
            type="button"
            className="send-message-button"
            onClick={handleSend}
            disabled={
              !input.trim() ||
              isSending
            }
            aria-label="Send message"
          >
            {isSending ? '…' : '↑'}
          </button>
        </div>

        <div className="conversation-bottom-info">
          <span>
            {input.length}/2000
          </span>

          <span>
            Enter to send · Shift + Enter
            for a new line
          </span>
        </div>
      </div>

      {errorBanner}
    </main>
  );
}

export default Conversation;