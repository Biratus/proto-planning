import cn from "classnames";
import { PropsWithChildren, useState } from "react";

type AsyncButtonProps = {
  asyncFunction: () => Promise<any>;
  size?: "xs" | "sm" | "md" | "lg";
};

export default function AsyncButton({
  asyncFunction,
  className,
  children,
  size = "md",
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
      className={`btn ${className} btn-${size}`}
      {...props}
    >
      {isLoading && (
        <span
          className={`loading-spinner loading absolute loading-${size}`}
        ></span>
      )}
      <span
        className={cn("inline-flex items-center", {
          invisible: isLoading,
          visible: !isLoading,
        })}
      >
        {children}
      </span>{" "}
    </button>
  );
}
