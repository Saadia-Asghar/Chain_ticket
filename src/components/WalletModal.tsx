"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Connector, useConnect } from "wagmi";
import { X, Wallet, ArrowRight, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { connectMockWallet } from "@/hooks/useMockAccount";
import { useRouter } from "next/navigation";

interface WalletModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
    const { connectors, connect, isPending } = useConnect();
    const [mounted, setMounted] = useState(false);
    const [manualLink, setManualLink] = useState("");
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const uniqueConnectors = connectors.filter((c) => {
        // Filter out injected connector if no provider is found to prevent errors
        if (c.id === 'injected' && typeof window !== 'undefined' && !(window as any).ethereum) {
            return false;
        }
        return true;
    }).filter((c, index, self) =>
        index === self.findIndex((t) => t.id === c.id)
    );

    const handleConnect = (connector: Connector) => {
        connect({ connector }, {
            onSuccess: () => {
                onClose();
                // Only redirect if we are on a public page that doesn't require auth, 
                // or if we want to force profile. 
                // Better to stay on current page usually, but user asked for workflow fix.
                // Let's keep the redirect to profile or maybe just close if already on a protected page.
                // For now, keeping existing behavior but ensuring it works.
                // router.push("/profile"); 
                // actually, let's just close the modal. The protected pages will auto-update.
                // If we are on home, maybe go to dashboard? 
                // Let's leave the router.push for now as it was there, but maybe check path.
            },
            onError: (err: Error) => {
                console.error("Wallet connection error:", err);
                // Show more user-friendly error messages
                let errorMessage = err.message;
                if (err.message.includes("User rejected")) {
                    errorMessage = "Connection cancelled. Please try again.";
                } else if (err.message.includes("not installed") || err.message.includes("Provider not found")) {
                    errorMessage = "Wallet extension not detected. Please install a wallet like MetaMask.";
                } else if (err.message.includes("network")) {
                    errorMessage = "Network error. Please check your connection and try again.";
                }
                alert(errorMessage);
            }
        });
    };

    const handleManualConnect = () => {
        if (!manualLink) return;
        console.log("Connecting to link:", manualLink);

        // If it looks like an address, connect as mock wallet
        if (manualLink.startsWith("0x") && manualLink.length === 42) {
            connectMockWallet(manualLink);
            onClose();
            router.push("/profile");
        } else {
            // Otherwise treat as URI (placeholder for now)
            alert(`Connecting to: ${manualLink}`);
            onClose();
        }
    };

    if (!mounted) return null;

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
                        animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                        exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
                        className="fixed left-1/2 top-1/2 w-full max-w-md bg-background border rounded-3xl shadow-2xl z-[10000] overflow-hidden"
                    >
                        <div className="p-6 border-b flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-primary" />
                                Connect Wallet
                            </h2>
                            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted">
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="p-4">
                            <p className="text-sm text-muted-foreground mb-4 px-2">
                                Choose a wallet to connect to ChainTicket+.
                            </p>

                            <div className="space-y-2 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar mb-6">
                                {uniqueConnectors.map((connector) => (
                                    <button
                                        key={connector.uid}
                                        onClick={() => handleConnect(connector)}
                                        disabled={isPending}
                                        className="w-full flex items-center justify-between p-4 rounded-xl border hover:border-primary/50 hover:bg-secondary/50 transition-all group text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border">
                                                {connector.name === 'MetaMask' ? (
                                                    <div className="w-6 h-6 bg-orange-500 rounded-full" />
                                                ) : connector.name === 'Coinbase Wallet' ? (
                                                    <div className="w-6 h-6 bg-blue-500 rounded-full" />
                                                ) : (
                                                    <Wallet className="w-5 h-5 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold">{connector.name}</p>
                                                <p className="text-xs text-muted-foreground capitalize">{connector.id}</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                                    </button>
                                ))}
                            </div>

                            {/* Manual Link Input */}
                            <div className="pt-4 border-t">
                                <p className="text-xs font-medium mb-2 text-muted-foreground">Or connect via link</p>
                                <div className="flex gap-2">
                                    <div className="relative flex-grow">
                                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Enter wallet link..."
                                            className="pl-9 h-10 rounded-xl"
                                            value={manualLink}
                                            onChange={(e) => setManualLink(e.target.value)}
                                        />
                                    </div>
                                    <Button onClick={handleManualConnect} disabled={!manualLink} className="rounded-xl">
                                        Sign In
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t bg-muted/30 text-center text-xs text-muted-foreground">
                            By connecting, you agree to our Terms of Service and Privacy Policy.
                            <div className="mt-2">
                                <a
                                    href="https://metamask.io/download/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline font-medium"
                                >
                                    Don't have a wallet? Get one here.
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
}
