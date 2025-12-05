"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseEther } from "viem";
import { motion } from "framer-motion";
import { Calendar, Clock, DollarSign, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { WalletModal } from "@/components/WalletModal";
import { useRouter } from "next/navigation";
import { saveEvent, Event } from "@/services/storage";
import { useMockAccount } from "@/hooks/useMockAccount";

const ChainTicketPlusABI = [
    {
        "inputs": [
            { "internalType": "string", "name": "_name", "type": "string" },
            { "internalType": "uint256", "name": "_price", "type": "uint256" },
            { "internalType": "uint256", "name": "_supply", "type": "uint256" },
            { "internalType": "uint256", "name": "_eventStart", "type": "uint256" },
            { "internalType": "uint256", "name": "_eventEnd", "type": "uint256" },
            { "internalType": "uint256", "name": "_maxTransfers", "type": "uint256" }
        ],
        "name": "createEvent",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "nonpayable",
        "type": "function"
    }
] as const;

const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // Placeholder

export default function CreateEventPage() {
    const router = useRouter();
    const { isConnected } = useMockAccount();
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
    const [contractAddress, setContractAddress] = useState(CONTRACT_ADDRESS);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        supply: "",
        start: "",
        end: "",
        maxTransfers: "0",
    });

    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Check if wallet is connected
        if (!isConnected) {
            setIsWalletModalOpen(true);
            return;
        }

        // For demo purposes, we'll save to local storage even if contract interaction is mocked/fails
        // In a real app, this would happen after successful transaction confirmation

        const newEvent: Event = {
            id: Date.now().toString(),
            name: formData.name,
            description: "Event description placeholder", // Add description field to form if needed
            date: new Date(formData.start).toLocaleDateString(),
            time: new Date(formData.start).toLocaleTimeString(),
            location: "TBD", // Add location field to form
            city: "Online", // Add city field
            country: "Global", // Add country field
            price: formData.price,
            supply: parseInt(formData.supply),
            minted: 0,
            organizer: "You", // Get from profile or wallet
            organizerAddress: "0x...", // Get from wallet
            image: "bg-gradient-to-br from-blue-600 to-purple-600", // Default or upload
            category: "Conference" // Add category selector
        };

        saveEvent(newEvent);

        // Simulate contract write for now if address is placeholder
        if (contractAddress === "0x0000000000000000000000000000000000000000") {
            setTimeout(() => {
                router.push("/organizer");
            }, 1000);
            return;
        }

        // Validate contract address
        if (!contractAddress || contractAddress === "0x0000000000000000000000000000000000000000") {
            alert("Please enter a valid contract address.");
            return;
        }

        const startTimestamp = Math.floor(new Date(formData.start).getTime() / 1000);
        const endTimestamp = Math.floor(new Date(formData.end).getTime() / 1000);

        writeContract({
            address: contractAddress as `0x${string}`,
            abi: ChainTicketPlusABI,
            functionName: "createEvent",
            args: [
                formData.name,
                parseEther(formData.price),
                BigInt(formData.supply),
                BigInt(startTimestamp),
                BigInt(endTimestamp),
                BigInt(formData.maxTransfers),
            ],
        });
    };

    return (
        <div className="container mx-auto max-w-5xl py-12 px-4 min-h-screen flex flex-col lg:flex-row gap-12">

            {/* Left Side: Form */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-1"
            >
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Create Event</h1>
                    <p className="text-muted-foreground">Launch your event on the blockchain in seconds.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-card border rounded-3xl p-8 shadow-sm">
                    {CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000" && (
                        <div className="space-y-2 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                            <Label htmlFor="contractAddress" className="text-base text-yellow-600">Contract Address</Label>
                            <Input
                                id="contractAddress"
                                placeholder="0x..."
                                required
                                className="h-12 rounded-xl"
                                value={contractAddress}
                                onChange={(e) => setContractAddress(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                Enter the deployed ChainTicketPlus contract address to enable real transactions.
                            </p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-base">Event Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Base Hackathon 2025"
                            required
                            className="h-12 rounded-xl"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-base">Price (ETH)</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.0001"
                                    placeholder="0.05"
                                    required
                                    className="pl-10 h-12 rounded-xl"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="supply" className="text-base">Total Supply</Label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    id="supply"
                                    type="number"
                                    placeholder="1000"
                                    required
                                    className="pl-10 h-12 rounded-xl"
                                    value={formData.supply}
                                    onChange={(e) => setFormData({ ...formData, supply: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="start" className="text-base">Start Date</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    id="start"
                                    type="datetime-local"
                                    required
                                    className="pl-10 h-12 rounded-xl"
                                    value={formData.start}
                                    onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="end" className="text-base">End Date</Label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    id="end"
                                    type="datetime-local"
                                    required
                                    className="pl-10 h-12 rounded-xl"
                                    value={formData.end}
                                    onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="maxTransfers" className="text-base">Max Transfers (0 for Soulbound)</Label>
                        <Input
                            id="maxTransfers"
                            type="number"
                            required
                            className="h-12 rounded-xl"
                            value={formData.maxTransfers}
                            onChange={(e) => setFormData({ ...formData, maxTransfers: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">Set to 0 to make tickets non-transferable (Soulbound).</p>
                    </div>

                    <Button type="submit" className="w-full h-14 text-lg rounded-xl mt-4" disabled={isPending || isConfirming}>
                        {isPending ? "Creating Event..." : isConfirming ? "Confirming..." : "Create Event"} <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>

                    {isSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-green-500/10 border border-green-500/20 text-green-600 rounded-xl flex items-center gap-3"
                        >
                            <CheckCircle2 className="w-5 h-5" />
                            Event created successfully!
                        </motion.div>
                    )}
                </form>
            </motion.div>

            {/* Right Side: Preview */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-1 lg:pt-20"
            >
                <div className="sticky top-24">
                    <h2 className="text-xl font-bold mb-6 text-muted-foreground uppercase tracking-wider text-center">Ticket Preview</h2>

                    <div className="w-full max-w-md mx-auto aspect-[3/4] bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                        <div className="relative z-10">
                            <div className="bg-white/20 backdrop-blur-md self-start px-4 py-1.5 rounded-full text-white text-sm font-bold border border-white/20 inline-block mb-6">
                                Event Ticket
                            </div>
                            <h3 className="text-4xl font-bold leading-tight mb-2 break-words">
                                {formData.name || "Event Name"}
                            </h3>
                            <p className="text-white/80 text-lg">
                                {formData.start ? new Date(formData.start).toLocaleDateString() : "Date"}
                            </p>
                        </div>

                        <div className="relative z-10 space-y-6">
                            <div className="flex justify-between items-end border-b border-white/20 pb-6">
                                <div>
                                    <p className="text-white/60 text-sm uppercase tracking-wider mb-1">Price</p>
                                    <p className="text-3xl font-bold">{formData.price || "0.00"} ETH</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white/60 text-sm uppercase tracking-wider mb-1">Admit</p>
                                    <p className="text-xl font-bold">1 Person</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-white/20" />
                                    <span className="text-sm font-medium">Organizer</span>
                                </div>
                                <div className="h-12 w-12 bg-white rounded-lg p-1">
                                    <div className="w-full h-full bg-black rounded-sm opacity-20" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <WalletModal
                isOpen={isWalletModalOpen}
                onClose={() => setIsWalletModalOpen(false)}
            />
        </div>
    );
}
