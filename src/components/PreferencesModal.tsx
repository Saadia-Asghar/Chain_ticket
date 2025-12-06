"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Heart } from "lucide-react";

interface PreferencesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PreferencesModal({ isOpen, onClose }: PreferencesModalProps) {
    const [city, setCity] = useState("");
    const [interests, setInterests] = useState("");

    const handleSave = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("user_location", city);
            localStorage.setItem("user_interests", interests);
            // Trigger an event so the app can react if needed
            window.dispatchEvent(new Event("preferencesUpdated"));
        }
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Welcome! Setup your preferences</DialogTitle>
                    <DialogDescription>
                        We use your location and interests to recommend the best events for you.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="pref-city" className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> Location (City)
                        </Label>
                        <Input
                            id="pref-city"
                            list="cities"
                            placeholder="e.g. Lahore"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
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
                        </datalist>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="pref-interests" className="flex items-center gap-2">
                            <Heart className="w-4 h-4" /> Interests
                        </Label>
                        <Input
                            id="pref-interests"
                            placeholder="e.g. NFT, DeFi, Music"
                            value={interests}
                            onChange={(e) => setInterests(e.target.value)}
                        />
                        <div className="text-xs text-muted-foreground">Separate multiple interests with commas.</div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSave}>Save Preferences</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
