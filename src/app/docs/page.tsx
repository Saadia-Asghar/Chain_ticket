"use client";

import { motion } from "framer-motion";
import { Book, Code, Wallet, Ticket, Shield, Zap, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DocumentationPage() {
    return (
        <div className="container mx-auto py-12 px-4 min-h-screen max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center"
            >
                <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    Documentation
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Everything you need to know about ChainTicket+ - Pakistan's first decentralized anti-fraud ticketing protocol
                </p>
            </motion.div>

            {/* Quick Start */}
            <section className="mb-16">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <Zap className="w-8 h-8 text-primary" />
                    Quick Start Guide
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <QuickStartCard
                        number="1"
                        title="Connect Wallet"
                        description="Connect your Web3 wallet (MetaMask, Coinbase Wallet, or Safe) to get started"
                        icon={<Wallet className="w-6 h-6" />}
                    />
                    <QuickStartCard
                        number="2"
                        title="Browse Events"
                        description="Explore upcoming events and find the perfect experience for you"
                        icon={<Ticket className="w-6 h-6" />}
                    />
                    <QuickStartCard
                        number="3"
                        title="Purchase Tickets"
                        description="Buy tickets securely on the blockchain with instant confirmation"
                        icon={<Shield className="w-6 h-6" />}
                    />
                </div>
            </section>

            {/* For Attendees */}
            <section className="mb-16 bg-card border rounded-3xl p-8">
                <h2 className="text-3xl font-bold mb-6">For Attendees</h2>

                <div className="space-y-6">
                    <DocSection
                        title="How to Buy Tickets"
                        content={[
                            "1. Connect your Web3 wallet to ChainTicket+",
                            "2. Browse events or search for specific events",
                            "3. Click on an event to view details",
                            "4. Click 'Mint Ticket' and confirm the transaction in your wallet",
                            "5. Your ticket will appear in 'My Tickets' section"
                        ]}
                    />

                    <DocSection
                        title="Viewing Your Tickets"
                        content={[
                            "Navigate to 'My Tickets' from the navigation menu",
                            "All your purchased tickets will be displayed as interactive cards",
                            "Click on a ticket card to flip it and view the QR code",
                            "The QR code is used for entry verification at the event"
                        ]}
                    />

                    <DocSection
                        title="Ticket Verification"
                        content={[
                            "Each ticket has a unique QR code on the back",
                            "Show this QR code to the gatekeeper at the venue",
                            "The gatekeeper will scan it to verify authenticity",
                            "Once verified, the ticket is marked as 'used' on the blockchain",
                            "Tickets cannot be duplicated or counterfeited"
                        ]}
                    />

                    <DocSection
                        title="Supported Wallets"
                        content={[
                            "MetaMask - Browser extension and mobile app",
                            "Coinbase Wallet - Mobile and browser",
                            "Safe (Gnosis Safe) - Multi-signature wallet",
                            "Any injected Web3 wallet"
                        ]}
                    />
                </div>
            </section>

            {/* For Organizers */}
            <section className="mb-16 bg-card border rounded-3xl p-8">
                <h2 className="text-3xl font-bold mb-6">For Event Organizers</h2>

                <div className="space-y-6">
                    <DocSection
                        title="Creating an Event"
                        content={[
                            "1. Connect your wallet and navigate to 'Create Event'",
                            "2. Fill in event details (name, description, date, location)",
                            "3. Set ticket price in ETH and total supply",
                            "4. Upload event image or select a gradient",
                            "5. Deploy the event to the blockchain",
                            "6. Share the event link with your audience"
                        ]}
                    />

                    <DocSection
                        title="Managing Your Events"
                        content={[
                            "Access the 'Organizer Dashboard' to view all your events",
                            "Track ticket sales in real-time",
                            "View total revenue and attendee statistics",
                            "Download attendee data as CSV for event planning",
                            "Monitor ticket validation status"
                        ]}
                    />

                    <DocSection
                        title="Verifying Tickets at the Gate"
                        content={[
                            "Use the ticket verification page to scan QR codes",
                            "Each QR code contains a unique token ID",
                            "The system checks if the ticket is valid and unused",
                            "Click 'Approve Entry' to mark the ticket as used",
                            "The blockchain ensures tickets can't be reused"
                        ]}
                    />
                </div>
            </section>

            {/* Technical Documentation */}
            <section className="mb-16">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <Code className="w-8 h-8 text-primary" />
                    Technical Documentation
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TechCard
                        title="Smart Contract"
                        description="ChainTicket+ is built on Base Sepolia testnet using ERC-721 standard for NFT tickets"
                        items={[
                            "Contract Address: 0x...",
                            "Network: Base Sepolia",
                            "Standard: ERC-721",
                            "Verified on Basescan"
                        ]}
                    />

                    <TechCard
                        title="Technology Stack"
                        description="Modern Web3 stack for optimal performance and security"
                        items={[
                            "Frontend: Next.js 16 + React 19",
                            "Blockchain: Base (Ethereum L2)",
                            "Web3 Library: Wagmi + Viem",
                            "Styling: TailwindCSS"
                        ]}
                    />

                    <TechCard
                        title="Security Features"
                        description="Multiple layers of security to prevent fraud"
                        items={[
                            "Blockchain-based ticket ownership",
                            "Immutable ticket records",
                            "QR code verification",
                            "One-time use enforcement"
                        ]}
                    />

                    <TechCard
                        title="API & Integration"
                        description="Developer-friendly APIs for custom integrations"
                        items={[
                            "REST API for event data",
                            "WebSocket for real-time updates",
                            "Webhook support",
                            "GraphQL endpoint (coming soon)"
                        ]}
                    />
                </div>
            </section>

            {/* FAQs */}
            <section className="mb-16 bg-gradient-to-br from-primary/5 to-purple-500/5 border rounded-3xl p-8">
                <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>

                <div className="space-y-6">
                    <FAQ
                        question="What is ChainTicket+?"
                        answer="ChainTicket+ is Pakistan's first decentralized ticketing platform built on blockchain technology. It eliminates ticket fraud by using NFTs to represent tickets, ensuring authenticity and preventing counterfeiting."
                    />
                    <FAQ
                        question="Do I need cryptocurrency to buy tickets?"
                        answer="Yes, you need ETH (Ethereum) to purchase tickets. Since we're on Base Sepolia testnet, you can get free test ETH from a faucet for testing purposes."
                    />
                    <FAQ
                        question="Can I resell my ticket?"
                        answer="Yes! Since tickets are NFTs, you can transfer them to another wallet address. This enables a secure secondary market for tickets."
                    />
                    <FAQ
                        question="What happens if I lose my wallet?"
                        answer="Your tickets are stored on the blockchain, not on our servers. If you lose access to your wallet, you lose access to your tickets. Always backup your wallet's recovery phrase securely."
                    />
                    <FAQ
                        question="How do I get help?"
                        answer="Visit our Help Center or contact us through the support channels listed in the footer. We're here to help!"
                    />
                </div>
            </section>

            {/* Resources */}
            <section className="text-center">
                <h2 className="text-3xl font-bold mb-6">Additional Resources</h2>
                <div className="flex flex-wrap justify-center gap-4">
                    <Link href="/help">
                        <Button variant="outline" className="rounded-xl">
                            <Book className="w-4 h-4 mr-2" />
                            Help Center
                        </Button>
                    </Link>
                    <Link href="/terms">
                        <Button variant="outline" className="rounded-xl">
                            <Shield className="w-4 h-4 mr-2" />
                            Terms of Service
                        </Button>
                    </Link>
                    <a href="https://base.org" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="rounded-xl">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Learn About Base
                        </Button>
                    </a>
                </div>
            </section>
        </div>
    );
}

function QuickStartCard({ number, title, description, icon }: { number: string; title: string; description: string; icon: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: parseInt(number) * 0.1 }}
            className="bg-card border rounded-2xl p-6 hover:shadow-lg transition-all"
        >
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                    {number}
                </div>
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {icon}
                </div>
            </div>
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </motion.div>
    );
}

function DocSection({ title, content }: { title: string; content: string[] }) {
    return (
        <div className="border-l-4 border-primary pl-6 py-2">
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <ul className="space-y-2 text-muted-foreground">
                {content.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function TechCard({ title, description, items }: { title: string; description: string; items: string[] }) {
    return (
        <div className="bg-card border rounded-2xl p-6 hover:shadow-lg transition-all">
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
            <ul className="space-y-2">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function FAQ({ question, answer }: { question: string; answer: string }) {
    return (
        <div className="bg-card border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2">{question}</h3>
            <p className="text-muted-foreground">{answer}</p>
        </div>
    );
}
