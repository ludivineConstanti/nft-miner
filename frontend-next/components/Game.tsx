import { useState } from "react";
import styled from "styled-components";

import { squareState } from "../constants";
import { indexes, check } from "../utils";

interface ForSurroundingSquaresProps {
  index: number;
  width: number;
  callback: (index: number) => void;
  layoutLength: number;
}

const forSurroundingSquares = ({
  index,
  width,
  callback,
  layoutLength,
}: ForSurroundingSquaresProps) => {
  const isNotOnLeftBorder = check.isNotOnLeftBorder(index, width);
  const isNotOnRightBorder = check.isNotOnRightBorder(index, width);

  const top = indexes.top(index, width);
  if (check.isValid(top, layoutLength)) {
    callback(top);
  }

  const topRight = indexes.topRight(index, width);
  if (check.isValid(topRight, layoutLength) && isNotOnRightBorder) {
    callback(topRight);
  }

  const right = indexes.right(index);
  if (check.isValid(right, layoutLength) && isNotOnRightBorder) {
    callback(right);
  }

  const bottomRight = indexes.bottomRight(index, width);
  if (check.isValid(bottomRight, layoutLength) && isNotOnRightBorder) {
    callback(bottomRight);
  }

  const bottom = indexes.bottom(index, width);
  if (check.isValid(bottom, layoutLength)) {
    callback(bottom);
  }

  const bottomLeft = indexes.bottomLeft(index, width);
  if (check.isValid(bottomLeft, layoutLength) && isNotOnLeftBorder) {
    callback(bottomLeft);
  }

  const left = indexes.left(index);
  if (check.isValid(left, layoutLength) && isNotOnLeftBorder) {
    callback(left);
  }

  const topLeft = indexes.topLeft(index, width);
  if (check.isValid(topLeft, layoutLength) && isNotOnLeftBorder) {
    callback(topLeft);
  }
};

interface RevealNeighbouringSquaresProps {
  gameLayout: squareState[];
  index: number;
  width: number;
  visibilityLayout: boolean[];
  layoutLength: number;
  numberLayout: number[];
}

const revealNeighbouringSquares = ({
  gameLayout,
  visibilityLayout,
  index,
  width,
  layoutLength,
  numberLayout,
}: RevealNeighbouringSquaresProps) => {
  if (gameLayout[index] !== squareState.noSquare) {
    visibilityLayout[index] = true;
    if (numberLayout[index] === 0) {
      forSurroundingSquares({
        index,
        width,
        callback: (currentIndex) => {
          if (visibilityLayout[currentIndex] !== true) {
            visibilityLayout[currentIndex] = true;
            if (numberLayout[currentIndex] === 0) {
              revealNeighbouringSquares({
                gameLayout,
                visibilityLayout,
                index: currentIndex,
                width,
                layoutLength,
                numberLayout,
              });
            }
          }
        },
        layoutLength,
      });
    }
  }
};

interface PlaceBombsProps {
  indexClickedSquare: number;
  visibilityLayout: boolean[];
  gameLayout: squareState[];
  width: number;
  layoutLength: number;
  valuesLayout: number[];
  setValuesLayout: React.Dispatch<React.SetStateAction<number[]>>;
  setVisibilityLayout: React.Dispatch<React.SetStateAction<boolean[]>>;
}

const placeBombs = ({
  indexClickedSquare,
  visibilityLayout,
  width,
  gameLayout,
  layoutLength,
  valuesLayout,
  setValuesLayout,
  setVisibilityLayout,
}: PlaceBombsProps) => {
  const numberLayout: number[] =
    valuesLayout.length > 0
      ? valuesLayout
      : new Array(layoutLength).fill(0, 0, layoutLength);

  const newVisibilityLayout = [...visibilityLayout];

  for (let index = 0; index < gameLayout.length; index++) {
    let indexClickedSquareNeighbor = false;
    forSurroundingSquares({
      index,
      width,
      callback: (currentIndex) => {
        if (currentIndex === indexClickedSquare) {
          indexClickedSquareNeighbor = true;
        }
      },
      layoutLength,
    });
    if (
      !visibilityLayout[index] &&
      gameLayout[index] !== squareState.noSquare &&
      Math.random() > 0.8 &&
      indexClickedSquareNeighbor === false
    ) {
      forSurroundingSquares({
        index,
        width,
        callback: (currentIndex) => {
          numberLayout[currentIndex]++;
        },
        layoutLength,
      });
    }
  }

  revealNeighbouringSquares({
    gameLayout,
    visibilityLayout: newVisibilityLayout,
    index: indexClickedSquare,
    width,
    layoutLength,
    numberLayout,
  });

  /* numberLayout.forEach((number, index) => {
    if (
      number === 0 &&
      gameLayout[index] !== squareState.noSquare &&
      visibilityLayout[index]
    ) {
      forSurroundingSquares({
        index,
        width,
        callback: (currentIndex) => {
          newVisibilityLayout[currentIndex] = true;
        },
        layoutLength,
      });
    }
  }); */

  setValuesLayout(numberLayout);
  setVisibilityLayout(newVisibilityLayout);
};

