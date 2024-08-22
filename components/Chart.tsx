import { ParentSize } from "@visx/responsive";
import React from "react";

export default function Chart({
  Component,
}: {
  Component: React.ComponentType<{ width: number; height: number }>;
}) {
  return (
    <ParentSize>
      {({ width, height }) => <Component width={width} height={height} />}
    </ParentSize>
  );
}
