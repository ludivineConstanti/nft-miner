import { squareState } from "../../../constants";
import { executeOnNeighbouringSquares, revealNeighbouringSquares } from ".";

interface PlaceBombsProps {
  indexClickedSquare: number;
  visibilityLayout: boolean[];
  gameLayout: squareState[];
  width: number;
  layoutLength: number;
  valuesLayout: number[];
  setVisibilityLayout: React.Dispatch<React.SetStateAction<boolean[]>>;
  setValuesLayout: React.Dispatch<React.SetStateAction<number[]>>;
}

const placeBombs = ({
  indexClickedSquare,
  visibilityLayout,
  setVisibilityLayout,
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
  const bombsLayout: boolean[] = new Array(layoutLength).fill(
    false,
    0,
    layoutLength
  );

  console.log(bombsLayout);

  // OLD => LOOPING THROUGH THE LAYOUT DOES NOT WORK WELL
  // BETTER TO DROP THE BOMBS RANDOMLY
  // => GETS MORE CONTROL OVER THE DISTRIBUTION

  for (let index = 0; index < gameLayout.length; index++) {
    // checks if the current index is a neighbour of the clicked square
    let indexClickedSquareNeighbor = false;
    executeOnNeighbouringSquares({
      index,
      width,
      callback: (currentIndex) => {
        if (currentIndex === indexClickedSquare) {
          indexClickedSquareNeighbor = true;
        }
      },
      layoutLength,
    });
    // checks if there is a square
    // + if it is not currently visible
    // and if it is not a neigbour of the clicked square
    // (the first square clicked is never a bomb,
    // otherwise you could have game over on the first turn)
    // If all of the conditions are fulfilled
    // Math.random decides if a bomb will be placed or not
    if (
      !visibilityLayout[index] &&
      gameLayout[index] !== squareState.noSquare &&
      Math.random() > 0.7 &&
      indexClickedSquareNeighbor === false &&
      newValuesLayout[index] === 0
    ) {
      bombsLayout[index] = true;
      executeOnNeighbouringSquares({
        index,
        width,
        callback: (currentIndex) => {
          // the squares which have a bomb inside of them can not have a number
          if (bombsLayout[currentIndex] === false) {
            newValuesLayout[currentIndex]++;
          }
        },
        layoutLength,
      });
    }
  }

  console.log(bombsLayout);

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
};

export default placeBombs;
