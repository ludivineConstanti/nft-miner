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
    console.log("bombCount", bombCount);
    const potentialBombIndex = Math.floor(Math.random() * layoutLength);
    if (
      newBombsLayout[potentialBombIndex] !== true &&
      indexesWhichShouldNotBeBombs.includes(potentialBombIndex) === false &&
      gameLayout[potentialBombIndex] === squareState.thereIsASquare
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

  setValuesLayout(newValuesLayout);
  setBombsLayout(newBombsLayout);
};

export default placeBombs;
