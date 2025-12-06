"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Calendar, Ticket, ChevronLeft, ChevronRight, Star, Filter, Clock, ImageIcon } from "lucide-react";
import { EVENTS_DATA } from "@/data/mockData";
import { initializeEvents, getEvents, Event } from "@/services/storage";

export default function EventsPage() {
    const { interests, location } = useUserPreferences();
    const [events, setEvents] = useState<Event[]>(EVENTS_DATA);
    const [searchQuery, setSearchQuery] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Listen for local updates from create-event page
        const handleEventsUpdated = () => {
            const local = JSON.parse(localStorage.getItem('local_events') || '[]');
            if (local.length > 0) {
                // Refresh events mixture
                getEvents().then(setEvents);
            }
        };

        window.addEventListener('eventsUpdated', handleEventsUpdated);

        const loadEvents = async () => {
            try {
                initializeEvents(EVENTS_DATA).catch(err => console.warn("Background seed failed:", err));
                const fetchedEvents = await getEvents();
                if (fetchedEvents && fetchedEvents.length > 0) {
                    setEvents(fetchedEvents);
                }
            } catch (error) {
                console.warn("Background fetch failed, keeping mock data:", error);
            }
        };
        loadEvents();

        return () => window.removeEventListener('eventsUpdated', handleEventsUpdated);
    }, []);

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [cityFilter, setCityFilter] = useState("");
    const [countryFilter, setCountryFilter] = useState("");
    const [featuredIndex, setFeaturedIndex] = useState(0);

    const categories = ["All", "Hackathon", "Conference", "Music & Arts", "DeFi", "NFTs", "Gaming", "DAO", "Workshop", "Networking"];

    // Filter Logic
    const filteredEvents = events.filter(event => {
        const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
        const matchesCity = cityFilter === "" || event.city.toLowerCase().includes(cityFilter.toLowerCase());
        const matchesCountry = countryFilter === "" || event.country.toLowerCase().includes(countryFilter.toLowerCase());

        return matchesSearch && matchesCategory && matchesCity && matchesCountry;
    });

    // Date Splitting
    const now = new Date();
    const upcomingEvents = filteredEvents.filter(e => new Date(e.date) >= now).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const pastEvents = filteredEvents.filter(e => new Date(e.date) < now).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Featured (only upcoming)
    const featuredEvents = upcomingEvents.length > 0 ? [upcomingEvents[0], upcomingEvents[Math.min(4, upcomingEvents.length - 1)], upcomingEvents[Math.min(3, upcomingEvents.length - 1)]].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i) : [];

    useEffect(() => {
        if (featuredEvents.length === 0) return;
        const timer = setInterval(() => {
            setFeaturedIndex((prev) => (prev + 1) % featuredEvents.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [featuredEvents.length]);

    // Enhanced Recommendation Logic
    const recommendedEvents = upcomingEvents.map(event => {
        let score = 0;
        if (interests.includes(event.category)) score += 2;
        if (location && event.city === location.city) score += 3;
        if (location && event.country === location.country) score += 1;
        return { ...event, score };
    })
        .filter(event => event.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

    if (!mounted) return null;

    return (
        <div className="container mx-auto py-8 px-4 min-h-screen space-y-12">

            {/* Featured Carousel */}
            {featuredEvents.length > 0 && (
                <section className="relative h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl group">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={featuredIndex}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.7 }}
                            className="absolute inset-0 w-full h-full"
                        >
                            {/* Image Handling */}
                            {(featuredEvents[featuredIndex].image.startsWith('data:') || featuredEvents[featuredIndex].image.startsWith('http')) ? (
                                <img src={featuredEvents[featuredIndex].image} alt="Featured" className="w-full h-full object-cover" />
                            ) : (
                                <div className={`w-full h-full ${featuredEvents[featuredIndex].image} bg-cover bg-center`} />
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                            <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full md:w-2/3 space-y-6">
                                <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-bold border border-white/20 shadow-lg">
                                    Featured Event
                                </span>
                                <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight drop-shadow-lg">
                                    {featuredEvents[featuredIndex].name}
                                </h2>
                                <p className="text-lg text-white/90 line-clamp-2 max-w-2xl drop-shadow-md">
                                    {featuredEvents[featuredIndex].description}
                                </p>
                                <div className="flex items-center gap-6 text-white pt-2 font-medium">
                                    <span className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-lg backdrop-blur-sm"><Calendar className="w-5 h-5" /> {featuredEvents[featuredIndex].date}</span>
                                    <span className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-lg backdrop-blur-sm"><MapPin className="w-5 h-5" /> {featuredEvents[featuredIndex].city}, {featuredEvents[featuredIndex].country}</span>
                                </div>
                                <div className="pt-4">
                                    <Link href={`/events/${featuredEvents[featuredIndex].id}`}>
                                        <Button size="lg" className="rounded-xl text-lg px-8 py-6 shadow-xl shadow-primary/25 bg-white text-black hover:bg-white/90 font-bold">
                                            Get Tickets
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div className="absolute bottom-8 right-8 flex gap-3 z-10">
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full w-12 h-12 bg-black/30 border-white/20 text-white hover:bg-white/20 backdrop-blur-md"
                            onClick={() => setFeaturedIndex((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length)}
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full w-12 h-12 bg-black/30 border-white/20 text-white hover:bg-white/20 backdrop-blur-md"
                            onClick={() => setFeaturedIndex((prev) => (prev + 1) % featuredEvents.length)}
                        >
                            <ChevronRight className="w-6 h-6" />
                        </Button>
                    </div>
                </section>
            )}

            {/* Recommendations Section */}
            {recommendedEvents.length > 0 && (
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-yellow-500/10 rounded-2xl">
                            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold">Recommended for You</h2>
                            <p className="text-muted-foreground">Curated based on your interests and location</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recommendedEvents.map((event, index) => (
                            <EventCard key={`rec-${event.id}`} event={event} index={index} isRecommended />
                        ))}
                    </div>
                </section>
            )}

            {/* Search and Upcoming Events */}
            <section className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Upcoming Events</h2>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            {upcomingEvents.length} events open for booking
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-card border rounded-3xl p-6 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-6 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 w-5 h-5 group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Search events, venues..."
                                className="pl-12 h-14 rounded-2xl bg-secondary/30 border-transparent focus:bg-background focus:border-input transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-3">
                            <Input
                                placeholder="City"
                                className="h-14 rounded-2xl bg-secondary/30 border-transparent focus:bg-background focus:border-input transition-all"
                                value={cityFilter}
                                onChange={(e) => setCityFilter(e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-3">
                            <Input
                                placeholder="Country"
                                className="h-14 rounded-2xl bg-secondary/30 border-transparent focus:bg-background focus:border-input transition-all"
                                value={countryFilter}
                                onChange={(e) => setCountryFilter(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? "default" : "outline"}
                                onClick={() => setSelectedCategory(category)}
                                className={`rounded-full px-6 h-10 whitespace-nowrap transition-all ${selectedCategory === category ? 'shadow-md scale-105' : 'border-muted-foreground/20 hover:border-primary/50'}`}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Event Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {upcomingEvents.length > 0 ? (
                        upcomingEvents.map((event, index) => (
                            <EventCard key={event.id} event={event} index={index} />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center bg-secondary/20 rounded-3xl border border-dashed">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-background mb-6 shadow-sm">
                                <Search className="w-10 h-10 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-xl font-bold">No upcoming events found</h3>
                            <p className="text-muted-foreground mt-2">Try adjusting your filters or search query.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Past Events Section */}
            {pastEvents.length > 0 && (
                <section className="pt-12 border-t">
                    <div className="mb-8 opacity-75">
                        <h2 className="text-3xl font-bold mb-2 text-muted-foreground">Previous Events</h2>
                        <p className="text-muted-foreground">Past events that have successfully concluded.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-75 hover:opacity-100 transition-opacity duration-500">
                        {pastEvents.map((event, index) => (
                            <EventCard key={event.id} event={event} index={index} isPast />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

function EventCard({ event, index, isRecommended = false, isPast = false }: { event: Event, index: number, isRecommended?: boolean, isPast?: boolean }) {
    const isCustomImage = event.image?.startsWith('data:') || event.image?.startsWith('http');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className={`group flex flex-col h-full bg-card border rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${isRecommended ? 'ring-2 ring-primary shadow-lg shadow-primary/10' : ''} ${isPast ? 'grayscale hover:grayscale-0' : ''}`}
        >
            {/* Image Section */}
            <div className="relative h-64 overflow-hidden">
                {isCustomImage ? (
                    <img src={event.image} alt={event.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                    <div className={`w-full h-full ${event.image} bg-cover bg-center transition-transform duration-700 group-hover:scale-110`} />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                {isRecommended && (
                    <div className="absolute top-4 left-4 z-10 bg-primary/90 backdrop-blur-md text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 uppercase tracking-wide">
                        <Star className="w-3 h-3 fill-current" /> Recommended
                    </div>
                )}
                {isPast && (
                    <div className="absolute top-4 right-4 z-10 bg-muted/90 backdrop-blur-md text-muted-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/20 uppercase tracking-wide">
                        Completed
                    </div>
                )}
                {!isPast && (
                    <div className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/20 uppercase tracking-wide">
                        {event.category}
                    </div>
                )}

                <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white line-clamp-1 leading-tight mb-1" title={event.name}>
                        {event.name}
                    </h3>
                    <div className="flex items-center gap-4 text-white/90 text-sm font-medium">
                        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" /> {event.date}</span>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-grow relative">
                <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-grow leading-relaxed">
                    {event.description}
                </p>

                {/* Info Pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary/50 text-xs font-medium text-secondary-foreground">
                        <MapPin className="w-3 h-3" /> {event.city}
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary/50 text-xs font-medium text-secondary-foreground">
                        <Clock className="w-3 h-3" /> {event.time}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
                    <div>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">Price</p>
                        <span className="font-bold text-lg md:text-xl text-foreground flex items-center gap-1">
                            {event.price} <span className="text-sm font-normal text-muted-foreground">ETH</span>
                        </span>
                    </div>
                    {isPast ? (
                        <Button disabled variant="outline" className="rounded-xl px-6 opacity-70">
                            Ended
                        </Button>
                    ) : (
                        <Link href={`/events/${event.id}`}>
                            <Button className="rounded-xl px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all font-semibold">
                                Book Now
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
