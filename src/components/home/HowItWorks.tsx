"use client";

import { motion } from "framer-motion";
import { Wallet, Ticket, ScanLine } from "lucide-react";

const steps = [
    {
        title: "Connect Wallet",
        description: "Link your crypto wallet to get started instantly.",
        icon: Wallet,
    },
    {
        title: "Mint Ticket",
        description: "Purchase NFT tickets directly from organizers.",
        icon: Ticket,
    },
    {
        title: "Scan & Enter",
        description: "Show your QR code for instant verification.",
        icon: ScanLine,
    },
];

export function HowItWorks() {
    return (
        <section className="py-32 relative overflow-hidden">
            <div className="container px-4 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Get started with ChainTicket+ in three simple steps.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2 z-0" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="relative z-10 flex flex-col items-center text-center group"
                        >
                            <div className="w-24 h-24 rounded-3xl bg-card border-2 border-primary/20 flex items-center justify-center mb-8 shadow-2xl shadow-primary/10 group-hover:scale-110 group-hover:border-primary transition-all duration-300 bg-gradient-to-br from-background to-secondary">
                                <step.icon className="w-10 h-10 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                            <p className="text-muted-foreground leading-relaxed max-w-xs">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
