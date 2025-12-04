"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-32">
            {/* Dynamic Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[128px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[128px] animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[100px] animate-spin-slow" />
            </div>

            <div className="container px-4 mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto space-y-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium animate-fade-in-up">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 font-bold">
                            New Generation Ticketing
                        </span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight">
                        Secure. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">Transparent.</span>
                        <br /> Unstoppable.
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Experience the future of events with Pakistan's first on-chain ticketing protocol.
                        Say goodbye to scalpers and hello to true ownership.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                        <Link href="/create-event">
                            <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 transition-all hover:scale-105">
                                Start Creating <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="/events">
                            <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-secondary/50 backdrop-blur-sm transition-all hover:scale-105">
                                Explore Events
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
