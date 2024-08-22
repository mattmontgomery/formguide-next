"use client";

import { GenericChart } from "@/components/charts/Generic";
import { RadioInput } from "@/components/Form/Radio";
import { getRollingTotal } from "@/services/stats";
import { useMemo, useState } from "react";

export default function Chart({
  players,
  playerStatsAsArray,
}: {
  players: Record<string, string>;
  playerStatsAsArray: Record<string, number[]>;
}) {
  const [periodLength, setPeriodLength] = useState<number>(5);
  const rollingTotals = useMemo(
    () => getRollingTotal(playerStatsAsArray, Number(periodLength)),
    [playerStatsAsArray, periodLength]
  );
  return (
    <div>
      <form
        className="flex gap-x-2"
        onChange={(ev) => {
          setPeriodLength(Number(ev.currentTarget.rolling.value));
        }}
      >
        <RadioInput name="rolling" label="3 games" value={3} />
        <RadioInput name="rolling" label="5 games" value={5} defaultChecked />
        <RadioInput name="rolling" label="8 games" value={8} />
        <RadioInput name="rolling" label="11 games" value={11} />
      </form>
      <table className="text-sm table w-full">
        <tbody>
          {Object.entries(players)
            .sort((a, b) =>
              a[1]
                .split(" ")
                .reverse()[0]
                .localeCompare(b[1].split(" ").reverse()[0])
            )
            .map(([id, player]) => (
              <tr key={id}>
                <td className="text-right pr-4">{player}</td>
                <td className="table-cell">
                  <div className="h-16 py-2 mb-4">
                    <GenericChart
                      maxValue={100 * periodLength}
                      periodLength={periodLength}
                      values={rollingTotals[id]}
                    />
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
