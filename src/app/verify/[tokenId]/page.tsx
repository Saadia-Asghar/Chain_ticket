"use client";

import { useEffect, useState } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, QrCode, Shield, Info, Loader2 } from "lucide-react";
import Link from "next/link";

import { CONTRACT_ADDRESS } from "@/utils/contract";

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
    const tokenId = BigInt(params.tokenId as string);

    const { data: isUsed, isLoading: isLoadingUsed, refetch: refetchUsed } = useReadContract({
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

    const { writeContract, isPending, isSuccess, isError } = useWriteContract();

    const handleValidate = () => {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: ChainTicketPlusABI,
            functionName: "validateTicket",
            args: [tokenId],
        });
    };

    // Refetch ticket status after successful validation
    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                refetchUsed();
            }, 2000);
        }
    }, [isSuccess, refetchUsed]);

    const isLoading = isLoadingUsed || isLoadingOwner;
    const isValid = owner && owner !== "0x0000000000000000000000000000000000000000";

    return (
        <div className="container mx-auto max-w-4xl py-12 px-4 min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center"
            >
                <div className="inline-flex p-4 bg-primary/10 rounded-full mb-6">
                    <QrCode className="w-12 h-12 text-primary" />
                </div>
                <h1 className="text-4xl font-bold mb-4">Ticket Verification</h1>
                <p className="text-muted-foreground text-lg">
                    Verify ticket authenticity on the blockchain
                </p>
            </motion.div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                    <p className="text-lg text-muted-foreground">Verifying ticket on blockchain...</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Verification Result */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-8 rounded-3xl border-4 ${isValid && !isUsed
                                ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                                : isValid && isUsed
                                    ? "border-amber-500 bg-amber-50 dark:bg-amber-950/20"
                                    : "border-red-500 bg-red-50 dark:bg-red-950/20"
                            }`}
                    >
                        <div className="text-center">
                            {isValid ? (
                                <>
                                    <div className="inline-flex p-6 rounded-full bg-white dark:bg-gray-900 mb-6">
                                        {isUsed ? (
                                            <AlertCircle className="w-20 h-20 text-amber-500" />
                                        ) : (
                                            <CheckCircle2 className="w-20 h-20 text-green-500" />
                                        )}
                                    </div>
                                    <h2 className="text-3xl font-bold mb-3">
                                        {isUsed ? "ALREADY USED" : "VALID TICKET ✓"}
                                    </h2>
                                    <p className="text-muted-foreground mb-6">
                                        {isUsed
                                            ? "This ticket has already been validated and used for entry"
                                            : "This ticket is authentic and ready for entry"}
                                    </p>

                                    {/* Ticket Details */}
                                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 mb-6 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Token ID</span>
                                            <span className="font-mono font-bold">#{tokenId.toString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Owner</span>
                                            <span className="font-mono text-xs">
                                                {owner?.slice(0, 6)}...{owner?.slice(-4)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Status</span>
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${isUsed
                                                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                                        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                    }`}
                                            >
                                                {isUsed ? "Used" : "Valid"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    {!isUsed && (
                                        <div className="space-y-4">
                                            <Button
                                                size="lg"
                                                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl h-14 text-lg"
                                                onClick={handleValidate}
                                                disabled={isPending || isSuccess}
                                            >
                                                {isPending ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                        Validating on Blockchain...
                                                    </>
                                                ) : isSuccess ? (
                                                    <>
                                                        <CheckCircle2 className="w-5 h-5 mr-2" />
                                                        Entry Approved!
                                                    </>
                                                ) : (
                                                    <>
                                                        <Shield className="w-5 h-5 mr-2" />
                                                        Approve Entry
                                                    </>
                                                )}
                                            </Button>

                                            {isError && (
                                                <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-xl p-4">
                                                    <p className="text-red-700 dark:text-red-400 text-sm">
                                                        Transaction failed. Please try again or check your wallet.
                                                    </p>
                                                </div>
                                            )}

                                            {isSuccess && (
                                                <div className="bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-800 rounded-xl p-4">
                                                    <p className="text-green-700 dark:text-green-400 text-sm">
                                                        ✓ Ticket successfully validated! Entry approved.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="inline-flex p-6 rounded-full bg-white dark:bg-gray-900 mb-6">
                                        <XCircle className="w-20 h-20 text-red-500" />
                                    </div>
                                    <h2 className="text-3xl font-bold mb-3">INVALID TICKET</h2>
                                    <p className="text-muted-foreground mb-6">
                                        This ticket does not exist or has been burned
                                    </p>
                                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6">
                                        <p className="text-sm text-muted-foreground">
                                            Token ID: <span className="font-mono font-bold">#{tokenId.toString()}</span>
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>

                    {/* How It Works */}
                    <div className="bg-card border rounded-3xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Info className="w-6 h-6 text-primary" />
                            <h3 className="text-2xl font-bold">How Ticket Verification Works</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <VerificationStep
                                number="1"
                                title="Scan QR Code"
                                description="Each ticket has a unique QR code containing the token ID"
                            />
                            <VerificationStep
                                number="2"
                                title="Blockchain Check"
                                description="The system verifies ticket ownership and usage status on the blockchain"
                            />
                            <VerificationStep
                                number="3"
                                title="Approve Entry"
                                description="If valid and unused, approve entry and mark ticket as used"
                            />
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 border rounded-2xl p-6">
                        <h4 className="font-semibold mb-3">Security Features</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                                <span>Blockchain-verified ownership - tickets cannot be counterfeited</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                                <span>One-time use enforcement - prevents ticket reuse</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                                <span>Immutable records - all validations are permanently recorded</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                                <span>Real-time verification - instant confirmation on the blockchain</span>
                            </li>
                        </ul>
                    </div>

                    {/* Back to Events */}
                    <div className="text-center">
                        <Link href="/events">
                            <Button variant="outline" className="rounded-xl">
                                Browse Events
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
        <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mx-auto mb-3">
                {number}
            </div>
            <h4 className="font-semibold mb-2">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    );
}
