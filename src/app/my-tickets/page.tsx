"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { QrCode, Calendar, MapPin, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

import { EVENTS_DATA } from "@/data/mockData";

const MY_TICKETS = [
    {
        id: "101",
        eventId: "1",
        ...EVENTS_DATA.find(e => e.id === "1"),
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent('http://localhost:3000/verify/101')}`,
        status: "Valid"
    },
    {
        id: "102",
        eventId: "2",
        ...EVENTS_DATA.find(e => e.id === "2"),
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent('http://localhost:3000/verify/102')}`,
        status: "Used"
    }
];

export default function MyTicketsPage() {
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {MY_TICKETS.map((ticket, index) => (
                    <TicketFlipCard key={ticket.id} ticket={ticket} index={index} />
                ))}
            </div>
        </div>
    );
}

function TicketFlipCard({ ticket, index }: { ticket: any, index: number }) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative h-[400px] w-full perspective-1000 group cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <motion.div
                className="w-full h-full relative preserve-3d transition-all duration-500"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front of Card */}
                <div
                    className="absolute inset-0 backface-hidden"
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                >
                    <div className="h-full w-full bg-card border rounded-3xl overflow-hidden shadow-xl flex flex-col">
                        <div className={`h-48 ${ticket.image} relative p-6 flex flex-col justify-between`}>
                            <div className="bg-white/20 backdrop-blur-md self-start px-3 py-1 rounded-full text-white text-xs font-bold border border-white/20">
                                Ticket #{ticket.id.padStart(3, '0')}
                            </div>
                            <h3 className="text-2xl font-bold text-white">{ticket.name}</h3>
                        </div>

                        <div className="p-6 flex-grow flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="flex items-center text-muted-foreground">
                                    <Calendar className="w-5 h-5 mr-3 text-primary" />
                                    {ticket.date}
                                </div>
                                <div className="flex items-center text-muted-foreground">
                                    <MapPin className="w-5 h-5 mr-3 text-primary" />
                                    {ticket.location}
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-6">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${ticket.status === 'Valid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                    }`}>
                                    {ticket.status}
                                </span>
                                <Button variant="ghost" className="text-primary hover:text-primary/80">
                                    Tap to View QR <RefreshCw className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back of Card */}
                <div
                    className="absolute inset-0 backface-hidden h-full w-full bg-card border rounded-3xl overflow-hidden shadow-xl flex flex-col items-center justify-center p-8"
                    style={{
                        transform: "rotateY(180deg)",
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                    }}
                >
                    <h3 className="text-xl font-bold mb-6">Scan for Entry</h3>
                    <div className="bg-white p-4 rounded-xl shadow-inner mb-6">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={ticket.qrCode} alt="QR Code" className="w-48 h-48 object-contain" />
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                        Show this QR code to the gatekeeper at the venue entrance.
                    </p>
                    <Button variant="ghost" className="mt-4 text-primary">
                        Tap to Flip Back
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
}
