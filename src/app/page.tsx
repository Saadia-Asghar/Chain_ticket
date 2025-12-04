"use client";

import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { HowItWorks } from "@/components/home/HowItWorks";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col">
            <HeroSection />
            <StatsSection />
            <HowItWorks />
        </main>
    );
}
