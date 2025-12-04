"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Share2, ShieldCheck, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner"; // We might need to install sonner or use a simple alert for now

// Mock Data Store - In a real app, this would be an API call
const EVENTS_DATA: Record<string, any> = {
    "1": {
        id: "1",
        name: "Base Hackathon Pakistan",
        description: "Join the biggest Web3 hackathon in Pakistan. Build on Base, win prizes, and network with industry leaders. This event focuses on decentralized social, DeFi, and consumer apps. Expect 48 hours of non-stop coding, mentorship sessions, and free food!",
        date: "Dec 15, 2025",
        time: "09:00 AM - 06:00 PM",
        location: "LUMS, Lahore",
        price: "0.01 ETH",
        supply: 500,
        minted: 124,
        organizer: "Base Pakistan Community",
        organizerAddress: "0x123...abc",
        image: "bg-gradient-to-br from-blue-600 to-purple-600",
        category: "Hackathon"
    },
    "2": {
        id: "2",
        name: "Web3 Summit 2025",
        description: "The premier Web3 conference in Islamabad. Featuring keynote speakers from top global protocols, panel discussions on the future of crypto regulation in Pakistan, and exclusive networking opportunities.",
        date: "Jan 20, 2026",
        time: "10:00 AM - 05:00 PM",
        location: "NUST, Islamabad",
        price: "0.05 ETH",
        supply: 1000,
        minted: 850,
        organizer: "Web3 Islamabad",
        organizerAddress: "0x456...def",
        image: "bg-gradient-to-br from-indigo-500 to-blue-500",
        category: "Conference"
    },
    "3": {
        id: "3",
        name: "Sufi Night & Arts Festival",
        description: "An evening of soulful Sufi music and digital art exhibitions. Experience the blend of tradition and technology as we auction exclusive NFT art pieces during the concert.",
        date: "Feb 14, 2026",
        time: "07:00 PM - 12:00 AM",
        location: "Arts Council, Karachi",
        price: "0.02 ETH",
        supply: 200,
        minted: 45,
        organizer: "Karachi Arts Society",
        organizerAddress: "0x789...ghi",
        image: "bg-gradient-to-br from-pink-600 to-rose-500",
        category: "Music & Arts"
    }
};

export default function EventDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const event = EVENTS_DATA[id];
    const [isMinting, setIsMinting] = useState(false);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
    };

    const handleMint = () => {
        setIsMinting(true);
        // Simulate minting delay
        setTimeout(() => {
            setIsMinting(false);
            alert("Ticket Minted Successfully! (Simulation)");
        }, 2000);
    };

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

                            <Button
                                className="w-full h-14 text-lg font-bold mb-6 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                                onClick={handleMint}
                                disabled={isMinting}
                            >
                                {isMinting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Minting...
                                    </div>
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
        </div>
    );
}
