'use client';
import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from '@/app/lib/wagmi';
import { ThirdwebProvider } from "thirdweb/react";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ThirdwebProvider>
                    {children}
                </ThirdwebProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}