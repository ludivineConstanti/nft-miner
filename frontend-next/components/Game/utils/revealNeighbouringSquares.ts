import { squareState } from "../../../constants";
import { executeOnNeighbouringSquares } from ".";

interface RevealSquaresProps {
  gameLayout: squareState[];
  index: number;
  width: number;
  visibilityLayout: boolean[];
  layoutLength: number;
  valuesLayout: number[];
}

const revealSquares = ({
  gameLayout,
  visibilityLayout,
  index,
  width,
  layoutLength,
  valuesLayout,
}: RevealSquaresProps) => {
  // it's necessary to check if the square is part of the artwork
  // since this function will not only be called for the square which was clicked
  // but also for its neighbouring squares
  if (
    gameLayout[index] !== squareState.noSquare &&
    visibilityLayout[index] !== true
  ) {
    visibilityLayout[index] = true;
    // if the square is empty, its neighbouring squares should become visible too
    if (valuesLayout[index] === 0) {
      executeOnNeighbouringSquares({
        index,
        width,
        callback: (currentIndex) => {
          revealSquares({
            gameLayout,
            visibilityLayout,
            index: currentIndex,
            width,
            layoutLength,
            valuesLayout,
          });
        },
        layoutLength,
      });
    }
  }
};

interface RevealNeighbouringSquaresProps extends RevealSquaresProps {
  setVisibilityLayout: React.Dispatch<React.SetStateAction<boolean[]>>;
}

const revealNeighbouringSquares = ({
  gameLayout,
  visibilityLayout,
  index,
  width,
  layoutLength,
  valuesLayout,
  setVisibilityLayout,
}: RevealNeighbouringSquaresProps) => {
  // duplicates the current visibilityLayout to keep the current state
  const newVisibilityLayout = [...visibilityLayout];

  revealSquares({
    gameLayout,
    visibilityLayout: newVisibilityLayout,
    index,
    width,
    layoutLength,
    valuesLayout,
  });

  // updates the visibility loayout with the one updated by the reveal squares function
  setVisibilityLayout(newVisibilityLayout);
};

export default revealNeighbouringSquares;
