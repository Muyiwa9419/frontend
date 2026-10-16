export type Screen =
  | 'home'
  | 'start-talking'
  | 'categories'
  | 'compose'
  | 'identity'
  | 'auth'
  | 'conversation'
  | 'dashboard'
  | 'professional-dashboard'
  | 'community'
  | 'create-community-post'
  | 'admin-auth'
  | 'admin-dashboard';

export type MessageSender =
  | 'user'
  | 'justtalk'
  | 'professional';

export interface Message {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp?: string;
}