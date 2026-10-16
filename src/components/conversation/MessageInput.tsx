import React from 'react';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

const MessageInput = ({
  value,
  onChange,
  onSend,
  disabled = false,
}: MessageInputProps) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!disabled && value.trim()) {
      onSend();
    }
  };

  return (
    <form className="message-input-area" onSubmit={handleSubmit}>
      <div className="message-input-wrapper">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Say whatever is on your mind..."
          rows={1}
          disabled={disabled}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();

              if (value.trim()) {
                onSend();
              }
            }
          }}
        />

        <button
          type="submit"
          className="send-button"
          disabled={disabled || !value.trim()}
          aria-label="Send message"
        >
          ↑
        </button>
      </div>

      <p className="input-hint">
        Press Enter to send · Shift + Enter for a new line
      </p>
    </form>
  );
};

export default MessageInput;