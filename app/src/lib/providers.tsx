'use client';
import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from '@/app/src/lib/wagmi';
import { ThirdwebProvider } from "thirdweb/react";
import { ApolloProvider } from '@apollo/client';
import client from '@/app/src/lib/apolloClient';
import { GrantProvider } from '@/app/src/contexts/GrantContext';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <ApolloProvider client={client}>
                <QueryClientProvider client={queryClient}>
                    <ThirdwebProvider>
                        <GrantProvider>
                            {children}
                        </GrantProvider>
                    </ThirdwebProvider>
                </QueryClientProvider>
            </ApolloProvider>
        </WagmiProvider>
    );
}