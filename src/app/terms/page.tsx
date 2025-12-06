"use client";

import { motion } from "framer-motion";
import { Shield, FileText, AlertCircle, Scale } from "lucide-react";

export default function TermsOfServicePage() {
    return (
        <div className="container mx-auto py-12 px-4 min-h-screen max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <div className="flex items-center justify-center gap-3 mb-6">
                    <Scale className="w-12 h-12 text-primary" />
                </div>
                <h1 className="text-5xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    Terms of Service
                </h1>
                <p className="text-center text-muted-foreground">
                    Last Updated: December 6, 2025
                </p>
            </motion.div>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
                {/* Introduction */}
                <section className="bg-card border rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-bold m-0">1. Introduction</h2>
                    </div>
                    <p className="text-muted-foreground">
                        Welcome to ChainTicket+ ("we," "our," or "us"). These Terms of Service ("Terms") govern your access to and use of the ChainTicket+ platform, including our website, mobile applications, and services (collectively, the "Platform").
                    </p>
                    <p className="text-muted-foreground">
                        By accessing or using the Platform, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use the Platform.
                    </p>
                </section>

                {/* Acceptance of Terms */}
                <section className="bg-card border rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-4">2. Acceptance of Terms</h2>
                    <p className="text-muted-foreground mb-4">
                        By using ChainTicket+, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. You also represent that:
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                        <li>• You are at least 18 years of age or the age of majority in your jurisdiction</li>
                        <li>• You have the legal capacity to enter into these Terms</li>
                        <li>• You will comply with all applicable laws and regulations</li>
                        <li>• All information you provide is accurate and truthful</li>
                    </ul>
                </section>

                {/* Platform Description */}
                <section className="bg-card border rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-4">3. Platform Description</h2>
                    <p className="text-muted-foreground">
                        ChainTicket+ is a decentralized ticketing platform built on blockchain technology. We provide a marketplace where:
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                        <li>• Event organizers can create and sell tickets as NFTs (Non-Fungible Tokens)</li>
                        <li>• Attendees can purchase, own, and transfer tickets securely</li>
                        <li>• Tickets are verified on the blockchain to prevent fraud and counterfeiting</li>
                        <li>• All transactions are recorded on the Base blockchain network</li>
                    </ul>
                </section>

                {/* User Responsibilities */}
                <section className="bg-card border rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-4">4. User Responsibilities</h2>

                    <h3 className="text-xl font-semibold mb-3">4.1 Wallet Security</h3>
                    <p className="text-muted-foreground mb-4">
                        You are solely responsible for maintaining the security of your cryptocurrency wallet and private keys. We do not have access to your wallet or private keys and cannot recover them if lost.
                    </p>

                    <h3 className="text-xl font-semibold mb-3">4.2 Account Conduct</h3>
                    <p className="text-muted-foreground mb-4">
                        You agree to:
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                        <li>• Use the Platform only for lawful purposes</li>
                        <li>• Not engage in fraudulent activities or market manipulation</li>
                        <li>• Not create fake events or sell counterfeit tickets</li>
                        <li>• Respect intellectual property rights of others</li>
                        <li>• Not attempt to hack, disrupt, or damage the Platform</li>
                    </ul>
                </section>

                {/* Tickets and NFTs */}
                <section className="bg-card border rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-4">5. Tickets and NFTs</h2>

                    <h3 className="text-xl font-semibold mb-3">5.1 Ticket Ownership</h3>
                    <p className="text-muted-foreground mb-4">
                        When you purchase a ticket, you receive an NFT representing that ticket. The NFT is stored on the blockchain and proves your ownership and right to attend the event.
                    </p>

                    <h3 className="text-xl font-semibold mb-3">5.2 Ticket Transfers</h3>
                    <p className="text-muted-foreground mb-4">
                        You may transfer your ticket NFT to another wallet address. Once transferred, you lose all rights associated with that ticket.
                    </p>

                    <h3 className="text-xl font-semibold mb-3">5.3 Ticket Validation</h3>
                    <p className="text-muted-foreground mb-4">
                        Tickets can only be used once. After validation at the event, the ticket is marked as "used" on the blockchain and cannot be reused.
                    </p>
                </section>

                {/* Payments and Fees */}
                <section className="bg-card border rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-4">6. Payments and Fees</h2>

                    <h3 className="text-xl font-semibold mb-3">6.1 Transaction Fees</h3>
                    <p className="text-muted-foreground mb-4">
                        All transactions on the Platform require payment of blockchain network fees (gas fees). These fees are paid to the blockchain network, not to ChainTicket+.
                    </p>

                    <h3 className="text-xl font-semibold mb-3">6.2 Platform Fees</h3>
                    <p className="text-muted-foreground mb-4">
                        ChainTicket+ may charge a service fee for ticket purchases and event creation. All fees will be clearly displayed before you confirm any transaction.
                    </p>

                    <h3 className="text-xl font-semibold mb-3">6.3 Refunds</h3>
                    <p className="text-muted-foreground mb-4">
                        Refund policies are determined by individual event organizers. ChainTicket+ does not guarantee refunds for purchased tickets. Contact the event organizer directly for refund requests.
                    </p>
                </section>

                {/* Intellectual Property */}
                <section className="bg-card border rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-4">7. Intellectual Property</h2>
                    <p className="text-muted-foreground mb-4">
                        The Platform, including all content, features, and functionality, is owned by ChainTicket+ and is protected by international copyright, trademark, and other intellectual property laws.
                    </p>
                    <p className="text-muted-foreground">
                        Event organizers retain all rights to their event content, images, and descriptions. By creating an event, you grant ChainTicket+ a license to display and promote your event on the Platform.
                    </p>
                </section>

                {/* Disclaimers */}
                <section className="bg-card border rounded-2xl p-8 border-amber-500/50 bg-amber-500/5">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="w-6 h-6 text-amber-500" />
                        <h2 className="text-2xl font-bold m-0">8. Disclaimers</h2>
                    </div>

                    <h3 className="text-xl font-semibold mb-3">8.1 Platform "As Is"</h3>
                    <p className="text-muted-foreground mb-4">
                        The Platform is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that the Platform will be error-free or uninterrupted.
                    </p>

                    <h3 className="text-xl font-semibold mb-3">8.2 Event Responsibility</h3>
                    <p className="text-muted-foreground mb-4">
                        ChainTicket+ is not responsible for the quality, safety, or legality of events listed on the Platform. Event organizers are solely responsible for their events.
                    </p>

                    <h3 className="text-xl font-semibold mb-3">8.3 Blockchain Risks</h3>
                    <p className="text-muted-foreground mb-4">
                        You acknowledge the risks associated with blockchain technology, including but not limited to:
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                        <li>• Price volatility of cryptocurrencies</li>
                        <li>• Potential for smart contract vulnerabilities</li>
                        <li>• Irreversibility of blockchain transactions</li>
                        <li>• Regulatory uncertainty</li>
                    </ul>
                </section>

                {/* Limitation of Liability */}
                <section className="bg-card border rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-4">9. Limitation of Liability</h2>
                    <p className="text-muted-foreground mb-4">
                        To the maximum extent permitted by law, ChainTicket+ and its affiliates, officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Platform.
                    </p>
                    <p className="text-muted-foreground">
                        Our total liability for any claims arising from your use of the Platform shall not exceed the amount you paid to ChainTicket+ in the twelve (12) months preceding the claim.
                    </p>
                </section>

                {/* Indemnification */}
                <section className="bg-card border rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-4">10. Indemnification</h2>
                    <p className="text-muted-foreground">
                        You agree to indemnify, defend, and hold harmless ChainTicket+ and its affiliates from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                        <li>• Your use of the Platform</li>
                        <li>• Your violation of these Terms</li>
                        <li>• Your violation of any rights of another party</li>
                        <li>• Events you organize through the Platform</li>
                    </ul>
                </section>

                {/* Termination */}
                <section className="bg-card border rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-4">11. Termination</h2>
                    <p className="text-muted-foreground mb-4">
                        We reserve the right to suspend or terminate your access to the Platform at any time, with or without notice, for any reason, including violation of these Terms.
                    </p>
                    <p className="text-muted-foreground">
                        Upon termination, your right to use the Platform will immediately cease. However, your tickets (NFTs) will remain on the blockchain and accessible through your wallet.
                    </p>
                </section>

                {/* Governing Law */}
                <section className="bg-card border rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-4">12. Governing Law</h2>
                    <p className="text-muted-foreground">
                        These Terms shall be governed by and construed in accordance with the laws of Pakistan, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be resolved in the courts of Lahore, Pakistan.
                    </p>
                </section>

                {/* Changes to Terms */}
                <section className="bg-card border rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-4">13. Changes to Terms</h2>
                    <p className="text-muted-foreground mb-4">
                        We reserve the right to modify these Terms at any time. We will notify users of significant changes by posting a notice on the Platform or sending an email to registered users.
                    </p>
                    <p className="text-muted-foreground">
                        Your continued use of the Platform after changes are posted constitutes your acceptance of the modified Terms.
                    </p>
                </section>

                {/* Contact Information */}
                <section className="bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-bold m-0">14. Contact Us</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                        If you have any questions about these Terms, please contact us:
                    </p>
                    <div className="space-y-2 text-muted-foreground">
                        <p><strong>Email:</strong> legal@chainticket.com</p>
                        <p><strong>Address:</strong> Lahore, Pakistan</p>
                        <p><strong>Website:</strong> chainticket.com</p>
                    </div>
                </section>

                {/* Acknowledgment */}
                <section className="bg-card border-2 border-primary/30 rounded-2xl p-8 text-center">
                    <p className="text-muted-foreground font-medium">
                        By using ChainTicket+, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                    </p>
                </section>
            </div>
        </div>
    );
}
