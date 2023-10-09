import styled from "styled-components";

import { squareState } from "../../constants";
import { squareClassNames } from "./constants";
import { placeBombs, revealNeighbouringSquares } from "./utils";

const Square = styled.button`
  aspect-ratio: 1/1;
  box-shadow: 0 4px 5px rgba(10, 0, 25, 1);
  color: white;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
`;

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

export default GameSquare;
