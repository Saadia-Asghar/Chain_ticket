"use client";

import Link from "next/link";
import { useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ModeToggle } from "@/components/ModeToggle";
import { Wallet } from "lucide-react";
import { WalletModal } from "@/components/WalletModal";
import { useMockAccount } from "@/hooks/useMockAccount";

export function Navbar() {
    const { address, isConnected, isMockConnected, disconnectMock } = useMockAccount();
    const { disconnect } = useDisconnect();
    const [mounted, setMounted] = useState(false);
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleDisconnect = () => {
        if (isMockConnected) {
            disconnectMock();
        } else {
            disconnect();
        }
    };

    if (!mounted) return null;

    return (
        <>
            <nav className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    ChainTicket+
                </Link>
                <div className="flex items-center gap-4">
                    <Link href="/create-event" className="text-sm font-medium hover:text-primary transition-colors hidden md:block">
                        Create Event
                    </Link>
                    <Link href="/events" className="text-sm font-medium hover:text-primary transition-colors hidden md:block">
                        Browse Events
                    </Link>
                    <Link href="/my-tickets" className="text-sm font-medium hover:text-primary transition-colors hidden md:block">
                        My Tickets
                    </Link>
                    <Link href="/organizer" className="text-sm font-medium hover:text-primary transition-colors hidden md:block">
                        Organizer
                    </Link>

                    {isConnected ? (
                        <div className="flex items-center gap-2 bg-secondary/50 pl-3 pr-1 py-1 rounded-full border">
                            <Link href="/profile" className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors">
                                {address?.slice(0, 6)}...{address?.slice(-4)}
                            </Link>
                            <Button variant="ghost" size="sm" className="h-7 rounded-full px-3 hover:bg-destructive/10 hover:text-destructive" onClick={handleDisconnect}>
                                Disconnect
                            </Button>
                        </div>
                    ) : (
                        <Button
                            size="sm"
                            onClick={() => setIsWalletModalOpen(true)}
                            className="rounded-full shadow-lg shadow-primary/20"
                        >
                            <Wallet className="w-4 h-4 mr-2" />
                            Connect Wallet
                        </Button>
                    )}
                    <ModeToggle />
                </div>
            </nav>

            <WalletModal
                isOpen={isWalletModalOpen}
                onClose={() => setIsWalletModalOpen(false)}
            />
        </>
    );
}
