"use client";

import { scaleBand, scaleLinear } from "@visx/scale";
import { ParentSize } from "@visx/responsive";
import { Bar, LinePath } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { getColor } from "@/lib/color";
import { Annotation, Label } from "@visx/annotation";

export function GenericChart(props: {
  maxValue: number;
  values: number[];
  periodLength: number;
}) {
  const { values } = props;
  const xScale = scaleBand<number>({
    domain: values.map((_, i) => i),
    padding: 0.2,
  });

  const yScale = scaleLinear<number>({
    domain: [0, props.maxValue],
  });

  return (
    <ParentSize>
      {({ width, height }) => {
        xScale.range([0, width]);
        yScale.range([height, 0]);

        return (
          <svg width={width} height={height + 70}>
            <Group height={height}>
              <LinePath
                data={values.map((value, i) => ({
                  x: xScale(i) ?? 0,
                  y: yScale(value) ?? 0,
                }))}
                x={(d) => d.x}
                y={(d) => d.y}
                className="stroke-black dark:stroke-white stroke-[3]"
              />
              {values.map((value, i) => (
                <Group key={i} left={xScale(i) ?? 0}>
                  <Bar
                    y={yScale(value)}
                    width={xScale.bandwidth()}
                    height={height - (yScale(value) ?? 0)}
                    fill={getColor(value, props.maxValue)}
                  />
                  <Annotation y={height - 5} dy={0} dx={5}>
                    <Label
                      width={30}
                      backgroundPadding={1}
                      showAnchorLine={false}
                      title={`${(value / props.periodLength).toPrecision(3)}`}
                      titleFontSize={8}
                    />
                  </Annotation>
                </Group>
              ))}
            </Group>
            <AxisBottom
              top={height}
              scale={xScale}
              numTicks={values.length}
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
