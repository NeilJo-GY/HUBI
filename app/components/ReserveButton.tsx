import React, { useState } from 'react';
import { TransactionButton, useActiveWallet } from "thirdweb/react";
import { getContract, prepareContractCall } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { client } from '@/app/lib/thirdweb';
import { reservepregrantABI } from '@/app/lib/abi';

const ReservePreGrant = getContract({
    address: "0x54940600c7EBb651940b14Af13c06043ae709774",
    chain: sepolia,
    client,
    abi: reservepregrantABI,
});

export function ReserveButton() {
    const wallet = useActiveWallet();
    const [isLoading, setIsLoading] = useState(false);

    return (
        <TransactionButton
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
            disabled={!wallet || isLoading}
            transaction={async () => {
                setIsLoading(true);
                return await prepareContractCall({
                    contract: ReservePreGrant,
                    method: "reserveTokens",
                    params: [],
                });
            }}
            onError={(err) => {
                alert(err.message);
                setIsLoading(false);
            }}
            onTransactionSent={(tx) => {
                console.log("Transaction Sent:", tx);
                alert("Transaction Sent!");
            }}
            onTransactionConfirmed={(receipt) => {
                console.log("Transaction Confirmed:", receipt);
                alert("Transaction Confirmed!");
                setIsLoading(false);
            }}
        >
            Reserve
        </TransactionButton>
    );
}  