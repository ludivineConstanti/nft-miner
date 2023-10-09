import { squareState } from "../constants";

export const returnSquareState = (value: number) =>
  value / 3 > 125 ? squareState.noSquare : squareState.thereIsASquare;
