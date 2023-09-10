import { executeOnNeighbouringSquares } from ".";
import { squareState } from "../../../constants";

interface FindBombsProps {
  visibilityLayout: boolean[];
  gameLayout: squareState[];
  valuesLayout: number[];
  width: number;
}

const findBombs = ({
  visibilityLayout,
  gameLayout,
  valuesLayout,
  width,
}: FindBombsProps) => {
  const bombLayout: boolean[] = [];

  // I need a way to keep track of how many bombs should still be placed
  const remainingBombs = visibilityLayout.map((visible, index) => {
    if (visible && gameLayout[index] === squareState.thereIsASquare) {
      return valuesLayout[index];
    }
    return 0;
  });

  const remainingBombsBefore = remainingBombs.reduce((a, b) => a + b, 0);

  const bombOptionsData: { index: number; options: number[] }[] = [];

  let populatedBombOptionsData = false;
  let foundMandatoryBomb = true;
  while (foundMandatoryBomb) {
    let numberOfBombsFound = 0;
    // We check each square that is visible
    // Since they can not change their values
    // They should also have a value superior to 0
    // Otherwise, it's useless to check if they should have bombs around them
    visibilityLayout.forEach((visible, index) => {
      if (
        visible &&
        gameLayout[index] === squareState.thereIsASquare &&
        remainingBombs[index] > 0
      ) {
        let options: number[] = [];
        executeOnNeighbouringSquares({
          index,
          width,
          layoutLength: gameLayout.length,
          callback: (currentIndex) => {
            // to see if a square can contain a bomb, we need to make sure that it is still hidden
            // and is part of the pixel art layout (otherwise, the square there does not exist)
            if (
              visibilityLayout[currentIndex] !== true &&
              gameLayout[currentIndex] === squareState.thereIsASquare
            ) {
              let canHaveBomb = true;
              // Once that's done, we still have 1 additional check to do
              // We need to make sure that none of the visible neighbouring square has a value of 0
              executeOnNeighbouringSquares({
                index,
                width,
                layoutLength: gameLayout.length,
                callback: (currentIndex) => {
                  // to see if a square can contain a bomb, we need to make sure that it is still hidden
                  // and is part of the pixel art layout (otherwise, the square there does not exist)
                  if (
                    visibilityLayout[currentIndex] !== true &&
                    gameLayout[currentIndex] === squareState.thereIsASquare &&
                    remainingBombs[currentIndex] === 0
                  ) {
                    canHaveBomb = false;
                  }
                },
              });
              if (canHaveBomb) {
                options.push(currentIndex);
              }
            }
          },
        });

        /* 
      We can guess the likelihood on a bomb being in a neighbouring square
      by dividing the the number of bombs left to place by the number of options we have
      we'll get a number between 0 and 1

      ex: 3 bombs left to place with 3 available options => 3 / 3 = 1
      ex: 1 bomb left with 2 available options => 1 / 2 = 0.5

      if a bomb has a probability of 1, it should always be placed
      */

        const bombCount = remainingBombs[index];

        if (bombCount / options.length === 1) {
          options.forEach((optionIndex) => {
            bombLayout[optionIndex] = true;
            numberOfBombsFound += 1;
            executeOnNeighbouringSquares({
              index: optionIndex,
              width,
              layoutLength: gameLayout.length,
              callback: (currentIndex) => {
                // to see if a square can contain a bomb, we need to make sure that it is still hidden
                // and is part of the pixel art layout (otherwise, the square there does not exist)
                if (
                  visibilityLayout[currentIndex] === true &&
                  gameLayout[currentIndex] === squareState.thereIsASquare
                ) {
                  remainingBombs[currentIndex] -= 1;
                  options = options.filter((option) => option !== currentIndex);
                  if (remainingBombs[currentIndex] < 0) {
                    console.error("ERROR! Negative bomb count");
                  }
                }
              },
            });
          });
        }

        if (populatedBombOptionsData === false) {
          bombOptionsData.push({ index, options });
        }
      }
    });

    console.log("numberOfBombsFound", numberOfBombsFound);
    if (numberOfBombsFound < 1) {
      foundMandatoryBomb = false;
    }

    if (populatedBombOptionsData === false) {
      populatedBombOptionsData = true;
    }
  }
  const remainingBombsAfter = remainingBombs.reduce((a, b) => a + b, 0);

  console.log(
    "remainingBombsBefore",
    remainingBombsBefore,
    "remainingBombsAfter",
    remainingBombsAfter
  );

  bombOptionsData.forEach(({ index, options }) => {
    const probabilities = [];
  });
};

export default findBombs;
