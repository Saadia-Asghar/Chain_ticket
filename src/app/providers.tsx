"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected, metaMask, safe, coinbaseWallet } from "wagmi/connectors";
import { ThemeProvider } from "next-themes";

const config = createConfig({
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

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
