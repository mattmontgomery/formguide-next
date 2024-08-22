import {
  CACHED_YEARS,
  LEAGUE_DISPLAY_NAMES,
  LEAGUES,
} from "@/services/api-football/constants";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-100vh">
      <div className="grid grid-flow-row gap-y-16">
        {CACHED_YEARS.map((year) => (
          <div key={year} className="grid grid-flow-row gap-y-4">
            <h1 className="text-2xl font-bold">{year}</h1>
            {[
              ["form", "Form Guide"],
              ["form-rolling", "Form Guide Rolling"],
            ].map(([page, title]) => (
              <div key={page} className="grid grid-flow-row  gap-y-2">
                <h2 className="text-lg font-bold">{title}</h2>
                <div className="columns-4">
                  {Object.keys(LEAGUES).map((league, idx) => (
                    <div key={idx}>
                      <Link href={`/${league}/${year}/${page}`}>
                        {league in LEAGUE_DISPLAY_NAMES
                          ? LEAGUE_DISPLAY_NAMES[league]
                          : league}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
