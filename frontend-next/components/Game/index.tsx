import { useState, useEffect } from "react";
import styled from "styled-components";
import { ethers } from "ethers";

import Game from "../../../artifacts/contracts/Game.sol/Game";
import { squareState } from "../../constants";
import { numberOfBombs, squareClassNames } from "./constants";
import Square from "./Square";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractABI = Game.abi;

const init = async () => {
  const provider = ethers.getDefaultProvider("http://127.0.0.1:8545/");
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  try {
    const gameLayouts = await contract.getGameLayouts();

    console.log("gameLayouts", gameLayouts[0]);
  } catch (error) {
    console.log("ERROR:", error);
  }
};

const Wrapper = styled.div`
  grid-gap: 0.5rem;
  justify-items: center;
  align-items: center;
  display: grid;
  width: fit-content;
  .${squareClassNames.visible} {
    border-radius: 0.25rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.15);
    border: 0.5px solid rgba(255, 255, 255, 0.25);
    width: 2rem;
  }
  .${squareClassNames.bomb} {
    border-radius: 0.2rem;
    background-color: rgba(255, 160, 185, 1);
    transform: rotate(45deg) scale(1.25);
  }
  .${squareClassNames.empty} {
    transform: scale(0.7);
    opacity: 0.8;
  }
  .${squareClassNames.hidden} {
    border-radius: 1rem;
    width: 1rem;
    background-color: rgba(255, 255, 255, 0.1);
    margin: 0.5rem;
    cursor: pointer;
  }
  .${squareClassNames.flag} {
    transform: rotate(45deg) scale(0.85);
    background-color: rgba(200, 250, 250, 0.75);
    border: 1px solid white;
    border-radius: 0.2rem;
    cursor: pointer;
  }
`;

const defaultStatus = "Not started";

interface GameProps {
  gameSize: { width: number; height: number };
  gameLayout: squareState[];
}

const GameComponent = ({ gameSize, gameLayout }: GameProps) => {
  const [status, setStatus] = useState(defaultStatus);
  const [isFirstTurn, setIsFirstTurn] = useState(true);
  const [gameIsLost, setGameIsLost] = useState(false);

  // it's useless to fill the array on initialization
  // since we don't know the layout length at this point
  const [visibilityLayout, setVisibilityLayout] = useState<boolean[]>([]);
  const [flagsLayout, setFlagsLayout] = useState<boolean[]>([]);
  const [bombsLayout, setBombsLayout] = useState<boolean[]>([]);
  const [valuesLayout, setValuesLayout] = useState<number[]>([]);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const remainingHiddenSquares = visibilityLayout.filter(
      (visibility, index) =>
        visibility !== true && gameLayout[index] === squareState.thereIsASquare
    ).length;

    if (gameIsLost) {
      setStatus("Game over");
    } else if (numberOfBombs - remainingHiddenSquares === 0) {
      setStatus("You won!");
    } else if (isFirstTurn === false) {
      setStatus("Playing");
    }
  }, [isFirstTurn, gameIsLost, visibilityLayout]);
  return (
    <>
      <p>{`Status: ${status}`}</p>
      <p>{`Remaining flags: ${
        numberOfBombs - flagsLayout.filter((v) => v).length
      }`}</p>
      <button
        onClick={() => {
          setStatus(defaultStatus);
          setIsFirstTurn(true);
          setGameIsLost(false);

          setVisibilityLayout(new Array(gameLayout.length).fill(false));
          setFlagsLayout(new Array(gameLayout.length).fill(false));
          setBombsLayout(new Array(gameLayout.length).fill(false));
          setValuesLayout(new Array(gameLayout.length).fill(0));
        }}
      >
        restart
      </button>
      <Wrapper
        style={{
          gridTemplateColumns: `repeat(${gameSize.width}, 1fr)`,
          gridTemplateRows: `repeat(${gameSize.height}, 1fr)`,
        }}
      >
        {gameLayout.map((squareContent, i) => {
          return squareContent !== squareState.noSquare ? (
            <Square
              key={`grid-square-${i}`}
              index={i}
              gameLayout={gameLayout}
              flagsLayout={flagsLayout}
              setFlagsLayout={setFlagsLayout}
              bombsLayout={bombsLayout}
              setBombsLayout={setBombsLayout}
              visibilityLayout={visibilityLayout}
              setVisibilityLayout={setVisibilityLayout}
              gameSize={gameSize}
              valuesLayout={valuesLayout}
              setValuesLayout={setValuesLayout}
              isFirstTurn={isFirstTurn}
              setIsFirstTurn={setIsFirstTurn}
              gameIsLost={gameIsLost}
              setGameIsLost={setGameIsLost}
            />
          ) : null;
        })}
      </Wrapper>
    </>
  );
};

export default GameComponent;
