// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ChainTicketPlus is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    uint256 private _nextEventId;

    struct Event {
        uint256 id;
        string name;
        address organizer;
        uint256 price;
        uint256 supply;
        uint256 minted;
        uint256 eventStart;
        uint256 eventEnd;
        uint256 maxTransfers;
        bool active;
    }

    mapping(uint256 => Event) public events;
    mapping(uint256 => uint256) public ticketEvent; // tokenId => eventId
    mapping(uint256 => uint256) public transfersUsed; // tokenId => transfer count
    mapping(uint256 => bool) public ticketUsed; // tokenId => is used/scanned

    event EventCreated(uint256 indexed eventId, string name, address indexed organizer, uint256 price, uint256 supply);
    event TicketMinted(uint256 indexed tokenId, uint256 indexed eventId, address indexed owner);
    event TicketUsed(uint256 indexed tokenId, uint256 indexed eventId, address indexed owner);

    constructor() ERC721("ChainTicketPlus", "CTP") Ownable(msg.sender) {}

    function createEvent(
        string memory _name,
        uint256 _price,
        uint256 _supply,
        uint256 _eventStart,
        uint256 _eventEnd,
        uint256 _maxTransfers
    ) public returns (uint256) {
        uint256 newEventId = _nextEventId++;

        events[newEventId] = Event({
            id: newEventId,
            name: _name,
            organizer: msg.sender,
            price: _price,
            supply: _supply,
            minted: 0,
            eventStart: _eventStart,
            eventEnd: _eventEnd,
            maxTransfers: _maxTransfers,
            active: true
        });

        emit EventCreated(newEventId, _name, msg.sender, _price, _supply);
        return newEventId;
    }

    function mintTicket(uint256 _eventId, string memory _tokenURI) public payable returns (uint256) {
        Event storage myEvent = events[_eventId];
        require(myEvent.active, "Event is not active");
        require(block.timestamp < myEvent.eventEnd, "Event has ended");
        require(myEvent.minted < myEvent.supply, "Sold out");
        require(msg.value >= myEvent.price, "Insufficient funds");

        uint256 newItemId = _nextTokenId++;

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, _tokenURI);

        ticketEvent[newItemId] = _eventId;
        myEvent.minted += 1;

        // Pay organizer
        payable(myEvent.organizer).transfer(msg.value);

        emit TicketMinted(newItemId, _eventId, msg.sender);
        return newItemId;
    }

    function validateTicket(uint256 _tokenId) public {
        require(_ownerOf(_tokenId) != address(0), "Ticket does not exist");
        require(!ticketUsed[_tokenId], "Ticket already used");
        
        uint256 eventId = ticketEvent[_tokenId];
        Event memory myEvent = events[eventId];
        
        require(msg.sender == myEvent.organizer || msg.sender == owner(), "Not authorized");

        ticketUsed[_tokenId] = true;
        emit TicketUsed(_tokenId, eventId, ownerOf(_tokenId));
    }

    function _update(address to, uint256 tokenId, address auth) internal override(ERC721) returns (address) {
        address from = _ownerOf(tokenId);
        
        if (from != address(0) && to != address(0)) {
            uint256 eventId = ticketEvent[tokenId];
            Event memory myEvent = events[eventId];
            
            require(transfersUsed[tokenId] < myEvent.maxTransfers, "Transfer limit reached");
            transfersUsed[tokenId] += 1;
        }
        
        return super._update(to, tokenId, auth);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
