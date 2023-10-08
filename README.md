# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

`npx hardhat node` => runs the local blockchain at http://127.0.0.1:8545/ (should use `npx hardhat compile` before using it)
deploy should be done after running the blockchain, to deploy the contracts
`npx hardhat compile` => compile contracts in the artifacts folder

first run `npx hardhat node` and then the deploy script

Whenever something happens in the local blockchain, it will be shown in the console (if it's running, thanks to `npx hardhat node`)
