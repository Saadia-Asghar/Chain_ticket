// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract POAPToken is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    address public ticketContract;

    constructor(address _ticketContract) ERC721("ChainTicketPlus POAP", "CTPOAP") Ownable(msg.sender) {
        ticketContract = _ticketContract;
    }

    function setTicketContract(address _ticketContract) external onlyOwner {
        ticketContract = _ticketContract;
    }

    function mint(address to, string memory uri) external returns (uint256) {
        require(msg.sender == ticketContract || msg.sender == owner(), "Not authorized");
        
        uint256 tokenId = _nextTokenId++;
        _mint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        return tokenId;
    }

    // Overrides
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
