# NFT Miner

This project is an NFT gaming experience, based on the Minesweeper game. The player can decide the shape the game will have by choosing one of the available options, or create its own. If he wins the game, an NFT (resembling the game he just played) will be added to his wallet. Players need to pay to play the game, and to upload their artworks, but they can try to earn money when other people play the artwork they created or by selling the NFTs they won.

Since this project is still in its early stages, most of those features are not yet implemented.

## Use

`npx hardhat node` => runs the local blockchain at http://127.0.0.1:8545/ (should use `npx hardhat compile` before using it)
deploy should be done after running the blockchain, to deploy the contracts
`npx hardhat compile` => compile contracts in the artifacts folder

Whenever something happens in the local blockchain, it will be shown in the console (if it's running, thanks to `npx hardhat node`)
