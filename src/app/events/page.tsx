"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Ticket, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";

export default function EventsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const events = [
        {
            id: 1,
            name: "Base Hackathon Pakistan",
            date: "Dec 15, 2025",
            location: "LUMS, Lahore",
            price: "0.01 ETH",
            image: "bg-gradient-to-br from-blue-600 to-purple-600",
            category: "Hackathon"
        },
        {
            id: 2,
            name: "Web3 Summit 2025",
            date: "Jan 20, 2026",
            location: "NUST, Islamabad",
            price: "0.05 ETH",
            image: "bg-gradient-to-br from-indigo-500 to-blue-500",
            category: "Conference"
        },
        {
            id: 3,
            name: "Sufi Night & Arts Festival",
            date: "Feb 14, 2026",
            location: "Arts Council, Karachi",
            price: "0.02 ETH",
            image: "bg-gradient-to-br from-pink-600 to-rose-500",
            category: "Music & Arts"
        },
    ];

    const categories = ["All", "Hackathon", "Conference", "Music & Arts"];

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="container mx-auto py-12 px-4 min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12 text-center space-y-4"
            >
                <h1 className="text-5xl font-bold tracking-tight">Discover Events</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Find and attend the best blockchain, tech, and cultural events across Pakistan.
                    Secure your spot with on-chain ticketing.
                </p>
            </motion.div>

            {/* Search and Filter Section */}
            <div className="flex flex-col md:flex-row gap-4 mb-12 max-w-4xl mx-auto">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Search events, locations..."
                        className="pl-10 h-12 rounded-xl bg-secondary/30 border-transparent focus:border-primary transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            variant={selectedCategory === category ? "default" : "outline"}
                            onClick={() => setSelectedCategory(category)}
                            className={`rounded-xl h-12 px-6 whitespace-nowrap ${selectedCategory === category ? 'shadow-lg shadow-primary/25' : 'bg-secondary/30 border-transparent'}`}
                        >
                            {category}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map((event, index) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative bg-card border rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                        >
                            <div className={`h-56 ${event.image} relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                                    {event.category}
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{event.name}</h3>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Calendar className="w-4 h-4 mr-2 text-primary" />
                                        {event.date}
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <MapPin className="w-4 h-4 mr-2 text-primary" />
                                        {event.location}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t">
                                    <span className="font-bold text-xl">{event.price}</span>
                                    <Link href={`/events/${event.id}`}>
                                        <Button className="rounded-xl shadow-md hover:shadow-lg transition-all">
                                            Get Ticket <Ticket className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50 mb-4">
                            <Search className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No events found</h3>
                        <p className="text-muted-foreground">Try adjusting your search or filters.</p>
                        <Button
                            variant="link"
                            onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                            className="mt-2"
                        >
                            Clear all filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
