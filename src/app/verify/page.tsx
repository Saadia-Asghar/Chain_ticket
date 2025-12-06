"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode, ArrowRight, Search, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function VerifyLandingPage() {
    const [ticketId, setTicketId] = useState("");
    const router = useRouter();

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        if (ticketId.trim()) {
            router.push(`/verify/${ticketId.trim()}`);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 min-h-[80vh] flex flex-col items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full space-y-8 text-center"
            >
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                        <ShieldCheck className="w-12 h-12 text-primary" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Verify Ticket</h1>
                    <p className="text-muted-foreground">
                        Enter the Ticket ID manually or scan the QR code using your device's camera.
                    </p>
                </div>

                <div className="p-6 border-2 shadow-lg rounded-xl bg-card">
                    <form onSubmit={handleVerify} className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Enter Ticket ID (e.g. 173358...)"
                                value={ticketId}
                                onChange={(e) => setTicketId(e.target.value)}
                                className="pl-10 h-12 text-lg font-mono"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full h-12 text-lg font-semibold">
                            Verify Now <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </form>

                    <div className="mt-6 flex flex-col items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-full h-px bg-border mb-2" />
                        <span className="flex items-center gap-2">
                            <QrCode className="w-4 h-4" />
                            To scan a QR code, open your phone's camera app.
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
