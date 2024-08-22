"use client";

import { scaleBand, scaleLinear } from "@visx/scale";
import { ParentSize } from "@visx/responsive";
import { Bar, LinePath } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { LinearGradient } from "@visx/gradient";
import { Group } from "@visx/group";
import { getColor } from "@/lib/color";
import { Fragment } from "react";
import { Annotation, Connector, Label, LineSubject } from "@visx/annotation";
import { GenericChart } from "./Generic";

export function PointsChart(props: { points: number[]; periodLength: number }) {
  return (
    <GenericChart
      maxValue={props.periodLength * 3}
      values={props.points}
      periodLength={props.periodLength}
    />
  );
}
