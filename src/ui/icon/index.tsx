import { IconName } from './types';

type IconProps = {
  name: IconName;
};

export const Icon = ({ name }: IconProps) => (
  <svg
    className="icon"
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 24 24"
    fill="none"
  >
    {name === 'check' && (
      <path d="m4 12 5 5L20 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    )}

    {name.startsWith('face-') && (
      <>
        {name === 'face-no' && (<>
          <path d="m6.5 10 3-1m8 1-3-1" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path d="M8 17q4-5 8 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </>)}
        {name === 'face-yes' && (
          <path d="M2 7h9l-1 5H3L2 6Zm11 0h9l-1 5h-7l-1-5ZM11 9h2" fill="currentColor" />
        )}
        {name !== 'face-no' && name !== 'face-yes' && (<>
          <circle cx="9" cy="9" r="2" fill="currentColor" />
          <circle cx="15" cy="9" r="2" fill="currentColor" />
        </>)}
        {name === 'face-negative' && (
          <path d="M8 16q4-4 8 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        )}
        {name === 'face-neutral' && (
          <path d="M8 16h8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        )}
        {(name === 'face-positive' || name === 'face-yes') && (
          <path d="M8 16q4 4 8 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        )}
      </>
    )}

    {name === 'moon' && (
      <path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z" transform="translate(12 12) scale(1.4) translate(-12 -12)" fill="currentColor" />
    )}

    {name === 'point-down' && (
      <polygon points="2,6 22,6 12,22" fill="currentColor" />
    )}

    {name === 'point-right' && (
      <polygon points="6,2 22,12 6,22" fill="currentColor" />
    )}

    {name === 'reset' && (
      <>
        <path d="M13.656854 2.343146a8 8 0 1 1-9.67033024-1.26507532" transform="rotate(90 12 12) matrix(0 1 1 0 4 4)" fillRule="evenodd" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m4 1v4h-4" transform="rotate(90 12 12) matrix(0 1 1 0 4 4) matrix(1 0 0 -1 0 6)" fillRule="evenodd" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </>
    )}

    {name === 'sun' && (
      <>
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="3" />
        <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </>
    )}

    {name === 'x' && (
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    )}
  </svg>
);
