import { Message } from '../../types';

interface MessageBubbleProps {
  message: Message;
  anonymousName: string;
}

const MessageBubble = ({
  message,
  anonymousName,
}: MessageBubbleProps) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`message-row ${isUser ? 'message-row-user' : ''}`}>
      {!isUser && (
        <div className="message-avatar">
          JT
        </div>
      )}

      <div className="message-wrapper">
        <div className="message-meta">
          {isUser ? anonymousName : 'Just Talk'}
        </div>

        <div
          className={`message-bubble ${
            isUser ? 'message-user' : 'message-justtalk'
          }`}
        >
          {message.text}
        </div>
      </div>

      {isUser && <div className="message-avatar user-avatar">You</div>}
    </div>
  );
};

export default MessageBubble;