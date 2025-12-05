"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Check, MapPin, Loader2 } from "lucide-react";
import { useUserPreferences } from "@/context/UserPreferencesContext";

const AVAILABLE_INTERESTS = [
    "Hackathon", "Conference", "Music & Arts", "Workshop", "Networking", "Gaming", "DeFi", "NFTs", "DAO"
];

export function OnboardingModal() {
    const { hasOnboarded, setHasOnboarded, setInterests, setLocation } = useUserPreferences();
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState("");

    useEffect(() => {
        if (!hasOnboarded) {
            // Small delay to not be too aggressive
            const timer = setTimeout(() => setIsOpen(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [hasOnboarded]);

    const toggleInterest = (interest: string) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(i => i !== interest));
        } else {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    const handleNext = () => {
        setStep(2);
    };

    const handleLocationRequest = () => {
        setIsLocating(true);
        setLocationError("");

        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser.");
            setIsLocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                // Mock reverse geocoding for demo purposes (since we don't have a real API key here)
                // In a real app, you'd call Google Maps API or OpenStreetMap API
                const mockCity = "Lahore";
                const mockCountry = "Pakistan";

                setLocation({
                    lat: latitude,
                    lng: longitude,
                    city: mockCity,
                    country: mockCountry
                });

                setIsLocating(false);
                finishOnboarding();
            },
            (error) => {
                console.error("Error getting location:", error);
                setLocationError("Unable to retrieve your location. Please allow location access.");
                setIsLocating(false);
            }
        );
    };

    const finishOnboarding = () => {
        setInterests(selectedInterests);
        setHasOnboarded(true);
        setIsOpen(false);
    };

    const skipLocation = () => {
        finishOnboarding();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md">
                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <DialogHeader>
                                <DialogTitle>Welcome to ChainTicket+</DialogTitle>
                                <DialogDescription>
                                    Tell us what you're interested in so we can recommend the best events for you.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-3 gap-2 py-6">
                                {AVAILABLE_INTERESTS.map((interest) => (
                                    <Button
                                        key={interest}
                                        variant={selectedInterests.includes(interest) ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => toggleInterest(interest)}
                                        className="justify-start"
                                    >
                                        {selectedInterests.includes(interest) && <Check className="w-3 h-3 mr-2" />}
                                        {interest}
                                    </Button>
                                ))}
                            </div>
                            <DialogFooter>
                                <Button onClick={handleNext} disabled={selectedInterests.length === 0}>
                                    Next
                                </Button>
                            </DialogFooter>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <DialogHeader>
                                <DialogTitle>Find Events Near You</DialogTitle>
                                <DialogDescription>
                                    Enable location services to see events happening in your city.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="p-4 bg-primary/10 rounded-full">
                                    <MapPin className="w-8 h-8 text-primary" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    We use your location to filter events and show you what's happening nearby.
                                </p>
                                {locationError && (
                                    <p className="text-xs text-destructive">{locationError}</p>
                                )}
                            </div>
                            <DialogFooter className="flex-col sm:flex-row gap-2">
                                <Button variant="ghost" onClick={skipLocation}>
                                    Skip
                                </Button>
                                <Button onClick={handleLocationRequest} disabled={isLocating}>
                                    {isLocating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Enable Location
                                </Button>
                            </DialogFooter>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
