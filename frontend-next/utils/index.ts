export const check = {
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

export const indexes = {
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
