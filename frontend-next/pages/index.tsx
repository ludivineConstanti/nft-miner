import { useState } from "react";
import type { NextPage } from "next";

import { squareState } from "../constants";
import PlaygroundCreator from "../components/PlaygroundCreator";
import Game from "../components/Game";

const Home: NextPage = () => {
  const [gameSize, setGameSize] = useState({ width: 0, height: 0 });
  const [gameLayout, setGameLayout] = useState<squareState[]>([]);

  return (
    <div
      style={{
        backgroundColor: "rgb(30,30,50)",
        color: "white",
        height: "100vh",
      }}
    >
      <h1>NFT Miner</h1>
      <PlaygroundCreator
        setGameLayout={setGameLayout}
        setGameSize={setGameSize}
      />
      <Game gameSize={gameSize} gameLayout={gameLayout} />
    </div>
  );
};

export default Home;
