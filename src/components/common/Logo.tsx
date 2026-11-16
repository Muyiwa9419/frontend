// import { Topic } from '../types';

// export const topics: Topic[] = [
//   {
//     icon: '💬',
//     title: 'I just need to talk',
//     description: 'I have something on my mind.',
//   },
//   {
//     icon: '🧠',
//     title: 'Something is bothering me',
//     description: 'I need somewhere to let it out.',
//   },
//   {
//     icon: '❤️',
//     title: 'Relationship advice',
//     description: 'Something is happening in my relationship.',
//   },
//   {
//     icon: '🙈',
//     title: "I'm embarrassed to ask",
//     description: 'I need to ask something without judgment.',
//   },
//   {
//     icon: '❓',
//     title: 'I need advice',
//     description: 'I need another perspective.',
//   },
//   {
//     icon: '👂',
//     title: 'I just need someone to listen',
//     description: "I don't necessarily need an answer.",
//   },
//   {
//     icon: '✍️',
//     title: 'Something else',
//     description: "It's difficult to explain.",
//   },
// ];


interface LogoProps {
  onClick?: () => void;
  light?: boolean;
}

const Logo = ({ onClick, light = false }: LogoProps) => {
  return (
    <div
      className={`jt-logo ${light ? 'jt-logo-light' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <span className="jt-logo-mark">J</span>
      <span className="jt-logo-text">Just Talk</span>
    </div>
  );
};

export default Logo;
