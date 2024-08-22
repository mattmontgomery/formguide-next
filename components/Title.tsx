import { PropsWithChildren } from "react";

export function Title({ children }: PropsWithChildren) {
  return (
    <h2 className="text-xl font-semibold border-b-amber-400 border-b-solid border-b-2 pb-2">
      {children}
    </h2>
  );
}
