"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Share2, ShieldCheck, AlertCircle, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/utils/contract";
import { WalletModal } from "@/components/WalletModal";

// Mock Data Store - In a real app, this would be an API call
import { EVENTS_DATA } from "@/data/mockData";

export default function EventDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const event = EVENTS_DATA.find(e => e.id === id);
    const { isConnected } = useAccount();
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const { data: hash, isPending, writeContract, error: writeError, reset } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed, error: txError } = useWaitForTransactionReceipt({
        hash,
    });

    const handleMint = async () => {
        if (!event) return;

        // Check if wallet is connected
        if (!isConnected) {
            setIsWalletModalOpen(true);
            return;
        }

        setError(null);
        setSuccessMessage(null);
        reset();

        try {
            writeContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: 'mintTicket',
                args: [BigInt(event.id), "ipfs://mock-uri"],
                value: parseEther(event.price),
            });
        } catch (error: any) {
            console.error("Minting failed:", error);
            setError(error?.message || "Transaction failed. Please try again.");
        }
    };

    // Handle transaction errors
    useEffect(() => {
        if (writeError) {
            setError(writeError.message || "Transaction failed. Please check your wallet and try again.");
        }
        if (txError) {
            setError(txError.message || "Transaction confirmation failed.");
        }
    }, [writeError, txError]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
    };

    useEffect(() => {
        if (isConfirmed && hash) {
            setSuccessMessage("Ticket minted successfully!");
            setError(null);
            // Optionally redirect or refresh data here
        }
    }, [isConfirmed, hash]);

    if (!event) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
                <h1 className="text-3xl font-bold mb-2">Event Not Found</h1>
                <p className="text-muted-foreground">The event you are looking for does not exist or has been removed.</p>
                <Button className="mt-6" onClick={() => window.history.back()}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Section */}
            <div className={`h-[45vh] ${event.image} relative flex items-end transition-all duration-500`}>
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

                <div className="container mx-auto px-4 pb-12 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-medium border border-white/10">
                                {event.category}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-green-500/20 backdrop-blur-md text-green-100 text-sm font-medium border border-green-500/30 flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                Live Minting
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-7xl font-bold text-white mb-4 tracking-tight">{event.name}</h1>

                        <div className="flex flex-wrap items-center text-white/90 gap-6 text-lg">
                            <span className="flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-300" /> {event.date}</span>
                            <span className="flex items-center gap-2"><Clock className="w-5 h-5 text-blue-300" /> {event.time}</span>
                            <span className="flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-300" /> {event.location}</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-10">
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            About Event
                            <div className="h-1 w-12 bg-primary rounded-full ml-2" />
                        </h2>
                        <p className="text-muted-foreground leading-relaxed text-lg text-justify">
                            {event.description}
                        </p>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h2 className="text-2xl font-bold mb-6">Organizer</h2>
                        <div className="flex items-center gap-4 p-6 rounded-2xl border bg-card/50 hover:bg-card transition-colors">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-orange-500 shadow-lg" />
                            <div>
                                <p className="font-bold text-lg">{event.organizer}</p>
                                <p className="text-sm text-muted-foreground font-mono bg-secondary/50 px-2 py-1 rounded mt-1">
                                    {event.organizerAddress}
                                </p>
                            </div>
                        </div>
                    </motion.section>
                </div>

                {/* Sidebar / Ticket Card */}
                <div className="lg:col-span-1">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="sticky top-24"
                    >
                        <div className="p-8 rounded-3xl border bg-card shadow-2xl relative overflow-hidden">
                            {/* Decorative background blob */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />

                            <div className="flex justify-between items-start mb-8 relative">
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">Ticket Price</p>
                                    <div className="flex items-baseline gap-1">
                                        <p className="text-4xl font-bold text-primary">{event.price}</p>
                                        <span className="text-sm text-muted-foreground">/ person</span>
                                    </div>
                                </div>
                                <Button variant="outline" size="icon" className="rounded-full" onClick={handleShare}>
                                    <Share2 className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="space-y-4 mb-8 relative">
                                <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
                                    <span className="text-sm text-muted-foreground">Available</span>
                                    <span className="font-mono font-medium">{event.supply - event.minted} / {event.supply}</span>
                                </div>
                                <div className="w-full bg-secondary/50 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-primary h-full rounded-full transition-all duration-1000"
                                        style={{ width: `${(event.minted / event.supply) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {!isConnected && (
                                <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm text-amber-600 dark:text-amber-400">
                                    Please connect your wallet to mint tickets
                                </div>
                            )}

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
                                >
                                    <div className="flex items-start gap-2">
                                        <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-destructive">Transaction Failed</p>
                                            <p className="text-xs text-destructive/80 mt-1">{error}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {successMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
                                >
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-green-600 dark:text-green-400">{successMessage}</p>
                                            {hash && (
                                                <a
                                                    href={`https://sepolia.basescan.org/tx/${hash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-green-600 dark:text-green-400 hover:underline flex items-center gap-1 mt-1"
                                                >
                                                    View on BaseScan <ExternalLink className="w-3 h-3" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <Button
                                className="w-full h-14 text-lg font-bold mb-6 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                                onClick={handleMint}
                                disabled={isPending || isConfirming || !isConnected}
                            >
                                {isPending ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Confirm in Wallet...
                                    </div>
                                ) : isConfirming ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Minting...
                                    </div>
                                ) : !isConnected ? (
                                    "Connect Wallet to Mint"
                                ) : (
                                    "Mint Ticket Now"
                                )}
                            </Button>

                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-secondary/20 py-3 rounded-lg">
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                Powered by ChainTicket+ Secure Protocol
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Similar Events Section */}
                <div className="container mx-auto px-4 pb-20">
                    <h2 className="text-2xl font-bold mb-8">Similar Events You Might Like</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {EVENTS_DATA
                            .filter(e => e.category === event.category && e.id !== event.id)
                            .slice(0, 3)
                            .map((similarEvent) => (
                                <Link href={`/events/${similarEvent.id}`} key={similarEvent.id}>
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        className="bg-card border rounded-2xl overflow-hidden hover:shadow-xl transition-all h-full flex flex-col"
                                    >
                                        <div className={`h-40 ${similarEvent.image} bg-cover bg-center`} />
                                        <div className="p-5 flex flex-col flex-grow">
                                            <h3 className="font-bold text-lg mb-2 line-clamp-1">{similarEvent.name}</h3>
                                            <div className="space-y-2 text-sm text-muted-foreground mb-4 flex-grow">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" /> {similarEvent.date}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4" /> {similarEvent.city}, {similarEvent.country}
                                                </div>
                                            </div>
                                            <div className="pt-4 border-t flex justify-between items-center mt-auto">
                                                <span className="font-bold text-primary">{similarEvent.price} ETH</span>
                                                <span className="text-xs bg-secondary px-2 py-1 rounded">{similarEvent.category}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                    </div>
                </div>
            </div>

            <WalletModal
                isOpen={isWalletModalOpen}
                onClose={() => setIsWalletModalOpen(false)}
            />
        </div>
    );
}
