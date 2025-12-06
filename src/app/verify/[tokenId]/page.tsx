"use client";

import { useEffect, useState } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, QrCode, Shield, Info, Loader2 } from "lucide-react";
import Link from "next/link";

import { CONTRACT_ADDRESS } from "@/utils/contract";
import { getTicketById, updateTicket, Ticket } from "@/services/storage";

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


export default function VerifyPage() {
    const params = useParams();
    const tokenIdStr = params.tokenId as string;

    // Fallback: Safe BigInt conversion if it's a number, otherwise null (mock IDs might be non-numeric strings? No, date.now is numeric string)
    let tokenId: bigint | undefined;
    try {
        tokenId = BigInt(tokenIdStr);
    } catch (e) {
        console.warn("Invalid token ID format for contract:", tokenIdStr);
    }

    // State for local/firebase ticket
    const [storedTicket, setStoredTicket] = useState<Ticket | null>(null);
    const [loadingStored, setLoadingStored] = useState(true);
    const [manualVerificationSuccess, setManualVerificationSuccess] = useState(false);

    // Fetch from Storage
    useEffect(() => {
        const fetchTicket = async () => {
            const ticket = await getTicketById(tokenIdStr);
            if (ticket) {
                setStoredTicket(ticket);
            }
            setLoadingStored(false);
        };
        fetchTicket();
    }, [tokenIdStr]);

    // Blockchain Reads
    const { data: isUsedOnChain, isLoading: isLoadingUsed, refetch: refetchUsed } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: ChainTicketPlusABI,
        functionName: "ticketUsed",
        args: tokenId ? [tokenId] : undefined,
        query: { enabled: !!tokenId }
    });

    const { data: ownerOnChain, isLoading: isLoadingOwner } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: ChainTicketPlusABI,
        functionName: "ownerOf",
        args: tokenId ? [tokenId] : undefined,
        query: { enabled: !!tokenId }
    });

    const { writeContract, isPending, isSuccess, isError } = useWriteContract();

    // Verification Logic
    const handleValidate = async () => {
        // 1. Try Blockchain Validation
        if (tokenId && ownerOnChain) {
            try {
                writeContract({
                    address: CONTRACT_ADDRESS,
                    abi: ChainTicketPlusABI,
                    functionName: "validateTicket",
                    args: [tokenId],
                });
            } catch (e) { console.error("Contract write failed", e) }
        }

        // 2. Always update local storage for instant feedback/hybrid mode
        if (storedTicket) {
            await updateTicket({ ...storedTicket, isUsed: true });
            const updated = await getTicketById(tokenIdStr);
            if (updated) setStoredTicket(updated);
            setManualVerificationSuccess(true);
        }
    };

    // Refetch ticket status after successful validation
    useEffect(() => {
        if (isSuccess || manualVerificationSuccess) {
            setTimeout(() => {
                refetchUsed();
                // Refetch local
                getTicketById(tokenIdStr).then(t => t && setStoredTicket(t));
            }, 2000);
        }
    }, [isSuccess, manualVerificationSuccess, refetchUsed, tokenIdStr]);

    const isLoading = loadingStored && (isLoadingUsed || isLoadingOwner);

    // Determination Logic:
    // If found in Storage, use Storage.
    // Else use Blockchain.
    // If both, prefer Storage for 'details' but Blockchain for 'validity' if available.
    // Actually, simplifying: Use Storage if available (since our Mint flow uses Storage primarily).

    let isValid = false;
    let isUsed = false;
    let owner = "Unknown";
    let ticketSource = "Not Found";

    if (storedTicket) {
        isValid = true;
        isUsed = storedTicket.isUsed;
        owner = storedTicket.ownerAddress;
        ticketSource = "Database";
    } else if (ownerOnChain && ownerOnChain !== "0x0000000000000000000000000000000000000000") {
        isValid = true;
        isUsed = !!isUsedOnChain;
        owner = ownerOnChain;
        ticketSource = "Blockchain";
    }

    return (
        <div className="container mx-auto max-w-4xl py-12 px-4 min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center"
            >
                <div className="inline-flex p-4 bg-primary/10 rounded-full mb-6 relative">
                    <QrCode className="w-12 h-12 text-primary" />
                    <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-background ${loadingStored ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`} />
                </div>
                <h1 className="text-4xl font-bold mb-4">Ticket Verification</h1>
                <p className="text-muted-foreground text-lg">
                    Real-time ticket authenticity check
                </p>
                <div className="mt-2 text-xs text-muted-foreground font-mono bg-secondary/30 inline-block px-2 py-1 rounded">
                    ID: {tokenIdStr}
                </div>
            </motion.div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                    <p className="text-lg text-muted-foreground">Verifying ticket data...</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Verification Result */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-8 rounded-3xl border-4 shadow-xl transition-colors duration-500 ${isValid && !isUsed
                            ? "border-green-500 bg-green-50/50 dark:bg-green-950/20"
                            : isValid && isUsed
                                ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20"
                                : "border-destructive bg-destructive/5 dark:bg-destructive/10"
                            }`}
                    >
                        <div className="text-center">
                            {isValid ? (
                                <>
                                    <div className="inline-flex p-6 rounded-full bg-background mb-6 shadow-sm">
                                        {isUsed ? (
                                            <AlertCircle className="w-20 h-20 text-amber-500" />
                                        ) : (
                                            <CheckCircle2 className="w-20 h-20 text-green-500" />
                                        )}
                                    </div>
                                    <h2 className="text-4xl font-bold mb-3 tracking-tight">
                                        {isUsed ? "ALREADY USED" : "VALID TICKET"}
                                    </h2>
                                    <p className="text-muted-foreground mb-8 text-lg">
                                        {isUsed
                                            ? "This ticket has already been scanned and verified."
                                            : "This ticket is authentic. You may approve entry."}
                                    </p>

                                    {/* Ticket Details */}
                                    <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 mb-8 space-y-4 max-w-lg mx-auto border shadow-sm text-left">
                                        {storedTicket && (
                                            <div className="pb-4 border-b mb-4">
                                                <h3 className="font-bold text-lg mb-1">{storedTicket.eventName}</h3>
                                                <p className="text-sm text-muted-foreground">{storedTicket.eventDate} • {storedTicket.eventLocation}</p>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Status</span>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isUsed
                                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                                                    : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                                                    }`}
                                            >
                                                {isUsed ? "Used" : "Active"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Owner</span>
                                            <span className="font-mono text-xs bg-secondary/50 px-2 py-1 rounded">
                                                {owner?.slice(0, 8)}...{owner?.slice(-6)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Source</span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Shield className="w-3 h-3" /> {ticketSource}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    {!isUsed && (
                                        <div className="space-y-4 max-w-md mx-auto">
                                            <Button
                                                size="lg"
                                                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl h-16 text-xl font-bold shadow-lg shadow-green-600/20 hover:shadow-green-600/40 transition-all hover:-translate-y-1"
                                                onClick={handleValidate}
                                                disabled={isPending || isSuccess || manualVerificationSuccess}
                                            >
                                                {isPending ? (
                                                    <>
                                                        <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                                                        Verifying...
                                                    </>
                                                ) : isSuccess || manualVerificationSuccess ? (
                                                    <>
                                                        <CheckCircle2 className="w-6 h-6 mr-2" />
                                                        Approved!
                                                    </>
                                                ) : (
                                                    <>
                                                        <Shield className="w-6 h-6 mr-2" />
                                                        Approve Entry
                                                    </>
                                                )}
                                            </Button>

                                            {isError && (
                                                <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-xl p-4">
                                                    <p className="text-red-700 dark:text-red-400 text-sm">
                                                        Blockchain transaction failed, but ticket might be valid in local database.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="inline-flex p-6 rounded-full bg-background mb-6">
                                        <XCircle className="w-20 h-20 text-destructive" />
                                    </div>
                                    <h2 className="text-3xl font-bold mb-3">INVALID TICKET</h2>
                                    <p className="text-muted-foreground mb-6">
                                        This ticket could not be found in the registry.
                                    </p>
                                    <div className="bg-card rounded-2xl p-6 max-w-sm mx-auto border">
                                        <p className="text-sm text-muted-foreground">
                                            Token ID: <span className="font-mono font-bold text-foreground mx-2">#{tokenIdStr}</span>
                                        </p>
                                    </div>
                                    <div className="mt-8">
                                        <Button variant="outline" onClick={() => window.location.reload()}>
                                            Try Again
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>

                    {/* How It Works */}
                    <div className="bg-card border rounded-[2rem] p-8">
                        <div className="flex items-center gap-3 mb-8 justify-center md:justify-start">
                            <Info className="w-6 h-6 text-primary" />
                            <h3 className="text-2xl font-bold">Verification Process</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                            {/* Connector Line (Desktop) */}
                            <div className="hidden md:block absolute top-[28px] left-[16%] right-[16%] h-0.5 bg-border -z-10" />

                            <VerificationStep
                                number="1"
                                title="Scan QR Code"
                                description="Gatekeeper scans the visitor's unique ticket QR"
                            />
                            <VerificationStep
                                number="2"
                                title="Instant Lookup"
                                description="System retrieves ticket data from blockchain & database"
                            />
                            <VerificationStep
                                number="3"
                                title="Entry Approval"
                                description="Operator marks ticket as 'Used' to prevent re-entry"
                            />
                        </div>
                    </div>

                    {/* Back to Events */}
                    <div className="text-center pt-4">
                        <Link href="/events">
                            <Button variant="ghost" className="rounded-xl hover:bg-secondary/50">
                                Back to Browse Events
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

function VerificationStep({ number, title, description }: { number: string; title: string; description: string }) {
    return (
        <div className="text-center bg-card md:bg-transparent p-4 md:p-0 rounded-2xl border md:border-0 relative">
            <div className="w-14 h-14 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center text-primary font-bold text-xl mx-auto mb-4 shadow-sm z-10 relative">
                {number}
            </div>
            <h4 className="font-bold text-lg mb-2">{title}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
    );
}
