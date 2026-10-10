"use client";

import { useState } from "react";
import { Screen } from "@/components/shell/Screen";
import WordGame from "@/components/game/WordGame";
import FamilyGame from "@/components/game/FamilyGame";
import LettersScreen from "@/components/game/LettersScreen";
import HomeScreen from "@/components/screens/HomeScreen";
import ProgressScreen from "@/components/screens/ProgressScreen";
import type { FamilyDifficulty } from "@/data/letter-families";

type Route =
  | { name: "home" }
  | { name: "word"; level: number }
  | { name: "letters" }
  | { name: "letters-game"; family: number; difficulty: FamilyDifficulty }
  | { name: "progress" };

const PAGE_TABS = [
  "Home",
  "Letters",
  "Letter game",
  "Game",
  "Progress",
] as const;

export default function App() {
  const [route, setRoute] = useState<Route>({ name: "home" });

  const currentTab =
    route.name === "home"
      ? "Home"
      : route.name === "letters"
        ? "Letters"
        : route.name === "letters-game"
          ? "Letter game"
          : route.name === "word"
            ? "Game"
            : "Progress";

  return (
    <>
      <div className="page-tabs-shell">
        <div className="page-tabs">
          {PAGE_TABS.map((tab) => {
            const active = tab === currentTab;
            const handleClick = () => {
              if (tab === "Home") setRoute({ name: "home" });
              else if (tab === "Letters") setRoute({ name: "letters" });
              else if (tab === "Letter game") setRoute({ name: "letters-game", family: 0, difficulty: "easy" });
              else if (tab === "Game") setRoute({ name: "word", level: 1 });
              else if (tab === "Progress") setRoute({ name: "progress" });
            };

            return (
              <button
                key={tab}
                type="button"
                onClick={handleClick}
                className={`page-tab ${active ? "active" : ""}`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      <Screen frame="desktop">
        {route.name === "home" && (
          <HomeScreen
            frame="desktop"
            onPlay={(level) => setRoute({ name: "word", level })}
            onLetters={() => setRoute({ name: "letters" })}
            onProgress={() => setRoute({ name: "progress" })}
          />
        )}
        {route.name === "word" && (
          <WordGame
            level={route.level}
            frame="desktop"
            onHome={() => setRoute({ name: "home" })}
          />
        )}
        {route.name === "letters" && (
          <LettersScreen
            frame="desktop"
            onBack={() => setRoute({ name: "home" })}
            onPlayFamily={(family, difficulty) =>
              setRoute({ name: "letters-game", family, difficulty })
            }
          />
        )}
        {route.name === "letters-game" && (
          <FamilyGame
            familyIndex={route.family}
            difficulty={route.difficulty}
            frame="desktop"
            onBack={() => setRoute({ name: "letters" })}
          />
        )}
        {route.name === "progress" && (
          <ProgressScreen
            frame="desktop"
            onBack={() => setRoute({ name: "home" })}
          />
        )}
      </Screen>
    </>
  );
}
