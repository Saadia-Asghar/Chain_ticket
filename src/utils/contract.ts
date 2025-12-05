export const CONTRACT_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"; // Placeholder address

export const CONTRACT_ABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_eventId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_tokenURI",
                "type": "string"
            }
        ],
        "name": "mintTicket",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    }
] as const;
