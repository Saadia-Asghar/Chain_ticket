"use client";

import { useAccount } from "wagmi";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, MapPin, User, Save } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const AVAILABLE_INTERESTS = [
    "Hackathon", "Conference", "Music & Arts", "Workshop", "Networking", "Gaming", "DeFi", "NFTs", "DAO"
];

export default function ProfilePage() {
    const { address, isConnected } = useAccount();
    const { interests, setInterests, location, setLocation } = useUserPreferences();

    const [city, setCity] = useState(location?.city || "");
    const [country, setCountry] = useState(location?.country || "");
    const [isSaved, setIsSaved] = useState(false);

    const toggleInterest = (interest: string) => {
        if (interests.includes(interest)) {
            setInterests(interests.filter(i => i !== interest));
        } else {
            setInterests([...interests, interest]);
        }
    };

    const handleSaveLocation = () => {
        if (location) {
            setLocation({
                ...location,
                city,
                country
            });
        } else {
            setLocation({
                lat: 0, // Default or keep 0 if manual entry
                lng: 0,
                city,
                country
            });
        }
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    if (!isConnected) {
        return (
            <div className="container mx-auto py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold mb-4">Profile</h1>
                <p className="text-muted-foreground mb-8">Please connect your wallet to view your profile.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 px-4 min-h-screen max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">My Profile</h1>
                        <p className="text-muted-foreground font-mono">{address}</p>
                    </div>
                </div>

                {/* Interests Section */}
                <section className="bg-card border rounded-2xl p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-bold">Your Interests</h2>
                            <p className="text-muted-foreground text-sm">Select topics to personalize your feed.</p>
                        </div>
                        {interests.length > 0 && (
                            <Button variant="ghost" size="sm" onClick={() => setInterests([])} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                Clear All
                            </Button>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {AVAILABLE_INTERESTS.map((interest) => {
                            const isSelected = interests.includes(interest);
                            return (
                                <motion.button
                                    key={interest}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => toggleInterest(interest)}
                                    className={`
                                        px-4 py-2 rounded-full text-sm font-medium transition-all border
                                        ${isSelected
                                            ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/25"
                                            : "bg-secondary/50 text-secondary-foreground border-transparent hover:bg-secondary hover:border-primary/20"
                                        }
                                        flex items-center gap-2
                                    `}
                                >
                                    {isSelected && <Check className="w-3 h-3" />}
                                    {interest}
                                </motion.button>
                            );
                        })}
                    </div>
                </section>

                {/* Location Section */}
                <section className="bg-card border rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500/10 rounded-full">
                            <MapPin className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Location Settings</h2>
                            <p className="text-muted-foreground text-sm">Update your location to see events near you.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="e.g. Lahore"
                                className="h-11 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                                id="country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                placeholder="e.g. Pakistan"
                                className="h-11 rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-8">
                        <Button
                            onClick={handleSaveLocation}
                            disabled={isSaved}
                            className={`rounded-xl px-8 transition-all ${isSaved ? "bg-green-600 hover:bg-green-700" : ""}`}
                        >
                            {isSaved ? (
                                <>
                                    <Check className="w-4 h-4 mr-2" /> Saved Successfully
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" /> Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </section>
            </motion.div>
        </div>
    );
}
