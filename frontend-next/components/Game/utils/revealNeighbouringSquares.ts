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
  // is necessary to check if the square exist
  // since this function will be called for the squares next to the clicked square
  // (and they might not exist)
  if (gameLayout[index] !== squareState.noSquare) {
    visibilityLayout[index] = true;
    if (valuesLayout[index] === 0) {
      executeOnNeighbouringSquares({
        index,
        width,
        callback: (currentIndex) => {
          if (visibilityLayout[currentIndex] !== true) {
            visibilityLayout[currentIndex] = true;
            if (valuesLayout[currentIndex] === 0) {
              revealSquares({
                gameLayout,
                visibilityLayout,
                index: currentIndex,
                width,
                layoutLength,
                valuesLayout,
              });
            }
          }
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

  setVisibilityLayout(newVisibilityLayout);
};

export default revealNeighbouringSquares;
