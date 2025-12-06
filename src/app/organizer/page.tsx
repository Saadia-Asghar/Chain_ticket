"use client";

import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import { Calendar, DollarSign, Users, TrendingUp, Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getEvents, Event } from "@/services/storage";
import { useMockAccount } from "@/hooks/useMockAccount";
import { WalletModal } from "@/components/WalletModal";

export default function OrganizerDashboard() {
    const { address, isConnected } = useMockAccount();
    const [events, setEvents] = useState<Event[]>([]);
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            const allEvents = await getEvents();
            setEvents(allEvents);
        };
        fetchEvents();
    }, []);

    // In a real app, we would filter by the connected wallet address
    // For demo purposes, we'll show events if connected, or a specific set if we match the mock data addresses
    const myEvents = isConnected ? events : [];

    const totalRevenue = myEvents.reduce((acc, event) => acc + (parseFloat(event.price) * event.minted), 0);
    const totalTicketsSold = myEvents.reduce((acc, event) => acc + event.minted, 0);
    const totalEvents = myEvents.length;

    const handleDownloadAttendees = (event: any) => {
        // Generate mock attendee data
        const attendees = Array.from({ length: event.minted }, (_, i) => ({
            ticketId: i + 1,
            walletAddress: `0x${Math.random().toString(16).slice(2, 42).padEnd(40, '0')}`,
            purchaseDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
            price: event.price,
            status: Math.random() > 0.8 ? "Used" : "Valid"
        }));

        // Convert to CSV
        const headers = ["Ticket ID", "Wallet Address", "Purchase Date", "Price (ETH)", "Status"];
        const csvContent = [
            headers.join(","),
            ...attendees.map(a => [a.ticketId, a.walletAddress, a.purchaseDate, a.price, a.status].join(","))
        ].join("\n");

        // Create and trigger download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${event.name.replace(/\s+/g, '_')}_attendees.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!isConnected) {
        return (
            <div className="container mx-auto py-20 px-4 min-h-screen flex flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md space-y-6"
                >
                    <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <TrendingUp className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
                    <p className="text-muted-foreground text-lg">
                        Please connect your wallet to view your dashboard and manage events.
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
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Organizer Dashboard</h1>
                    <p className="text-muted-foreground">Manage your events and track performance.</p>
                </div>
                <Link href="/create-event">
                    <Button className="rounded-xl shadow-lg shadow-primary/20">
                        <Plus className="w-4 h-4 mr-2" /> Create New Event
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatsCard
                    title="Total Revenue"
                    value={`${totalRevenue.toFixed(2)} ETH`}
                    icon={<DollarSign className="w-6 h-6 text-green-500" />}
                    delay={0}
                />
                <StatsCard
                    title="Tickets Sold"
                    value={totalTicketsSold.toString()}
                    icon={<Users className="w-6 h-6 text-blue-500" />}
                    delay={0.1}
                />
                <StatsCard
                    title="Active Events"
                    value={totalEvents.toString()}
                    icon={<Calendar className="w-6 h-6 text-purple-500" />}
                    delay={0.2}
                />
            </div>

            {/* Events List */}
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" /> Your Events
            </h2>

            <div className="grid grid-cols-1 gap-6">
                {myEvents.map((event, index) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card border rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center hover:shadow-lg transition-all"
                    >
                        <div className={`w-full md:w-48 h-32 ${event.image} rounded-xl flex-shrink-0`} />

                        <div className="flex-grow space-y-2 text-center md:text-left">
                            <h3 className="text-xl font-bold">{event.name}</h3>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {event.date}</span>
                                <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {event.price} ETH</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center md:items-end gap-2 min-w-[150px]">
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">Sales</p>
                                <p className="font-bold text-lg">{event.minted} / {event.supply}</p>
                            </div>
                            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden mt-1">
                                <div
                                    className="bg-primary h-full rounded-full"
                                    style={{ width: `${(event.minted / event.supply) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => handleDownloadAttendees(event)}
                                title="Download Attendee Data"
                            >
                                <Download className="w-4 h-4 mr-2" /> Data
                            </Button>
                            <Link href={`/events/${event.id}`}>
                                <Button variant="outline">View</Button>
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon, delay }: { title: string, value: string, icon: React.ReactNode, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-card border rounded-2xl p-6 shadow-sm flex items-center gap-4"
        >
            <div className="p-4 bg-secondary/50 rounded-xl">
                {icon}
            </div>
            <div>
                <p className="text-sm text-muted-foreground font-medium">{title}</p>
                <h3 className="text-2xl font-bold">{value}</h3>
            </div>
        </motion.div>
    );
}
