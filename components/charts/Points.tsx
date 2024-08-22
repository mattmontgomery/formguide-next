"use client";

import { scaleBand, scaleLinear } from "@visx/scale";
import { ParentSize } from "@visx/responsive";
import { Bar, Line, LinePath } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { LinearGradient } from "@visx/gradient";
import { Group } from "@visx/group";
import { Tooltip, withTooltip } from "@visx/tooltip";

function getColor(value: number, max: number = 15): string {
  const min = 0;
  const startColor = "#FF0000"; // Amber
  const endColor = "#00FF00"; // Lime

  // Calculate the percentage of the value within the range
  const percentage = (value - min) / (max - min);

  // Interpolate the color based on the percentage
  const red = Math.round(
    (1 - percentage) * parseInt(startColor.slice(1, 3), 16) +
      percentage * parseInt(endColor.slice(1, 3), 16)
  );
  const green = Math.round(
    (1 - percentage) * parseInt(startColor.slice(3, 5), 16) +
      percentage * parseInt(endColor.slice(3, 5), 16)
  );
  const blue = Math.round(
    (1 - percentage) * parseInt(startColor.slice(5, 7), 16) +
      percentage * parseInt(endColor.slice(5, 7), 16)
  );

  // Convert the RGB values to a hexadecimal color code
  const color = `#${red.toString(16).padStart(2, "0")}${green
    .toString(16)
    .padStart(2, "0")}${blue.toString(16).padStart(2, "0")}77`;

  return color;
}

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
          <svg width={width} height={height}>
            <LinearGradient id="linear" from="#a6c1ee" to="#a6c1ee" />
            <Group height={height + 4}>
              {points.map((point, i) => (
                <Bar
                  key={i}
                  x={xScale(i) ?? 0}
                  y={yScale(point)}
                  width={xScale.bandwidth()}
                  height={height - (yScale(point) ?? 0)}
                  fill={getColor(point, props.periodLength * 3)}
                />
              ))}
              <LinePath
                data={points.map((point, i) => ({
                  x: xScale(i) ?? 0,
                  y: yScale(point) ?? 0,
                }))}
                x={(d) => d.x}
                y={(d) => d.y + 4}
                stroke="#000"
                strokeWidth={4}
              />
            </Group>
            <AxisBottom
              top={height}
              scale={xScale}
              numTicks={points.length}
              stroke="black"
              tickStroke="black"
            />
            <AxisLeft scale={yScale} stroke="black" tickStroke="black" />
          </svg>
        );
      }}
    </ParentSize>
  );
}
