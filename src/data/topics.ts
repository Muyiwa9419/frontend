export type Screen =
  | 'home'
  | 'categories'
  | 'compose'
  | 'identity'
  | 'conversation';

export type MessageSender = 'user' | 'justtalk';

export interface Message {
  id: number;
  sender: MessageSender;
  text: string;
}

export interface Topic {
  icon: string;
  title: string;
  description: string;
}