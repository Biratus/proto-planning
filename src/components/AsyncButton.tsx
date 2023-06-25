"use client";

import { PropsWithChildren, useState } from "react";

type AsyncButtonProps = {
  asyncFunction: () => Promise<any>;
};

export default function AsyncButton({
  asyncFunction,
  className,
  children,
  ...props
}: AsyncButtonProps & PropsWithChildren & React.HTMLAttributes<HTMLElement>) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await asyncFunction();
    } catch (error) {
      // Handle error, if needed
    }
    setIsLoading(false);
  };
  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`btn ${className}`}
      {...props}
    >
      {isLoading && (
        <svg
          className="absolute w-5 h-5 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      <span className={isLoading ? "invisible" : "visible"}>{children}</span>
    </button>
  );
}
