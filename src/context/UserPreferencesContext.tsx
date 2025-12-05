"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface Location {
    lat: number;
    lng: number;
    city?: string;
    country?: string;
}

interface UserPreferencesContextType {
    interests: string[];
    setInterests: (interests: string[]) => void;
    location: Location | null;
    setLocation: (location: Location | null) => void;
    hasOnboarded: boolean;
    setHasOnboarded: (value: boolean) => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export function UserPreferencesProvider({ children }: { children: React.ReactNode }) {
    const [interests, setInterests] = useState<string[]>([]);
    const [location, setLocation] = useState<Location | null>(null);
    const [hasOnboarded, setHasOnboarded] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const storedInterests = localStorage.getItem("user_interests");
        const storedLocation = localStorage.getItem("user_location");
        const storedOnboarded = localStorage.getItem("user_has_onboarded");

        if (storedInterests) setInterests(JSON.parse(storedInterests));
        if (storedLocation) setLocation(JSON.parse(storedLocation));
        if (storedOnboarded) setHasOnboarded(JSON.parse(storedOnboarded));
    }, []);

    useEffect(() => {
        if (!mounted) return;
        localStorage.setItem("user_interests", JSON.stringify(interests));
    }, [interests, mounted]);

    useEffect(() => {
        if (!mounted) return;
        localStorage.setItem("user_location", JSON.stringify(location));
    }, [location, mounted]);

    useEffect(() => {
        if (!mounted) return;
        localStorage.setItem("user_has_onboarded", JSON.stringify(hasOnboarded));
    }, [hasOnboarded, mounted]);

    return (
        <UserPreferencesContext.Provider
            value={{
                interests,
                setInterests,
                location,
                setLocation,
                hasOnboarded,
                setHasOnboarded,
            }}
        >
            {children}
        </UserPreferencesContext.Provider>
    );
}

export function useUserPreferences() {
    const context = useContext(UserPreferencesContext);
    if (context === undefined) {
        throw new Error("useUserPreferences must be used within a UserPreferencesProvider");
    }
    return context;
}