interface RevealSquaresProps {
  index: number;
  width: number;
  visibilityLayout: boolean[];
  setVisibilityLayout: React.Dispatch<React.SetStateAction<boolean[]>>;
  layoutLength: number;
  gameLayout: squareState[];
  valuesLayout: number[];
  setValuesLayout: React.Dispatch<React.SetStateAction<number[]>>;
}

const revealEmptySquare = ({
  index,
  width,
  visibilityLayout,
  setVisibilityLayout,
  layoutLength,
  gameLayout,
  valuesLayout,
  setValuesLayout,
}: RevealSquaresProps) => {
  /* const newVisibilityLayout = [...visibilityLayout];

  newVisibilityLayout[index] = true;

  forSurroundingSquares({
    index,
    width,
    callback: (currentIndex: number) => {
      newVisibilityLayout[currentIndex] = true;
    },
    layoutLength,
  });
  setVisibilityLayout(newVisibilityLayout); */
  placeBombs({
    indexClickedSquare: index,
    visibilityLayout,
    gameLayout,
    width,
    layoutLength,
    valuesLayout,
    setValuesLayout,
    setVisibilityLayout,
  });
};

const Square = styled.button`
  aspect-ratio: 1/1;
  box-shadow: 0 4px 5px rgba(10, 0, 25, 1);
`;

enum visibleOptions {
  visible = "visible",
  hidden = "hidden",
}

interface GameSquareProps {
  index: number;
  gameSize: { width: number; height: number };
  visibilityLayout: boolean[];
  setVisibilityLayout: React.Dispatch<React.SetStateAction<boolean[]>>;
  layoutLength: number;
  gameLayout: squareState[];
  valuesLayout: number[];
  setValuesLayout: React.Dispatch<React.SetStateAction<number[]>>;
}

const GameSquare = ({
  index,
  gameSize,
  visibilityLayout,
  setVisibilityLayout,
  layoutLength,
  gameLayout,
  valuesLayout,
  setValuesLayout,
}: GameSquareProps) => {
  const isVisible = visibilityLayout[index];
  // const normalSize = data.content === 0 ? "1.5rem" : "2rem";
  const normalSize = "2rem";

  return (
    <Square
      style={{
        gridColumn: `${(index % gameSize.width) + 1}/ span 1`,
        margin: isVisible ? "0" : "0.5rem",
        width: isVisible ? normalSize : "1rem",
      }}
      onClick={() => {
        revealEmptySquare({
          index,
          width: gameSize.width,
          visibilityLayout,
          setVisibilityLayout,
          layoutLength,
          gameLayout,
          setValuesLayout,
          valuesLayout,
        });
      }}
      className={isVisible ? visibleOptions.visible : visibleOptions.hidden}
    >
      {isVisible && valuesLayout[index] !== 0 ? valuesLayout[index] : ""}
    </Square>
  );
};

const Wrapper = styled.div`
  grid-gap: 0.5rem;
  justify-items: center;
  align-items: center;
  .${visibleOptions.visible} {
    border-radius: 0.25rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.15);
    border: 0.5px solid rgba(255, 255, 255, 0.25);
    color: white;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
  }
  .${visibleOptions.hidden} {
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.5);
    cursor: pointer;
  }
`;

interface GameProps {
  gameSize: { width: number; height: number };
  gameLayout: squareState[];
}

const Game = ({ gameSize, gameLayout }: GameProps) => {
  const [visibilityLayout, setVisibilityLayout] = useState<boolean[]>([]);
  const [valuesLayout, setValuesLayout] = useState<number[]>([]);
  return (
    <Wrapper
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${gameSize.width}, 1fr)`,
        gridTemplateRows: `repeat(${gameSize.height}, 1fr)`,
        width: "fit-content",
      }}
    >
      {gameLayout.map((squareContent, i) => {
        return squareContent !== squareState.noSquare ? (
          <GameSquare
            index={i}
            gameLayout={gameLayout}
            gameSize={gameSize}
            visibilityLayout={visibilityLayout}
            setVisibilityLayout={setVisibilityLayout}
            layoutLength={gameLayout.length}
            key={`grid-square-${i}`}
            valuesLayout={valuesLayout}
            setValuesLayout={setValuesLayout}
          />
        ) : null;
      })}
    </Wrapper>
  );
};

export default Game;
