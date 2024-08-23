"use client";

import { EmptyFixtureCell, GenericFixtureCell } from "@/components/Fixture";
import { RadioInput } from "@/components/Form/Radio";
import { PlayerStatistics } from "@/services/api-football/lineups";
import { displayNames, getters } from "@/services/stats";
import clsx from "clsx";
import { useState } from "react";

export default function PlayerMinutesTable({
  players,
  playerStats,
}: {
  players: Record<string, string>;
  playerStats: Record<string, Record<string, PlayerStatistics>>;
}) {
  const [statistic, setStatistic] = useState<keyof typeof getters>("minutes");
  return (
    <div>
      <form
        className="columns-4"
        onChange={(ev) => {
          setStatistic(ev.currentTarget.statistic.value);
        }}
      >
        {Object.entries(displayNames).map(([value, label], index) => (
          <RadioInput
            key={value}
            name="statistic"
            label={label}
            value={value}
            defaultChecked={index === 0}
          />
        ))}
      </form>
      <table className="text-sm">
        <thead>
          <tr>
            <td></td>
            {Object.keys(playerStats).map((fixture, idx) => (
              <td key={idx} className="text-center">
                {idx + 1}
              </td>
            ))}
          </tr>
        </thead>
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
                {Object.values(playerStats[id]).map((stats, idx) =>
                  stats?.statistics[0].games.minutes ? (
                    <GenericFixtureCell
                      className={clsx({
                        "bg-amber-300": stats?.statistics[0].games.substitute,
                        "font-bold": stats?.statistics[0].games.minutes >= 70,
                        "font-normal": stats?.statistics[0].games.minutes < 70,
                      })}
                      key={idx}
                    >
                      {getters[statistic](stats?.statistics[0])}
                    </GenericFixtureCell>
                  ) : (
                    <EmptyFixtureCell key={idx} />
                  )
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
