"use client";

import { motion } from "framer-motion";
import { HelpCircle, Mail, MessageCircle, Phone, Search, Book, Video, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function HelpCenterPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const helpTopics = [
        {
            category: "Getting Started",
            icon: <Book className="w-6 h-6" />,
            articles: [
                { title: "How to connect your wallet", link: "/docs#connect-wallet" },
                { title: "Buying your first ticket", link: "/docs#buy-tickets" },
                { title: "Understanding blockchain tickets", link: "/docs#blockchain-tickets" },
                { title: "Setting up MetaMask", link: "/docs#metamask-setup" }
            ]
        },
        {
            category: "Tickets & Events",
            icon: <HelpCircle className="w-6 h-6" />,
            articles: [
                { title: "How to view my tickets", link: "/docs#view-tickets" },
                { title: "Transferring tickets to another wallet", link: "/docs#transfer-tickets" },
                { title: "What to do if I can't find my ticket", link: "/docs#lost-ticket" },
                { title: "Ticket verification process", link: "/docs#verify-ticket" }
            ]
        },
        {
            category: "For Organizers",
            icon: <Users className="w-6 h-6" />,
            articles: [
                { title: "Creating your first event", link: "/docs#create-event" },
                { title: "Managing ticket sales", link: "/docs#manage-sales" },
                { title: "Downloading attendee data", link: "/docs#attendee-data" },
                { title: "Verifying tickets at the gate", link: "/docs#gate-verification" }
            ]
        },
        {
            category: "Troubleshooting",
            icon: <Video className="w-6 h-6" />,
            articles: [
                { title: "Transaction failed or pending", link: "/docs#transaction-issues" },
                { title: "Wallet connection problems", link: "/docs#wallet-issues" },
                { title: "Can't see my purchased ticket", link: "/docs#missing-ticket" },
                { title: "QR code not loading", link: "/docs#qr-issues" }
            ]
        }
    ];

    const filteredTopics = helpTopics.map(topic => ({
        ...topic,
        articles: topic.articles.filter(article =>
            article.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(topic => topic.articles.length > 0);

    return (
        <div className="container mx-auto py-12 px-4 min-h-screen max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center"
            >
                <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    Help Center
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                    Find answers to common questions and get support for ChainTicket+
                </p>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                        placeholder="Search for help articles..."
                        className="pl-12 h-14 rounded-xl text-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </motion.div>

            {/* Contact Options */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold mb-6 text-center">Get in Touch</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ContactCard
                        icon={<Mail className="w-8 h-8" />}
                        title="Email Support"
                        description="Get help via email within 24 hours"
                        action="support@chainticket.com"
                        link="mailto:support@chainticket.com"
                    />
                    <ContactCard
                        icon={<MessageCircle className="w-8 h-8" />}
                        title="Live Chat"
                        description="Chat with our support team"
                        action="Start Chat"
                        link="#chat"
                    />
                    <ContactCard
                        icon={<Phone className="w-8 h-8" />}
                        title="Phone Support"
                        description="Call us Mon-Fri, 9AM-6PM PKT"
                        action="+92 300 1234567"
                        link="tel:+923001234567"
                    />
                </div>
            </section>

            {/* Help Topics */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold mb-6">Browse Help Topics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {(searchQuery ? filteredTopics : helpTopics).map((topic, index) => (
                        <motion.div
                            key={topic.category}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-card border rounded-2xl p-6 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                    {topic.icon}
                                </div>
                                <h3 className="text-xl font-bold">{topic.category}</h3>
                            </div>
                            <ul className="space-y-3">
                                {topic.articles.map((article, idx) => (
                                    <li key={idx}>
                                        <Link
                                            href={article.link}
                                            className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary" />
                                            {article.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {searchQuery && filteredTopics.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg mb-4">
                            No articles found for "{searchQuery}"
                        </p>
                        <Button variant="link" onClick={() => setSearchQuery("")}>
                            Clear search
                        </Button>
                    </div>
                )}
            </section>

            {/* Popular Questions */}
            <section className="mb-16 bg-gradient-to-br from-primary/5 to-purple-500/5 border rounded-3xl p-8">
                <h2 className="text-2xl font-bold mb-6">Popular Questions</h2>
                <div className="space-y-4">
                    <PopularQuestion
                        question="How do I get test ETH for Base Sepolia?"
                        answer="You can get free test ETH from the Base Sepolia faucet. Visit the Base documentation for faucet links."
                    />
                    <PopularQuestion
                        question="Can I get a refund for my ticket?"
                        answer="Refund policies are set by individual event organizers. Check the event details or contact the organizer directly."
                    />
                    <PopularQuestion
                        question="Is my ticket transferable?"
                        answer="Yes! Since tickets are NFTs, you can transfer them to any other wallet address. This enables a secure secondary market."
                    />
                    <PopularQuestion
                        question="What wallets are supported?"
                        answer="We support MetaMask, Coinbase Wallet, Safe (Gnosis Safe), and any injected Web3 wallet."
                    />
                    <PopularQuestion
                        question="How do I verify a ticket at my event?"
                        answer="Use the ticket verification page to scan QR codes. Each ticket has a unique token ID that can be verified on the blockchain."
                    />
                </div>
            </section>

            {/* Video Tutorials */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Video className="w-7 h-7 text-primary" />
                    Video Tutorials
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <VideoCard
                        title="Getting Started with ChainTicket+"
                        duration="5:30"
                        thumbnail="bg-gradient-to-br from-blue-500 to-purple-600"
                    />
                    <VideoCard
                        title="How to Buy Your First Ticket"
                        duration="3:45"
                        thumbnail="bg-gradient-to-br from-green-500 to-teal-600"
                    />
                    <VideoCard
                        title="Creating an Event as an Organizer"
                        duration="8:20"
                        thumbnail="bg-gradient-to-br from-orange-500 to-red-600"
                    />
                </div>
            </section>

            {/* Still Need Help */}
            <section className="text-center bg-card border rounded-3xl p-12">
                <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Can't find what you're looking for? Our support team is here to help you with any questions or issues.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Link href="/docs">
                        <Button className="rounded-xl">
                            <Book className="w-4 h-4 mr-2" />
                            View Documentation
                        </Button>
                    </Link>
                    <Button variant="outline" className="rounded-xl">
                        <Mail className="w-4 h-4 mr-2" />
                        Contact Support
                    </Button>
                </div>
            </section>
        </div>
    );
}

function ContactCard({ icon, title, description, action, link }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    action: string;
    link: string;
}) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-card border rounded-2xl p-6 text-center hover:shadow-lg transition-all"
        >
            <div className="inline-flex p-4 bg-primary/10 rounded-full text-primary mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
            <a href={link} className="text-primary font-medium hover:underline">
                {action}
            </a>
        </motion.div>
    );
}

function PopularQuestion({ question, answer }: { question: string; answer: string }) {
    return (
        <details className="bg-card border rounded-xl p-4 cursor-pointer group">
            <summary className="font-semibold flex items-center justify-between">
                {question}
                <HelpCircle className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" />
            </summary>
            <p className="mt-3 text-muted-foreground text-sm">{answer}</p>
        </details>
    );
}

function VideoCard({ title, duration, thumbnail }: { title: string; duration: string; thumbnail: string }) {
    return (
        <div className="group cursor-pointer">
            <div className={`${thumbnail} h-48 rounded-2xl mb-3 flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <div className="w-0 h-0 border-l-[16px] border-l-primary border-y-[10px] border-y-transparent ml-1" />
                </div>
                <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {duration}
                </div>
            </div>
            <h3 className="font-semibold group-hover:text-primary transition-colors">{title}</h3>
        </div>
    );
}
