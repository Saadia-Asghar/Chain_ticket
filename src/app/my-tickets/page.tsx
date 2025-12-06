"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { QrCode, Calendar, MapPin, RefreshCw, Ticket as TicketIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMockAccount } from "@/hooks/useMockAccount";
import { WalletModal } from "@/components/WalletModal";
import { getTickets, Ticket } from "@/services/storage";
import Link from "next/link";

export default function MyTicketsPage() {
    const { isConnected, address } = useMockAccount();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTickets = async () => {
        if (isConnected && address) {
            setLoading(true);
            const userTickets = await getTickets(address);
            setTickets(userTickets);
            setLoading(false);
        } else {
            setTickets([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();

        const handleTicketsUpdated = () => {
            fetchTickets();
        };

        window.addEventListener('ticketsUpdated', handleTicketsUpdated);

        return () => {
            window.removeEventListener('ticketsUpdated', handleTicketsUpdated);
        };
    }, [isConnected, address]);

    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

    // Strictly enforce connection and address presence
    if (!isConnected || !address) {
        return (
            <div className="container mx-auto py-20 px-4 min-h-screen flex flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md space-y-6"
                >
                    <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <QrCode className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h1 className="text-3xl font-bold">Connect Wallet</h1>
                    <p className="text-muted-foreground text-lg">
                        Please connect your wallet to view your tickets and access your QR codes.
                    </p>
                    <Button onClick={() => setIsWalletModalOpen(true)} className="mt-4">
                        Connect Wallet
                    </Button>
                </motion.div>
                <WalletModal
                    isOpen={isWalletModalOpen}
                    onClose={() => setIsWalletModalOpen(false)}
                />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 px-4 min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12 text-center"
            >
                <h1 className="text-4xl font-bold mb-4">My Tickets</h1>
                <p className="text-muted-foreground">Manage your tickets and view QR codes for entry.</p>
            </motion.div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-[400px] rounded-3xl bg-secondary/20 animate-pulse border" />
                    ))}
                </div>
            ) : tickets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tickets.map((ticket, index) => (
                        <TicketFlipCard key={ticket.id} ticket={ticket} index={index} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-secondary/10 rounded-3xl border border-dashed">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-background mb-6 shadow-sm">
                        <TicketIcon className="w-10 h-10 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No Tickets Yet</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                        You haven't purchased any tickets yet. Browse upcoming events to find your first experience!
                    </p>
                    <Link href="/events">
                        <Button size="lg" className="rounded-xl">
                            Browse Events
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}

function TicketFlipCard({ ticket, index }: { ticket: Ticket, index: number }) {
    const [isFlipped, setIsFlipped] = useState(false);

    // Check if image is custom or tailwind class
    const isCustomImage = ticket.eventImage?.startsWith('data:') || ticket.eventImage?.startsWith('http');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative h-[450px] w-full perspective-1000 group cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <motion.div
                className="w-full h-full relative preserve-3d transition-all duration-700 ease-in-out"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front of Card */}
                <div
                    className="absolute inset-0 backface-hidden"
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                >
                    <div className="h-full w-full bg-card border rounded-[2rem] overflow-hidden shadow-xl flex flex-col hover:shadow-2xl transition-shadow duration-300">
                        <div className="relative h-56 w-full overflow-hidden">
                            {isCustomImage ? (
                                <img src={ticket.eventImage} alt={ticket.eventName} className="w-full h-full object-cover" />
                            ) : (
                                <div className={`w-full h-full ${ticket.eventImage} bg-cover bg-center`} />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                            <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold border border-white/20">
                                Ticket #{ticket.id.slice(-4).padStart(4, '0')}
                            </div>
                        </div>

                        <div className="p-6 flex-grow flex flex-col justify-between relative">
                            {/* Cutout circles for ticket effect */}
                            <div className="absolute -left-3 top-[-12px] w-6 h-6 rounded-full bg-background border-r border-border" />
                            <div className="absolute -right-3 top-[-12px] w-6 h-6 rounded-full bg-background border-l border-border" />
                            <div className="absolute top-[-1px] left-3 right-3 border-t-2 border-dashed border-muted-foreground/20" />

                            <div>
                                <h3 className="text-2xl font-bold mb-1 line-clamp-2 leading-tight">{ticket.eventName}</h3>
                                <div className="space-y-3 mt-4">
                                    <div className="flex items-center text-muted-foreground text-sm">
                                        <Calendar className="w-4 h-4 mr-3 text-primary" />
                                        <span className="truncate">{ticket.eventDate}</span>
                                    </div>
                                    <div className="flex items-center text-muted-foreground text-sm">
                                        <MapPin className="w-4 h-4 mr-3 text-primary" />
                                        <span className="truncate">{ticket.eventLocation}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-6 pt-4 border-t">
                                <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${!ticket.isUsed ? 'bg-green-500/10 text-green-600' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    {ticket.isUsed ? 'Used' : 'Valid Entry'}
                                </span>
                                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10 -mr-2">
                                    View QR Code <RefreshCw className="w-3 h-3 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back of Card */}
                <div
                    className="absolute inset-0 backface-hidden h-full w-full bg-card border rounded-[2rem] overflow-hidden shadow-xl flex flex-col items-center justify-center p-8 text-center"
                    style={{
                        transform: "rotateY(180deg)",
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                    }}
                >
                    <div className="absolute inset-0 bg-primary/5" />

                    <div className="relative z-10 w-full flex flex-col items-center">
                        <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 max-w-[200px] mx-auto">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={ticket.qrData} alt="QR Code" className="w-full h-full object-contain" />
                        </div>

                        <h3 className="text-xl font-bold mb-2">{ticket.eventName}</h3>
                        <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                            Present this QR code at the entrance. Each code is unique and can only be used once.
                        </p>

                        <Button variant="outline" className="rounded-xl border-primary/20 text-primary hover:bg-primary/5 hover:text-primary">
                            Flip Card Back
                        </Button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
