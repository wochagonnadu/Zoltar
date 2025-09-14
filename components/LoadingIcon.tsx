import React from 'react';

interface LoadingIconProps {
  className?: string;
  'aria-label'?: string;
}

/*
  Простая реализация спиннера.
  Почему так: минимально, читабельно, без лишних зависимостей.
  Использует классы (tailwind) по умолчанию, их можно переопределить через className.
*/
export const LoadingIcon: React.FC<LoadingIconProps> = ({ className, 'aria-label': ariaLabel }) => {
  return (
    <svg
      className={`animate-spin ${className ?? 'h-8 w-8 text-white'}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      role="img"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth={4}
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
};
