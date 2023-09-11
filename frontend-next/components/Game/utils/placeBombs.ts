import { squareState } from "../../../constants";
import { executeOnNeighbouringSquares, revealNeighbouringSquares } from ".";
import { numberOfBombs } from "../constants";

interface PlaceBombsProps {
  indexClickedSquare: number;
  visibilityLayout: boolean[];
  gameLayout: squareState[];
  width: number;
  layoutLength: number;
  valuesLayout: number[];
  setVisibilityLayout: React.Dispatch<React.SetStateAction<boolean[]>>;
  setBombsLayout: React.Dispatch<React.SetStateAction<boolean[]>>;
  setValuesLayout: React.Dispatch<React.SetStateAction<number[]>>;
}

const placeBombs = ({
  indexClickedSquare,
  visibilityLayout,
  setVisibilityLayout,
  setBombsLayout,
  width,
  gameLayout,
  layoutLength,
  valuesLayout,
  setValuesLayout,
}: PlaceBombsProps) => {
  // Array storing the numbers indicating how many bombs are around a square
  const newValuesLayout: number[] =
    valuesLayout.length > 0
      ? valuesLayout
      : new Array(layoutLength).fill(0, 0, layoutLength);
  const newBombsLayout: boolean[] = new Array(layoutLength).fill(
    false,
    0,
    layoutLength
  );

  // The first square clicked should not be a bomb
  // (otherwise ou could lose the game on the first round)
  // and the ones around it should not be bombs either
  // (otherwise it's pretty hard to play
  // if you just get 1 number as the first hint to start the game)
  const indexesWhichShouldNotBeBombs: number[] = [indexClickedSquare];

  executeOnNeighbouringSquares({
    index: indexClickedSquare,
    width,
    callback: (currentIndex) => {
      indexesWhichShouldNotBeBombs.push(currentIndex);
    },
    layoutLength,
  });

  let bombCount = numberOfBombs;

  while (bombCount > 0) {
    // choose a random number in the layout
    const potentialBombIndex = Math.floor(Math.random() * layoutLength);
    // 1. check if the square actually exist (if it's part of the artwork or empty)
    // 2. check if there's not already a bomb (otherwise we would have less bombs than expected)
    // 3. check if the square is not around the first square clicked or the first square itself
    if (
      gameLayout[potentialBombIndex] === squareState.thereIsASquare &&
      newBombsLayout[potentialBombIndex] !== true &&
      indexesWhichShouldNotBeBombs.includes(potentialBombIndex) === false
    ) {
      newBombsLayout[potentialBombIndex] = true;
      bombCount--;
      executeOnNeighbouringSquares({
        index: potentialBombIndex,
        width,
        callback: (currentIndex) => {
          newValuesLayout[currentIndex] += 1;
        },
        layoutLength,
      });
    }
  }

  // change the visibility of the clicked square
  // and the squares around it
  revealNeighbouringSquares({
    gameLayout,
    visibilityLayout,
    index: indexClickedSquare,
    width,
    layoutLength,
    valuesLayout: newValuesLayout,
    setVisibilityLayout,
  });

  // updates the values layout
  setValuesLayout(newValuesLayout);
  // updates the bombs layout
  setBombsLayout(newBombsLayout);
};

export default placeBombs;
