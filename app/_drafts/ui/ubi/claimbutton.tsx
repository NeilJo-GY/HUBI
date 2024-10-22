'use client';
import React from 'react';
import { simulateContract, writeContract, getAccount } from '@wagmi/core';
import { implementationAbi } from '@/app/lib/abi';
import { Button } from 'antd';
import { config } from '@/app/lib/wagmi';
import { sepolia } from 'wagmi/chains';

const ClaimButton: React.FC<{ disabled: boolean }> = ({ disabled }) => {
    const handleClick = async () => {
        try {
            const { connector } = getAccount(config)

            const { request } = await simulateContract(config, {
                abi: implementationAbi,
                address: '0x1b88D99Ee6CEc6Ee0eEf2be3BBdCaE0490030044',
                functionName: 'claim',
                connector, 
                chainId: sepolia.id, 
            })

            const hash = await writeContract(config, request)

            alert(`Transaction successful: ${hash}`);
        } catch (error) {
            if (error instanceof Error) {
                alert(`Transaction failed: ${error.message}`);
            } else {
                alert(`Transaction failed: ${String(error)}`);
            }
        }
    };

    return (
        <Button
            type="primary"
            onClick={handleClick}
            disabled={disabled}
            block
        >
            Claim
        </Button>
    );
};

export default ClaimButton;
