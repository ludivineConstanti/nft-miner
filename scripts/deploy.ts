import { ethers } from "hardhat";
import fs from "fs";
import { returnSquareState } from "../utils";
import Jimp from "jimp";

const imageSourceFolder = "./images";

const getFiles = async (directoryPath: string) => {
  try {
    const files = await fs.promises.readdir(directoryPath);
    return files;
  } catch (error) {
    console.log(error);
  }
};

async function main() {
  // Deploy contract
  const Game = await ethers.getContractFactory("Game");
  const game = await Game.deploy();

  await game.deployed();

  console.log(`Game deployed to ${game.address}`);

  // Add game layouts
  const files = (await getFiles(imageSourceFolder)) as string[];

  files.forEach((path) => {
    Jimp.read(`${imageSourceFolder}/${path}`)
      .then(async (image) => {
        // Do stuff with the image.
        const width = image.getWidth();
        const height = image.getHeight();

        let data = "";

        for (let i = 0; i < height; i++) {
          for (let j = 0; j < width; j++) {
            const pixelData = Jimp.intToRGBA(image.getPixelColor(i, j));
            const value =
              (pixelData.r + pixelData.g + pixelData.b) * pixelData.a;
            data += returnSquareState(value);
          }
        }

        await game.addGameLayout(width, data);
      })
      .catch((err) => {
        // Handle an exception.
        console.error(err);
      });
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
