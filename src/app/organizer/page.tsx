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
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        try {
            const allEvents = await getEvents();
            console.log("Fetched all events:", allEvents.length);
            setEvents(allEvents);
        } catch (error) {
            console.error("Failed to fetch events:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();

        const handleEventsUpdated = () => {
            console.log("Events updated event received, refetching...");
            fetchEvents();
        };

        window.addEventListener('eventsUpdated', handleEventsUpdated);
        return () => window.removeEventListener('eventsUpdated', handleEventsUpdated);
    }, []);

    // Filter by connected wallet address (Case Insensitive)
    const myEvents = isConnected && address
        ? events.filter(e => e.organizerAddress && e.organizerAddress.toLowerCase() === address.toLowerCase())
        : [];

    const totalRevenue = myEvents.reduce((acc, event) => acc + (parseFloat(event.price || "0") * (event.minted || 0)), 0);
    const totalTicketsSold = myEvents.reduce((acc, event) => acc + (event.minted || 0), 0);
    const totalEvents = myEvents.length;

    const handleDownloadAttendees = (event: any) => {
        const attendees = Array.from({ length: event.minted }, (_, i) => ({
            ticketId: i + 1,
            walletAddress: `0x${Math.random().toString(16).slice(2, 42).padEnd(40, '0')}`,
            purchaseDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
            price: event.price,
            status: Math.random() > 0.8 ? "Used" : "Valid"
        }));

        const headers = ["Ticket ID", "Wallet Address", "Purchase Date", "Price (ETH)", "Status"];
        const csvContent = [
            headers.join(","),
            ...attendees.map(a => [a.ticketId, a.walletAddress, a.purchaseDate, a.price, a.status].join(","))
        ].join("\n");

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

            {myEvents.length === 0 ? (
                <div className="text-center py-12 bg-secondary/10 rounded-3xl border border-dashed">
                    <p className="text-muted-foreground mb-4">You haven&apos;t created any events yet.</p>
                    <Link href="/create-event">
                        <Button variant="outline">Create Your First Event</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {myEvents.map((event, index) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-card border rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center hover:shadow-lg transition-all"
                        >
                            <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                                {event.image?.startsWith("http") || event.image?.startsWith("data") ? (
                                    <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className={`w-full h-full ${event.image} bg-cover bg-center`} />
                                )}
                            </div>

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
            )}
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
