# NFT Miner

This project is an NFT gaming experience, based on the Minesweeper game. The player can decide the shape the game will have by choosing one of the available options, or create its own. If he wins the game, an NFT (resembling the game he just played) will be added to his wallet. Players need to pay to play the game, and to upload their artworks, but they can try to earn money when other people play the artwork they created or by selling the NFTs they won.

An artwork like so:

![duck](https://github.com/ludivineConstanti/nft-miner/assets/24965333/7a4a2659-1d34-44a3-808e-59b30aec9f6f)

Will be transformed into a minesweeper game:

![scrnli_09_10_2023_21-57-26](https://github.com/ludivineConstanti/nft-miner/assets/24965333/37e08f7f-d2ae-44ef-8e52-b70daf500f1a)

![scrnli_09_10_2023_21-58-55](https://github.com/ludivineConstanti/nft-miner/assets/24965333/e6f8e6c6-02a4-4ce3-9cf5-bc9489fa3df0)

And then an NFT will be delivered, if the user wins the game

Since this project is still in its early stages, most of those features are not yet implemented.

## Use

`npx hardhat node` => runs the local blockchain at http://127.0.0.1:8545/ (should use `npx hardhat compile` before using it)
deploy should be done after running the blockchain, to deploy the contracts
`npx hardhat compile` => compile contracts in the artifacts folder

Whenever something happens in the local blockchain, it will be shown in the console (if it's running, thanks to `npx hardhat node`)
