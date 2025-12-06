"use client";

import { useState, useRef } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { parseEther } from "viem";
import { motion } from "framer-motion";
import { Calendar, Clock, DollarSign, Users, ArrowRight, CheckCircle2, Upload, ImageIcon } from "lucide-react";
import { WalletModal } from "@/components/WalletModal";
import { useRouter } from "next/navigation";
import { saveEvent, Event } from "@/services/storage";
import { useMockAccount } from "@/hooks/useMockAccount";

export default function CreateEventPage() {
    const router = useRouter();
    const { isConnected, address } = useMockAccount();
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "Conference",
        price: "",
        supply: "",
        start: "",
        end: "",
        location: "",
        city: "",
        country: "",
        maxTransfers: "0",
        image: null as string | null
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    if (!isConnected) {
        return (
            <div className="container mx-auto py-20 px-4 min-h-screen flex flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md space-y-6"
                >
                    <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h1 className="text-3xl font-bold">Connect Wallet</h1>
                    <p className="text-muted-foreground text-lg">
                        Please connect your wallet to create and manage events.
                    </p>
                    <Button onClick={() => setIsWalletModalOpen(true)} className="mt-4">
                        Connect Wallet
                    </Button>
                </motion.div>
                <WalletModal
                    isOpen={isWalletModalOpen}
                    onClose={() => setIsWalletModalOpen(false)}
                />
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);

        try {
            console.log("Creating event:", formData);
            const newEvent: Event = {
                id: Date.now().toString(),
                name: formData.name,
                description: formData.description || "No description provided.",
                date: new Date(formData.start).toLocaleDateString(),
                time: new Date(formData.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                location: formData.location || "TBD",
                city: formData.city || "Online",
                country: formData.country || "Global",
                price: formData.price,
                supply: parseInt(formData.supply),
                minted: 0,
                organizer: "You",
                organizerAddress: address || "0x...",
                image: formData.image || "bg-gradient-to-br from-blue-600 to-purple-600",
                category: formData.category
            };

            // Save event (Logic is now non-blocking in storage.ts)
            await saveEvent(newEvent);

            console.log("Event saved successfully:", newEvent);

            // Wait a moment for UX
            await new Promise(resolve => setTimeout(resolve, 500));

            // Redirect to Organizer Dashboard
            router.push("/organizer");

        } catch (error) {
            console.error("Error creating event:", error);
            alert("Failed to create event. Please try again or check console.");
            setIsCreating(false);
        }
    };

    const categories = ["Hackathon", "Conference", "Music & Arts", "Workshop", "Networking", "Gaming", "DeFi", "NFTs", "DAO"];

    return (
        <div className="container mx-auto max-w-6xl py-12 px-4 min-h-screen flex flex-col lg:flex-row gap-12">
            {/* Left Side: Form */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-1"
            >
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Create Event</h1>
                    <p className="text-muted-foreground">Launch your event on the blockchain.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-card border rounded-3xl p-8 shadow-sm">

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <Label>Event Image</Label>
                        <div
                            className="border-2 border-dashed border-muted-foreground/25 rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors relative overflow-hidden group"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {formData.image ? (
                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <div className="p-4 bg-secondary rounded-full mb-3 group-hover:scale-110 transition-transform">
                                        <Upload className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <p className="text-sm text-muted-foreground font-medium">Click to upload cover image</p>
                                    <p className="text-xs text-muted-foreground/70 mt-1">PNG, JPG up to 5MB</p>
                                </>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Event Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Base Hackathon 2025"
                            required
                            className="h-12 rounded-xl"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <select
                                className="w-full h-12 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (ETH)</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.0001"
                                    required
                                    className="pl-10 h-12 rounded-xl"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="supply">Total Tickets</Label>
                            <Input
                                id="supply"
                                type="number"
                                required
                                className="h-12 rounded-xl"
                                value={formData.supply}
                                onChange={(e) => setFormData({ ...formData, supply: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location (Venue)</Label>
                            <Input
                                id="location"
                                placeholder="e.g. Expo Center"
                                required
                                className="h-12 rounded-xl"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                list="cities"
                                placeholder="e.g. Lahore"
                                required
                                className="h-12 rounded-xl"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            />
                            <datalist id="cities">
                                <option value="Lahore" />
                                <option value="Karachi" />
                                <option value="Islamabad" />
                                <option value="New York" />
                                <option value="London" />
                                <option value="Dubai" />
                                <option value="Singapore" />
                                <option value="Tokyo" />
                                <option value="San Francisco" />
                                <option value="Berlin" />
                                <option value="Paris" />
                                <option value="Toronto" />
                            </datalist>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                                id="country"
                                placeholder="e.g. Pakistan"
                                required
                                className="h-12 rounded-xl"
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="start">Start Date</Label>
                            <Input
                                id="start"
                                type="datetime-local"
                                required
                                className="h-12 rounded-xl"
                                value={formData.start}
                                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="end">End Date</Label>
                            <Input
                                id="end"
                                type="datetime-local"
                                required
                                className="h-12 rounded-xl"
                                value={formData.end}
                                onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            className="flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            rows={4}
                            required
                            value={formData.description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-14 text-lg rounded-xl mt-4 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25"
                        disabled={isCreating}
                    >
                        {isCreating ? (
                            <>Creating...</>
                        ) : (
                            <>Create Event <ArrowRight className="ml-2 w-5 h-5" /></>
                        )}
                    </Button>
                </form>
            </motion.div>

            {/* Right Side: Preview */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-1 lg:pt-20 hidden lg:block"
            >
                <div className="sticky top-24">
                    <h2 className="text-xl font-bold mb-6 text-muted-foreground uppercase tracking-wider text-center">Ticket Preview</h2>

                    {/* Updated Card Design */}
                    <div className="w-full max-w-sm mx-auto bg-card rounded-[2rem] overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 border border-white/10 relative group">
                        {/* Image Area */}
                        <div className="relative h-96 w-full overflow-hidden">
                            {formData.image ? (
                                <img src={formData.image} alt="Event Cover" className="w-full h-full object-cover" />
                            ) : (
                                <div className={`w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center`}>
                                    <ImageIcon className="w-16 h-16 text-white/50" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs font-bold border border-white/20 shadow-lg">
                                {formData.category}
                            </div>

                            <div className="absolute bottom-0 left-0 p-6 w-full text-white">
                                <h3 className="text-3xl font-bold leading-tight mb-2 line-clamp-2">{formData.name || "Event Name"}</h3>
                                <div className="flex items-center gap-4 text-sm text-white/90">
                                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formData.start ? new Date(formData.start).toLocaleDateString() : "Date"}</span>
                                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {formData.start ? new Date(formData.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Time"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Info Area */}
                        <div className="p-6 bg-card space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Price</p>
                                    <p className="text-2xl font-bold text-primary">{formData.price || "0"} ETH</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Available</p>
                                    <p className="text-lg font-bold">{formData.supply || "0"}</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-orange-500" />
                                    <span className="text-sm font-medium">You</span>
                                </div>
                                <span className="px-3 py-1 bg-secondary rounded-lg text-xs font-medium">
                                    {formData.city || "City"}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}
