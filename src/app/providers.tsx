"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected, metaMask, safe, coinbaseWallet } from "wagmi/connectors";
import { ThemeProvider } from "next-themes";
import { UserPreferencesProvider } from "@/context/UserPreferencesContext";
import { OnboardingModal } from "@/components/OnboardingModal";
import { useMemo } from "react";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    // Create config only on client-side to avoid SSR issues with MetaMask SDK
    const config = useMemo(() => {
        if (typeof window === 'undefined') {
            // Return a minimal config for SSR
            return createConfig({
                chains: [baseSepolia],
                transports: {
                    [baseSepolia.id]: http(),
                },
                connectors: [],
            });
        }

        // Full config with all connectors for client-side
        return createConfig({
            chains: [baseSepolia],
            transports: {
                [baseSepolia.id]: http(),
            },
            connectors: [
                injected(),
                metaMask(),
                safe(),
                coinbaseWallet({ appName: 'ChainTicket+' }),
            ],
        });
    }, []);

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <UserPreferencesProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                        <OnboardingModal />
                    </ThemeProvider>
                </UserPreferencesProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
