import { useAccount as useWagmiAccount } from "wagmi";
import { useState, useEffect } from "react";

export function useMockAccount() {
    const { address: wagmiAddress, isConnected: isWagmiConnected, ...rest } = useWagmiAccount();
    const [mockAddress, setMockAddress] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("mockWalletAddress");
            if (stored) {
                setMockAddress(stored);
            }
        }

        // Listen for storage events to update state across components/tabs
        const handleStorageChange = () => {
            const stored = localStorage.getItem("mockWalletAddress");
            setMockAddress(stored);
        };

        window.addEventListener("storage", handleStorageChange);
        // Custom event for same-tab updates
        window.addEventListener("mock-wallet-update", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("mock-wallet-update", handleStorageChange);
        };
    }, []);

    const isMockConnected = !!mockAddress;

    // Prefer Wagmi connection, fallback to mock
    const address = wagmiAddress || mockAddress;
    const isConnected = isWagmiConnected || isMockConnected;

    const disconnectMock = () => {
        localStorage.removeItem("mockWalletAddress");
        setMockAddress(null);
        window.dispatchEvent(new Event("mock-wallet-update"));
    };

    return {
        ...rest,
        address: address as `0x${string}` | undefined,
        isConnected,
        isMockConnected,
        disconnectMock
    };
}

export const connectMockWallet = (address: string) => {
    localStorage.setItem("mockWalletAddress", address);
    window.dispatchEvent(new Event("mock-wallet-update"));
};
