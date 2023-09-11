const check = {
  isValid: (index: number, length: number) => {
    return index >= 0 && index < length;
  },
  isNotOnLeftBorder: (index: number, width: number) => {
    return index % width !== 0;
  },
  isNotOnRightBorder: (index: number, width: number) => {
    return index % width !== width;
  },
};

const indexes = {
  top: (index: number, width: number) => {
    return index - width;
  },
  topRight: (index: number, width: number) => {
    return index - width + 1;
  },
  right: (index: number) => {
    return index + 1;
  },
  bottomRight: (index: number, width: number) => {
    return index + width + 1;
  },
  bottom: (index: number, width: number) => {
    return index + width;
  },
  bottomLeft: (index: number, width: number) => {
    return index + width - 1;
  },
  left: (index: number) => {
    return index - 1;
  },
  topLeft: (index: number, width: number) => {
    return index - width - 1;
  },
};

interface ExecuteOnNeighbouringSquaresProps {
  index: number;
  width: number;
  callback: (index: number) => void;
  layoutLength: number;
}

// this function execute a callback on the 8 neighbouring squares of a given index
// (top - topRight - right - bottomRight - bottom - bottomLeft - left - topLeft)
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
