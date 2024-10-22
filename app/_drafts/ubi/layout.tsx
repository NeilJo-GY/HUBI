import React from 'react';
import { Metadata } from 'next';
import Navbar from '@/app/components/navbar';

export const metadata: Metadata = {
    title: 'UBI',
}

export default function UbiLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
            <div style={{ padding: '0 48px' }}>
                <div
                    style={{
                        minHeight: 280,
                        padding: 24,
                    }}
                >
                    {children}
                </div>
            </div>
        </>
    );
}