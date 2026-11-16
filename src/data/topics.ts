
// import type { Topic } from '../types';
// export type Screen =
//   | 'home'
//   | 'categories'
//   | 'compose'
//   | 'identity'
//   | 'conversation';

// export type MessageSender = 'user' | 'justtalk';

// export interface Message {
//   id: number;
//   sender: MessageSender;
//   text: string;
// }

// export interface Topic {
//   icon: string;
//   title: string;
//   description: string;
// }

import type { Topic } from '../types';

export const topics: Topic[] = [
  {
    icon: '💬',
    title: 'I just need to talk',
    description: 'I have something on my mind.',
  },
  {
    icon: '🧠',
    title: 'Something is bothering me',
    description: 'I need somewhere to let it out.',
  },
  {
    icon: '❤️',
    title: 'Relationship advice',
    description: 'I need help understanding a relationship.',
  },
  {
    icon: '😔',
    title: 'I feel overwhelmed',
    description: 'Everything feels like too much right now.',
  },
  {
    icon: '🤝',
    title: 'I need someone to listen',
    description: 'I just want someone who understands.',
  },
  {
    icon: '🌱',
    title: 'Personal growth',
    description: 'I want to understand myself better.',
  },
  {
    icon: '🔒',
    title: 'Something private',
    description: 'I have something personal I cannot share elsewhere.',
  },
];

