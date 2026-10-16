import { Message } from '../../types';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  anonymousName: string;
}

const MessageList = ({
  messages,
  anonymousName,
}: MessageListProps) => {
  return (
    <div className="message-list">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          anonymousName={anonymousName}
        />
      ))}
    </div>
  );
};

export default MessageList;