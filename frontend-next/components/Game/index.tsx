import { useState, useEffect } from "react";
import styled from "styled-components";

import { squareState } from "../../constants";
import { numberOfBombs } from "./constants";
import { placeBombs, revealNeighbouringSquares } from "./utils";

const Square = styled.button`
  aspect-ratio: 1/1;
  box-shadow: 0 4px 5px rgba(10, 0, 25, 1);
  color: white;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
`;

enum squareClassNames {
  visible = "visible",
  empty = "empty",
  hidden = "hidden",
  flag = "flag",
  bomb = "bomb",
}

interface ReturnClassNameProps {
  isVisible: boolean;
  hasAFlag: boolean;
  hasABomb?: boolean;
  value: number;
  gameIsLost?: boolean;
}

const returnClassName = ({
  isVisible,
  hasAFlag,
  value,
  hasABomb,
  gameIsLost,
}: ReturnClassNameProps) => {
  if (gameIsLost && hasABomb) {
    return `${squareClassNames.bomb}`;
  } else if (isVisible && value === 0) {
    return `${squareClassNames.visible} ${squareClassNames.empty}`;
  } else if (isVisible) {
    return `${squareClassNames.visible}`;
  } else if (hasAFlag) {
    return `${squareClassNames.flag}`;
  }
  return `${squareClassNames.hidden}`;
};

interface GameSquareProps {
  index: number;
  gameSize: { width: number; height: number };
  gameLayout: squareState[];
  bombsLayout: boolean[];
  setBombsLayout: React.Dispatch<React.SetStateAction<boolean[]>>;
  visibilityLayout: boolean[];
  setVisibilityLayout: React.Dispatch<React.SetStateAction<boolean[]>>;
  flagsLayout: boolean[];
  setFlagsLayout: React.Dispatch<React.SetStateAction<boolean[]>>;
  valuesLayout: number[];
  setValuesLayout: React.Dispatch<React.SetStateAction<number[]>>;
  setIsFirstTurn: React.Dispatch<React.SetStateAction<boolean>>;
  isFirstTurn: boolean;
  gameIsLost: boolean;
  setGameIsLost: React.Dispatch<React.SetStateAction<boolean>>;
}

const GameSquare = ({
  index,
  gameSize,
  visibilityLayout,
  setVisibilityLayout,
  gameLayout,
  valuesLayout,
  setValuesLayout,
  setIsFirstTurn,
  isFirstTurn,
  flagsLayout,
  setFlagsLayout,
  gameIsLost,
  setGameIsLost,
  bombsLayout,
  setBombsLayout,
}: GameSquareProps) => {
  const isVisible = visibilityLayout[index];
  const className = returnClassName({
    isVisible,
    hasAFlag: flagsLayout[index],
    value: valuesLayout[index],
    gameIsLost,
    hasABomb: bombsLayout[index],
  });
  const layoutLength = gameLayout.length;

  return (
    <Square
      style={{
        gridColumn: `${(index % gameSize.width) + 1} / span 1`,
      }}
      onContextMenu={(e) => {
        // avoids showing the context menu on right click
        e.preventDefault();
        // if the game is lost, the user can not interact with the game
        if (gameIsLost === false) {
          const newFlags = [...flagsLayout];
          // if there is no flag, place one, otherwise remove it
          newFlags[index] = flagsLayout[index] ? false : true;
          setFlagsLayout(newFlags);
        }
      }}
      onClick={() => {
        // 1. if the game is lost, the user should not be able to interact with the game
        // 2. the visibility of the square can not change if there is a flag on it
        if (gameIsLost === false && flagsLayout[index] !== true) {
          if (isFirstTurn) {
            placeBombs({
              indexClickedSquare: index,
              visibilityLayout,
              gameLayout,
              width: gameSize.width,
              layoutLength,
              valuesLayout,
              setValuesLayout,
              setVisibilityLayout,
              setBombsLayout,
            });
            setIsFirstTurn(false);
          } else {
            if (bombsLayout[index] === true) {
              setGameIsLost(true);
            } else {
              revealNeighbouringSquares({
                gameLayout,
                visibilityLayout,
                index: index,
                width: gameSize.width,
                layoutLength,
                valuesLayout,
                setVisibilityLayout,
              });
            }
          }
        }
      }}
      className={className}
    >
      {isVisible && valuesLayout[index] !== 0 ? valuesLayout[index] : ""}
    </Square>
  );
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

const Game = ({ gameSize, gameLayout }: GameProps) => {
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
            <GameSquare
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

export default Game;
