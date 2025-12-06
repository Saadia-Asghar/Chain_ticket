"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, MapPin, Clock, Share2, ShieldCheck, AlertCircle, CheckCircle2, XCircle, ExternalLink, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/utils/contract";
import { WalletModal } from "@/components/WalletModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Mock Data Store - In a real app, this would be an API call
import { saveTicket, getEventById, getEvents, Event } from "@/services/storage";

export default function EventDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const [event, setEvent] = useState<Event | null>(null);
    const [similarEvents, setSimilarEvents] = useState<Event[]>([]);
    const { isConnected, address } = useAccount();
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchEventAndSimilar = async () => {
            const fetchedEvent = await getEventById(id);
            if (fetchedEvent) {
                setEvent(fetchedEvent);

                // Fetch all events to find similar ones
                const allEvents = await getEvents();
                const similar = allEvents
                    .filter(e => e.category === fetchedEvent.category && e.id !== fetchedEvent.id)
                    .slice(0, 3);
                setSimilarEvents(similar);
            }
        };
        fetchEventAndSimilar();
    }, [id]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

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
        setIsShareModalOpen(true);
    };

    // Save ticket when transaction is confirmed
    useEffect(() => {
        const saveTicketToFirebase = async () => {
            if (isConfirmed && hash && event && address) {
                setSuccessMessage("Ticket minted successfully!");
                setError(null);

                const ticketId = Date.now().toString();
                // Use window.location.origin to support deployed environments
                const baseUrl = window.location.origin;
                const verifyUrl = `${baseUrl}/verify/${ticketId}`;
                const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}`;

                await saveTicket({
                    id: ticketId,
                    eventId: event.id,
                    eventName: event.name,
                    eventDate: event.date,
                    eventLocation: event.location,
                    eventImage: event.image,
                    qrData: qrCodeUrl,
                    ownerAddress: address,
                    isUsed: false
                });
                console.log("Ticket saved with ID:", ticketId);
            }
        };
        saveTicketToFirebase();
    }, [isConfirmed, hash, event, address]);

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

    // Check if image is custom or tailwind
    const isCustomImage = event.image?.startsWith('data:') || event.image?.startsWith('http');

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Section */}
            <div className={`h-[45vh] relative flex items-end overflow-hidden`}>
                {/* Background Image Logic */}
                {isCustomImage ? (
                    <img src={event.image} alt={event.name} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                    <div className={`absolute inset-0 w-full h-full ${event.image} bg-cover bg-center`} />
                )}

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
                        <p className="text-muted-foreground leading-relaxed text-lg text-justify whitespace-pre-wrap">
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

            </div>

            {/* Similar Events Section */}
            <div className="container mx-auto px-4 pb-20">
                <h2 className="text-2xl font-bold mb-8">Similar Events You Might Like</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {similarEvents.map((similarEvent) => (
                        <Link href={`/events/${similarEvent.id}`} key={similarEvent.id} className="block h-full w-full">
                            <motion.div
                                whileHover={{ y: -8 }}
                                className="group h-full bg-card border rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 flex flex-col w-full"
                            >
                                <div className={`h-48 relative overflow-hidden w-full`}>
                                    {/* Similar event custom image check */}
                                    {(similarEvent.image?.startsWith('data:') || similarEvent.image?.startsWith('http')) ? (
                                        <img src={similarEvent.image} alt={similarEvent.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className={`w-full h-full ${similarEvent.image} bg-cover bg-center`} />
                                    )}
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                                        {similarEvent.category}
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow w-full">
                                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-1">
                                        {similarEvent.name}
                                    </h3>

                                    <div className="space-y-3 mb-6 flex-grow">
                                        <div className="flex items-center text-muted-foreground text-sm">
                                            <Calendar className="w-4 h-4 mr-2 text-primary/70 flex-shrink-0" />
                                            <span className="truncate">{similarEvent.date}</span>
                                        </div>
                                        <div className="flex items-center text-muted-foreground text-sm">
                                            <MapPin className="w-4 h-4 mr-2 text-primary/70 flex-shrink-0" />
                                            <span className="truncate">{similarEvent.city}, {similarEvent.country}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t mt-auto w-full">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Price</span>
                                            <span className="font-bold text-lg text-primary">{similarEvent.price} ETH</span>
                                        </div>
                                        <Button size="sm" className="rounded-full px-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            Get Ticket
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>

            <WalletModal
                isOpen={isWalletModalOpen}
                onClose={() => setIsWalletModalOpen(false)}
            />

            <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Share Event</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                            <Label htmlFor="link" className="sr-only">
                                Link
                            </Label>
                            <Input
                                id="link"
                                defaultValue={typeof window !== 'undefined' ? window.location.href : ''}
                                readOnly
                            />
                        </div>
                        <Button type="submit" size="sm" className="px-3" onClick={copyToClipboard}>
                            <span className="sr-only">Copy</span>
                            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                        {/* Social Share Buttons */}
                        <Button variant="outline" size="icon" className="rounded-full" onClick={() => window.open(`https://twitter.com/intent/tweet?text=Check out ${event.name} on ChainTicket+!&url=${window.location.href}`, '_blank')}>
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}>
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.797 1.603-2.797 4.16v1.912h4.141l-.542 3.667h-3.599v7.98h-5.018Z" /></svg>
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full" onClick={() => window.open(`mailto:?subject=Check out ${event.name}&body=I found this amazing event on ChainTicket+: ${window.location.href}`, '_blank')}>
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" /><path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" /></svg>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
