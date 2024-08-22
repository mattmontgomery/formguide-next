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

export function PointsChart(props: { points: number[]; periodLength: number }) {
  const { points } = props;

  const xScale = scaleBand<number>({
    domain: points.map((_, i) => i),
    padding: 0.2,
  });

  const yScale = scaleLinear<number>({
    domain: [0, Math.max(...points)],
  });

  return (
    <ParentSize>
      {({ width, height }) => {
        xScale.rangeRound([0, width]);
        yScale.range([height, 0]);
        return (
          <svg width={width} height={height + 70}>
            <Group height={height + 4}>
              <LinePath
                data={points.map((point, i) => ({
                  x: xScale(i) ?? 0,
                  y: yScale(point) ?? 0,
                }))}
                x={(d) => d.x}
                y={(d) => d.y}
                className="stroke-black dark:stroke-white stroke-[3]"
              />
              {points.map((point, i) => (
                <Group key={i} left={xScale(i) ?? 0}>
                  <Bar
                    y={yScale(point)}
                    width={xScale.bandwidth()}
                    height={height - (yScale(point) ?? 0)}
                    fill={getColor(point, props.periodLength * 3)}
                  />
                  <Annotation y={height - 5} dy={0} dx={5}>
                    <Label
                      width={30}
                      backgroundPadding={1}
                      showAnchorLine={false}
                      title={`${(point / props.periodLength).toPrecision(3)}`}
                      titleFontSize={8}
                    />
                  </Annotation>
                </Group>
              ))}
            </Group>
            <AxisBottom
              top={height}
              scale={xScale}
              numTicks={points.length}
              axisClassName="stroke-black dark:stroke-white fill-black dark:fill-white"
              tickClassName="stroke-black dark:stroke-white fill-black dark:fill-white"
              labelClassName="stroke-black dark:stroke-white fill-black dark:fill-white"
            />
            <AxisLeft
              scale={yScale}
              axisClassName="stroke-black dark:stroke-white fill-black dark:fill-white"
              tickClassName="stroke-black dark:stroke-white fill-black dark:fill-white"
              labelClassName="stroke-black dark:stroke-white fill-black dark:fill-white"
            />
          </svg>
        );
      }}
    </ParentSize>
  );
}
