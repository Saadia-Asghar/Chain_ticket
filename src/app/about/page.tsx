"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <div className="container mx-auto py-20 px-4 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
            >
                <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    Reimagining Ticketing for Pakistan
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    ChainTicket+ is built to solve the critical issues of scalping, fraud, and lack of transparency in the traditional ticketing industry.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">The Problem</h2>
                    <p className="text-muted-foreground">
                        Event organizers in Pakistan lose millions to fake tickets and black market scalpers. Attendees often face uncertainty about the validity of their purchases.
                    </p>
                </div>
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">The Solution</h2>
                    <p className="text-muted-foreground">
                        By leveraging the Base blockchain, we issue non-fungible (NFT) tickets that are verifiable, secure, and programmable. Smart contracts enforce transfer limits and ownership.
                    </p>
                </div>
            </div>

            <div className="bg-secondary/30 rounded-3xl p-8 md:p-12 text-center">
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    To provide a standardized, decentralized ticketing infrastructure for universities, concerts, and tech conferences across Pakistan.
                </p>
            </div>
        </div>
    );
}
