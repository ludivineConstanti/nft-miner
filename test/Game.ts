import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Game", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployGameFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Game = await ethers.getContractFactory("Game");
    const game = await Game.deploy();

    return { game, owner, otherAccount };
  }

  describe("Retrieve Game Layouts", function () {
    it("Should retrieve the game layout which was added", async function () {
      const { game } = await loadFixture(deployGameFixture);
      const width = 2;
      const layoutData = "0101";
      await game.addGameLayout(width, layoutData);

      const retrievedLayout = await game.getGameLayout(0);

      expect(retrievedLayout.width).to.equal(width);
      expect(retrievedLayout.data).to.equal(layoutData);
    });
    it("Should retrieve multiple game layouts", async function () {
      const { game } = await loadFixture(deployGameFixture);
      const width = 2;
      const layoutData = "0101";
      const numberOfLayouts = 3;

      for (let i = 0; i < numberOfLayouts; i++) {
        await game.addGameLayout(width, layoutData);
      }

      const retrievedLayouts = await game.getGameLayouts();

      expect(retrievedLayouts.length).to.equal(numberOfLayouts);

      expect(retrievedLayouts[0].width).to.equal(width);
      expect(retrievedLayouts[0].data).to.equal(layoutData);
    });
  });

  describe("Events", function () {
    it("Should emit an event on adding a new game layout", async function () {
      const { game } = await loadFixture(deployGameFixture);
      await expect(game.addGameLayout(2, "0101")).to.emit(
        game,
        "NewGameLayout"
      );
    });
  });
});
