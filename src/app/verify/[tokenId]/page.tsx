"use client";

import { useEffect, useState } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

const ChainTicketPlusABI = [
    {
        "inputs": [{ "internalType": "uint256", "name": "_tokenId", "type": "uint256" }],
        "name": "validateTicket",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "name": "ticketUsed",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
        "name": "ownerOf",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    }
] as const;

const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

export default function VerifyPage() {
    const params = useParams();
    const tokenId = BigInt(params.tokenId as string);

    const { data: isUsed, isLoading: isLoadingUsed } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: ChainTicketPlusABI,
        functionName: "ticketUsed",
        args: [tokenId],
    });

    const { data: owner, isLoading: isLoadingOwner } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: ChainTicketPlusABI,
        functionName: "ownerOf",
        args: [tokenId],
    });

    const { writeContract, isPending, isSuccess } = useWriteContract();

    const handleValidate = () => {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: ChainTicketPlusABI,
            functionName: "validateTicket",
            args: [tokenId],
        });
    };

    if (isLoadingUsed || isLoadingOwner) return <div>Loading ticket status...</div>;

    const isValid = owner && owner !== "0x0000000000000000000000000000000000000000";

    return (
        <div className="container mx-auto max-w-md py-10 text-center">
            <h1 className="text-3xl font-bold mb-8">Ticket Verification</h1>

            <div className={`p-8 rounded-xl border-4 ${isValid && !isUsed ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
                }`}>
                {isValid ? (
                    <>
                        <div className="text-6xl mb-4">{isUsed ? "🔴" : "🟢"}</div>
                        <h2 className="text-2xl font-bold mb-2">
                            {isUsed ? "ALREADY USED" : "VALID TICKET"}
                        </h2>
                        <p className="text-muted-foreground mb-4">
                            Token ID: {tokenId.toString()}
                        </p>
                        <p className="text-sm break-all mb-6">Owner: {owner}</p>

                        {!isUsed && (
                            <Button
                                size="lg"
                                className="w-full bg-green-600 hover:bg-green-700"
                                onClick={handleValidate}
                                disabled={isPending || isSuccess}
                            >
                                {isPending ? "Validating..." : isSuccess ? "Validated!" : "Approve Entry"}
                            </Button>
                        )}
                    </>
                ) : (
                    <>
                        <div className="text-6xl mb-4">❌</div>
                        <h2 className="text-2xl font-bold">INVALID TICKET</h2>
                        <p className="text-muted-foreground">Ticket does not exist.</p>
                    </>
                )}
            </div>
        </div>
    );
}
