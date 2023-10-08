// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Game {
    
    struct GameLayout {
        uint width;
        string data;
    }
    uint[] public gameLayoutsIds;
    uint gameLayoutsId;
    mapping(uint => GameLayout) public idToGameLayout;
    event NewGameLayout();

    function addGameLayout(uint _width, string memory _data) public {
        gameLayoutsIds.push(gameLayoutsId);
        idToGameLayout[gameLayoutsId] = GameLayout(_width, _data);
        emit NewGameLayout();
        gameLayoutsId ++;
    }

    function getGameLayout(uint _id) public view returns (GameLayout memory) {
        return idToGameLayout[_id];
    }

    function getGameLayouts() public view returns (GameLayout[] memory) {
        GameLayout[] memory gameLayouts = new GameLayout[](gameLayoutsIds.length);
        for (uint i = 0; i < gameLayoutsIds.length; i++) {
            gameLayouts[i] = idToGameLayout[gameLayoutsIds[i]];
        }
        return gameLayouts;
    }
}
