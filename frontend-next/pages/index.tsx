import { useState } from "react";
import type { NextPage } from "next";
import styled from "styled-components";

import { squareState } from "../constants";
import PlaygroundCreator from "../components/PlaygroundCreator";
import Game from "../components/Game";

const Wrapper = styled.div`
  background-color: rgb(30, 30, 50);
  color: white;
  min-height: 100vh;
`;

const Home: NextPage = () => {
  const [gameSize, setGameSize] = useState({ width: 0, height: 0 });
  const [gameLayout, setGameLayout] = useState<squareState[]>([]);

  return (
    <Wrapper>
      <h1>NFT Miner</h1>
      <PlaygroundCreator
        setGameLayout={setGameLayout}
        setGameSize={setGameSize}
      />
      <Game gameSize={gameSize} gameLayout={gameLayout} />
    </Wrapper>
  );
};

export default Home;
