import { indexes, check } from ".";

interface ExecuteOnNeighbouringSquaresProps {
  index: number;
  width: number;
  callback: (index: number) => void;
  layoutLength: number;
}

const executeOnNeighbouringSquares = ({
  index,
  width,
  callback,
  layoutLength,
}: ExecuteOnNeighbouringSquaresProps) => {
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

export default executeOnNeighbouringSquares;
