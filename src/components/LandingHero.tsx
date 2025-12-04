"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Ticket, ShieldCheck, Zap } from "lucide-react";

export function LandingHero() {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-[80vh] text-center px-4 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-4xl space-y-6"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-secondary text-sm text-secondary-foreground backdrop-blur-sm mb-4">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Live on Base Sepolia
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-gradient-x pb-2">
                    The Future of <br />
                    <span className="text-foreground">Event Ticketing</span>
                </h1>

                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Eliminate scalping and fraud with ChainTicket+.
                    Secure, transparent, and verifiable tickets powered by the Base blockchain.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link href="/create-event">
                        <Button size="lg" className="h-12 px-8 text-lg gap-2 rounded-full shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all">
                            Create Event <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                    <Link href="/events">
                        <Button variant="outline" size="lg" className="h-12 px-8 text-lg rounded-full backdrop-blur-sm bg-background/50 hover:bg-background/80">
                            Browse Events
                        </Button>
                    </Link>
                </div>
            </motion.div>

            {/* Floating Cards Animation */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-12 hidden xl:block opacity-50 pointer-events-none">
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                    <TicketCardPreview />
                </motion.div>
            </div>

            <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-12 hidden xl:block opacity-50 pointer-events-none">
                <motion.div
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                    <TicketCardPreview variant="purple" />
                </motion.div>
            </div>

            {/* Features Grid */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl w-full text-left"
            >
                <FeatureCard
                    icon={<ShieldCheck className="w-10 h-10 text-blue-500" />}
                    title="Anti-Fraud"
                    description="Smart contracts ensure every ticket is authentic and impossible to duplicate."
                />
                <FeatureCard
                    icon={<Ticket className="w-10 h-10 text-purple-500" />}
                    title="Controlled Resale"
                    description="Organizers set price caps and transfer limits to prevent scalping."
                />
                <FeatureCard
                    icon={<Zap className="w-10 h-10 text-yellow-500" />}
                    title="Instant Verification"
                    description="Gatekeepers verify tickets in milliseconds with a simple QR scan."
                />
            </motion.div>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4 p-3 bg-secondary/50 rounded-xl w-fit">{icon}</div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </div>
    );
}

function TicketCardPreview({ variant = "blue" }: { variant?: "blue" | "purple" }) {
    const color = variant === "blue" ? "bg-blue-600" : "bg-purple-600";
    return (
        <div className="w-64 h-32 rounded-xl bg-card border shadow-2xl overflow-hidden relative rotate-12">
            <div className={`absolute left-0 top-0 bottom-0 w-4 ${color}`} />
            <div className="p-4 pl-8 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-lg bg-secondary animate-pulse" />
                    <div className="text-xs font-mono text-muted-foreground">#001</div>
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-3/4 bg-secondary rounded animate-pulse" />
                    <div className="h-3 w-1/2 bg-secondary rounded animate-pulse" />
                </div>
            </div>
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background border" />
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background border-r" />
        </div>
    );
}
