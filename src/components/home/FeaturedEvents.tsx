"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { EVENTS_DATA } from "@/data/mockData";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeaturedEvents() {
    // Select a few events to feature (e.g., first 3)
    const featuredEvents = EVENTS_DATA.slice(0, 3);

    return (
        <section className="py-20 bg-background">
            <div className="container px-4 mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Events</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                            Discover the hottest Web3 events happening around you.
                        </p>
                    </motion.div>
                    <Link href="/events" className="hidden md:block">
                        <Button variant="ghost" className="group">
                            View All Events <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {featuredEvents.map((event, index) => (
                        <Link href={`/events/${event.id}`} key={event.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -8 }}
                                className="group h-full bg-card border rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 flex flex-col"
                            >
                                <div className={`h-48 ${event.image} bg-cover bg-center relative overflow-hidden`}>
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                                        {event.category}
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-1">
                                        {event.name}
                                    </h3>

                                    <div className="space-y-3 mb-6 flex-grow">
                                        <div className="flex items-center text-muted-foreground text-sm">
                                            <Calendar className="w-4 h-4 mr-2 text-primary/70" />
                                            {event.date}
                                        </div>
                                        <div className="flex items-center text-muted-foreground text-sm">
                                            <MapPin className="w-4 h-4 mr-2 text-primary/70" />
                                            {event.city}, {event.country}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t mt-auto">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Price</span>
                                            <span className="font-bold text-lg text-primary">{event.price} ETH</span>
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

                <div className="mt-12 text-center md:hidden">
                    <Link href="/events">
                        <Button variant="outline" className="w-full rounded-xl">
                            View All Events
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
