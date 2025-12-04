"use client";

import { motion } from "framer-motion";
import { Users, Ticket, Calendar, ShieldCheck } from "lucide-react";

const stats = [
    { label: "Active Users", value: "10K+", icon: Users, color: "text-blue-500" },
    { label: "Tickets Minted", value: "50K+", icon: Ticket, color: "text-purple-500" },
    { label: "Events Hosted", value: "500+", icon: Calendar, color: "text-pink-500" },
    { label: "Fraud Prevented", value: "$1M+", icon: ShieldCheck, color: "text-green-500" },
];

export function StatsSection() {
    return (
        <section className="py-20 bg-secondary/20">
            <div className="container px-4 mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="text-center p-6 rounded-3xl bg-background/50 backdrop-blur-sm border hover:border-primary/50 transition-colors group"
                        >
                            <div className={`inline-flex p-4 rounded-2xl bg-secondary mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                            </div>
                            <h3 className="text-4xl font-black mb-2">{stat.value}</h3>
                            <p className="text-muted-foreground font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
