"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Calendar, Ticket, ChevronLeft, ChevronRight, Star, Filter } from "lucide-react";
import { EVENTS_DATA } from "@/data/mockData";

export default function EventsPage() {
    const { interests, location } = useUserPreferences();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [cityFilter, setCityFilter] = useState("");
    const [countryFilter, setCountryFilter] = useState("");
    const [featuredIndex, setFeaturedIndex] = useState(0);

    const categories = ["All", "Hackathon", "Conference", "Music & Arts", "DeFi", "NFTs", "Gaming", "DAO", "Workshop"];

    // Featured Events (randomly select 3 for demo)
    const featuredEvents = [EVENTS_DATA[0], EVENTS_DATA[4], EVENTS_DATA[3]];

    useEffect(() => {
        const timer = setInterval(() => {
            setFeaturedIndex((prev) => (prev + 1) % featuredEvents.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    // Enhanced Recommendation Logic
    const recommendedEvents = EVENTS_DATA.map(event => {
        let score = 0;
        if (interests.includes(event.category)) score += 2;
        if (location && event.city === location.city) score += 3;
        if (location && event.country === location.country) score += 1;
        return { ...event, score };
    })
        .filter(event => event.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3); // Top 3 recommendations

    const filteredEvents = EVENTS_DATA.filter(event => {
        const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
        const matchesCity = cityFilter === "" || event.city.toLowerCase().includes(cityFilter.toLowerCase());
        const matchesCountry = countryFilter === "" || event.country.toLowerCase().includes(countryFilter.toLowerCase());

        return matchesSearch && matchesCategory && matchesCity && matchesCountry;
    });

    return (
        <div className="container mx-auto py-8 px-4 min-h-screen space-y-12">

            {/* Featured Carousel */}
            <section className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={featuredIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`absolute inset-0 ${featuredEvents[featuredIndex].image} bg-cover bg-center`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full md:w-2/3 space-y-4">
                            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-bold border border-white/20">
                                Featured Event
                            </span>
                            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                                {featuredEvents[featuredIndex].name}
                            </h2>
                            <p className="text-lg text-white/80 line-clamp-2">
                                {featuredEvents[featuredIndex].description}
                            </p>
                            <div className="flex items-center gap-6 text-white/90 pt-4">
                                <span className="flex items-center gap-2"><Calendar className="w-5 h-5" /> {featuredEvents[featuredIndex].date}</span>
                                <span className="flex items-center gap-2"><MapPin className="w-5 h-5" /> {featuredEvents[featuredIndex].city}, {featuredEvents[featuredIndex].country}</span>
                            </div>
                            <div className="pt-6">
                                <Link href={`/events/${featuredEvents[featuredIndex].id}`}>
                                    <Button size="lg" className="rounded-xl text-lg px-8 shadow-lg shadow-primary/25">
                                        Get Tickets
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-8 right-8 flex gap-2 z-10">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full bg-black/20 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                        onClick={() => setFeaturedIndex((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length)}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full bg-black/20 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                        onClick={() => setFeaturedIndex((prev) => (prev + 1) % featuredEvents.length)}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            </section>

            {/* Recommendations Section */}
            {recommendedEvents.length > 0 && (
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-yellow-500/10 rounded-full">
                            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Recommended for You</h2>
                            <p className="text-sm text-muted-foreground">Based on your interests and location</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recommendedEvents.map((event, index) => (
                            <EventCard key={`rec-${event.id}`} event={event} index={index} isRecommended />
                        ))}
                    </div>
                </section>
            )}

            {/* Search and Filter Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Explore All Events</h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Filter className="w-4 h-4" />
                        {filteredEvents.length} events found
                    </div>
                </div>

                <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-6 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Search events..."
                                className="pl-10 h-12 rounded-xl"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-3">
                            <Input
                                placeholder="City"
                                className="h-12 rounded-xl"
                                value={cityFilter}
                                onChange={(e) => setCityFilter(e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-3">
                            <Input
                                placeholder="Country"
                                className="h-12 rounded-xl"
                                value={countryFilter}
                                onChange={(e) => setCountryFilter(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? "default" : "outline"}
                                onClick={() => setSelectedCategory(category)}
                                className={`rounded-full px-6 whitespace-nowrap ${selectedCategory === category ? 'shadow-md' : 'border-dashed'}`}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>
            </section>

            {/* All Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map((event, index) => (
                        <EventCard key={event.id} event={event} index={index} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-20">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/50 mb-6">
                            <Search className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No events found</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                            We couldn't find any events matching your criteria. Try adjusting your filters or search query.
                        </p>
                        <Button
                            variant="link"
                            onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setCityFilter(""); setCountryFilter(""); }}
                            className="mt-4"
                        >
                            Clear all filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

function EventCard({ event, index, isRecommended = false }: { event: any, index: number, isRecommended?: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`group relative bg-card border rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full ${isRecommended ? 'ring-2 ring-primary/50 shadow-lg shadow-primary/10' : ''}`}
        >
            {isRecommended && (
                <div className="absolute top-4 left-4 z-10 bg-primary/90 backdrop-blur-md text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> Recommended
                </div>
            )}
            <div className={`h-48 ${event.image} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                    {event.category}
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1" title={event.name}>{event.name}</h3>
                </div>

                <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-grow">
                    {event.description}
                </p>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2 text-primary/70" />
                        {event.date}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2 text-primary/70" />
                        {event.city}, {event.country}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t mt-auto">
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase">Price</p>
                        <span className="font-bold text-lg">{event.price} ETH</span>
                    </div>
                    <Link href={`/events/${event.id}`}>
                        <Button className="rounded-xl shadow-md hover:shadow-lg transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                            Get Ticket <Ticket className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
