// app/contexts/GrantContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { GrantContextData } from './types';

interface GrantContextValue {
    data: GrantContextData | null;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

const GrantContext = createContext<GrantContextValue | null>(null);

export function GrantProvider({ children }: { children: React.ReactNode }) {
    const [grantData, setGrantData] = useState<GrantContextData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchGrantData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/testGrants', { cache: 'no-store' });
            if (!response.ok) {
                throw new Error('Failed to fetch grant data');
            }

            const data = await response.json();

            // 基本数据验证
            if (!data || !data.currentGrant || !data.historyGrants || !data.globalConfig) {
                throw new Error('Invalid data structure received');
            }

            setGrantData(data);
        } catch (error) {
            console.error('Error fetching grant data:', error);
            setError(error instanceof Error ? error : new Error('Unknown error'));
        } finally {
            setIsLoading(false);
        }
    };

    // 初始加载
    useEffect(() => {
        fetchGrantData();
    }, []);

    const contextValue: GrantContextValue = {
        data: grantData,
        isLoading,
        error,
        refetch: fetchGrantData
    };

    if (error) {
        // 可以根据需要处理错误状态
        console.error('GrantContext Error:', error);
        return null;
    }

    return (
        <GrantContext.Provider value={contextValue}>
            {children}
        </GrantContext.Provider>
    );
}

export function useGrantContext() {
    const context = useContext(GrantContext);
    if (!context) {
        throw new Error('useGrantContext must be used within a GrantProvider');
    }
    return context;
}