import React, { useEffect } from "react";
import { ethers } from "ethers";
import Game from "../../../artifacts/contracts/Game.sol/Game";

import { squareState } from "../../constants";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractABI = Game.abi;

const init = async () => {
  const provider = ethers.getDefaultProvider("http://127.0.0.1:8545/");
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  try {
    const helloWorld = await contract.helloWorld();

    console.log(helloWorld);
  } catch (error) {
    console.log("ERROR:", error);
  }
};

interface PlaygroundCreatorProps {
  setGameLayout: React.Dispatch<React.SetStateAction<squareState[]>>;
  setGameSize: React.Dispatch<{ width: number; height: number }>;
}

const PlaygroundCreator = ({
  setGameLayout,
  setGameSize,
}: PlaygroundCreatorProps) => {
  useEffect(() => {
    init();
  }, []);
  return (
    <input
      type="file"
      id="img"
      name="img"
      accept="image/*"
      multiple={false}
      onChange={(event) => {
        const { files } = event.target;
        if (files && files.length > 0) {
          const file = files[0] as File;
          const reader = new FileReader();
          reader.addEventListener("load", () => {
            const image = document.createElement("img");
            image.src = reader.result as string;

            image.onload = () => {
              // Create an OffscreenCanvas and draw the ImageBitmap on it
              const canvas = new OffscreenCanvas(image.width, image.height);
              const ctx = canvas.getContext("2d");
              if (ctx) {
                ctx.drawImage(image, 0, 0);

                // Get the pixel data
                const imageData = ctx.getImageData(
                  0,
                  0,
                  image.width,
                  image.height
                );
                const pixelData = imageData.data;

                setGameSize({ width: image.width, height: image.height });

                // Convert the pixel data to an array of numbers
                const values: squareState[] = [];
                for (let i = 0; i < pixelData.length; i += 4) {
                  const value =
                    pixelData[i] + pixelData[i + 1] + pixelData[i + 2];
                  values.push(
                    value / 3 > 125
                      ? squareState.noSquare
                      : squareState.thereIsASquare
                  );
                }
                setGameLayout(values);
              }
            };
          });
          reader.readAsDataURL(file);
        }
      }}
    ></input>
  );
};

export default PlaygroundCreator;
